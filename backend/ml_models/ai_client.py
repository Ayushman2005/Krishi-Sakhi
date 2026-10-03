import os
import logging
import io
import time
import base64
import requests
from dotenv import load_dotenv
from PIL import Image

# Ensure environment variables are loaded
load_dotenv()

logger = logging.getLogger(__name__)

# ── Groq Cloud Configuration ─────────────────────────
groq_api_key = os.getenv("GROQ_API_KEY", "").strip()
groq_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
groq_vision_model = os.getenv("GROQ_VISION_MODEL", "qwen/qwen3.8-27b")
groq_endpoint = "https://api.groq.com/openai/v1/chat/completions"

# ── Ollama Local Configuration (Fallback) ────────────
ollama_host = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434").rstrip("/")
ollama_model = os.getenv("OLLAMA_MODEL", "llama3.2")

_status_cache = {"status": False, "provider": None, "last_check": 0.0}

def check_groq_status() -> bool:
    """Check if Groq API key is present."""
    global groq_api_key
    groq_api_key = os.getenv("GROQ_API_KEY", "").strip()
    return bool(groq_api_key and groq_api_key.startswith("gsk_"))

def check_ollama_status(cache_ttl: float = 5.0) -> bool:
    """
    Verify connection to local Ollama instance and ensure configured model exists.
    """
    global ollama_host
    hosts_to_try = [ollama_host]
    if "localhost" in ollama_host:
        hosts_to_try.append(ollama_host.replace("localhost", "127.0.0.1"))
    elif "127.0.0.1" in ollama_host:
        hosts_to_try.append(ollama_host.replace("127.0.0.1", "localhost"))

    for host in hosts_to_try:
        try:
            response = requests.get(f"{host}/api/tags", timeout=2)
            if response.status_code == 200:
                ollama_host = host
                data = response.json()
                models = [m.get("name", "") for m in data.get("models", [])]
                model_installed = any(
                    m == ollama_model or m.startswith(f"{ollama_model}:") or m.split(":")[0] == ollama_model
                    for m in models
                )
                return model_installed
        except Exception:
            continue
    return False

def check_ai_status(cache_ttl: float = 5.0) -> bool:
    """
    Check if either Groq or Ollama is available.
    """
    now = time.time()
    if now - _status_cache["last_check"] < cache_ttl:
        return _status_cache["status"]

    _status_cache["last_check"] = now

    if check_groq_status():
        _status_cache["status"] = True
        _status_cache["provider"] = "groq"
        return True

    if check_ollama_status():
        _status_cache["status"] = True
        _status_cache["provider"] = "ollama"
        return True

    _status_cache["status"] = False
    _status_cache["provider"] = None
    return False

def get_active_provider() -> str:
    """Return 'groq', 'ollama', or 'none'."""
    check_ai_status()
    return _status_cache.get("provider") or "none"

class DynamicAIConfigured:
    def __bool__(self):
        return check_ai_status()

    def __repr__(self):
        return str(check_ai_status())

# Aliased to maintain 100% backwards compatibility with existing imports
ai_configured = DynamicAIConfigured()
ollama_configured = ai_configured

class AIResponseWrapper:
    """Compatibility wrapper providing .text attribute."""
    def __init__(self, text: str):
        self.text = text

def _generate_with_groq(prompt_text: str, images_b64: list, is_json: bool = False):
    """
    Generate content using Groq's high-speed cloud LPU inference API.
    """
    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json"
    }

    # If images are provided, use the vision-capable model
    if images_b64:
        model = groq_vision_model
        content_parts = []
        if prompt_text:
            content_parts.append({"type": "text", "text": prompt_text})
        for b64 in images_b64:
            content_parts.append({
                "type": "image_url",
                "image_url": {"url": f"data:image/png;base64,{b64}"}
            })
        messages = [{"role": "user", "content": content_parts}]
    else:
        model = groq_model
        messages = [{"role": "user", "content": prompt_text}]

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 2048
    }

    if is_json:
        payload["response_format"] = {"type": "json_object"}

    logger.info(f"Sending request to Groq Cloud API with model '{model}'...")
    response = requests.post(groq_endpoint, json=payload, headers=headers, timeout=30)
    
    if response.status_code != 200:
        logger.error(f"Groq API returned {response.status_code}: {response.text}")
        response.raise_for_status()

    data = response.json()
    text = data["choices"][0]["message"]["content"]
    logger.info("Groq Cloud generation successful.")
    return AIResponseWrapper(text)

def _generate_with_ollama(prompt_text: str, images_b64: list, is_json: bool = False):
    """
    Generate content using local Ollama.
    """
    payload = {
        "model": ollama_model,
        "prompt": prompt_text.strip(),
        "stream": False
    }
    if images_b64:
        payload["images"] = images_b64

    if is_json:
        payload["format"] = "json"

    logger.info(f"Sending request to Ollama ({ollama_host}) with model '{ollama_model}'...")
    response = requests.post(
        f"{ollama_host}/api/generate",
        json=payload,
        headers={"Content-Type": "application/json"},
        timeout=60
    )
    response.raise_for_status()
    res_json = response.json()
    text_content = res_json.get("response", "")
    logger.info("Ollama generation successful.")
    return AIResponseWrapper(text_content)

def generate_content_with_fallback(contents, **kwargs):
    """
    Generate content using Groq Cloud API first, with fallback to Ollama.
    """
    prompt_text = ""
    images_b64 = []

    if isinstance(contents, str):
        prompt_text = contents
    elif isinstance(contents, list):
        for item in contents:
            if isinstance(item, str):
                prompt_text += item + "\n"
            elif isinstance(item, Image.Image) or (hasattr(item, "save") and hasattr(item, "convert")):
                try:
                    img = item.convert("RGB")
                    # Ensure image meets minimum 32x32 dimensions for Groq/Qwen vision
                    if img.width < 32 or img.height < 32:
                        img = img.resize((max(32, img.width), max(32, img.height)))
                    buffered = io.BytesIO()
                    img.save(buffered, format="PNG")
                    img_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
                    images_b64.append(img_b64)
                except Exception as e:
                    logger.error(f"Error encoding image: {e}")
            else:
                prompt_text += str(item) + "\n"
    else:
        prompt_text = str(contents)

    is_json = "json" in prompt_text.lower()

    # 1. Try Groq Cloud if API key is present
    if check_groq_status():
        try:
            return _generate_with_groq(prompt_text, images_b64, is_json)
        except Exception as e:
            logger.warning(f"Groq API call failed: {e}. Attempting Ollama fallback...")

    # 2. Fall back to Ollama if running
    if check_ollama_status():
        try:
            return _generate_with_ollama(prompt_text, images_b64, is_json)
        except Exception as e:
            logger.warning(f"Ollama generation failed: {e}")

    raise RuntimeError("No active AI provider (Groq or Ollama) could complete the request.")
