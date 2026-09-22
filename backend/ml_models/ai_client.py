import os
import logging
import io
import base64
import requests
from dotenv import load_dotenv
from PIL import Image

# Ensure environment variables are loaded
load_dotenv()

logger = logging.getLogger(__name__)

import time

# Load Ollama Configuration
ollama_host = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434").rstrip("/")
ollama_model = os.getenv("OLLAMA_MODEL", "llama3.2")

_ollama_status_cache = {"status": False, "last_check": 0.0}

def check_ollama_status(cache_ttl: float = 5.0) -> bool:
    """
    Verify connection to local Ollama instance and ensure configured model exists.
    With 5-second caching.
    Tries 127.0.0.1 automatically if localhost encounters Windows IPv6 resolution refusal.
    """
    global ollama_host
    now = time.time()
    if now - _ollama_status_cache["last_check"] < cache_ttl:
        return _ollama_status_cache["status"]

    _ollama_status_cache["last_check"] = now
    hosts_to_try = [ollama_host]
    if "localhost" in ollama_host:
        hosts_to_try.append(ollama_host.replace("localhost", "127.0.0.1"))
    elif "127.0.0.1" in ollama_host:
        hosts_to_try.append(ollama_host.replace("127.0.0.1", "localhost"))

    for host in hosts_to_try:
        try:
            response = requests.get(f"{host}/api/tags", timeout=3)
            if response.status_code == 200:
                ollama_host = host
                data = response.json()
                models = [m.get("name", "") for m in data.get("models", [])]

                # Check if configured model (or with tags, e.g. llama3.2:latest) is installed
                model_installed = any(
                    m == ollama_model or m.startswith(f"{ollama_model}:") or m.split(":")[0] == ollama_model
                    for m in models
                )

                if not model_installed:
                    if _ollama_status_cache["status"] or _ollama_status_cache.get("warned") != ollama_model:
                        logger.warning(
                            f"⚠️ Ollama is running at {ollama_host}, but model '{ollama_model}' is not pulled yet. "
                            f"Installed models: {models if models else 'None'}. "
                            f"Run 'ollama pull {ollama_model}' in your terminal to enable AI features. Falling back to local database."
                        )
                        _ollama_status_cache["warned"] = ollama_model
                    _ollama_status_cache["status"] = False
                    return False

                if not _ollama_status_cache["status"]:
                    logger.info(f"✅ Ollama connection verified at {ollama_host} with active model '{ollama_model}'.")
                _ollama_status_cache["status"] = True
                return True
        except Exception:
            continue

    if _ollama_status_cache["status"]:
        logger.warning(f"Failed to reach Ollama at {ollama_host}. Running in Demo Mode.")
    _ollama_status_cache["status"] = False
    return False

class DynamicOllamaConfigured:
    def __bool__(self):
        return check_ollama_status()

    def __repr__(self):
        return str(check_ollama_status())

ollama_configured = DynamicOllamaConfigured()

# Perform initial status check on startup
check_ollama_status()

class AIResponseWrapper:
    """
    Compatibility wrapper to match the response object's .text attribute.
    """
    def __init__(self, text):
        self.text = text

def generate_content_with_fallback(contents, **kwargs):
    """
    Generate content using local Ollama.
    """
    if not ollama_configured:
        raise ValueError("Ollama service is not configured or running.")

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
                    buffered = io.BytesIO()
                    # Convert to RGB to ensure PNG compatibility
                    if item.mode in ("RGBA", "P"):
                        item = item.convert("RGB")
                    item.save(buffered, format="PNG")
                    img_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
                    images_b64.append(img_b64)
                except Exception as e:
                    logger.error(f"Error encoding image for Ollama: {e}")
            else:
                prompt_text += str(item) + "\n"
    else:
        prompt_text = str(contents)

    payload = {
        "model": ollama_model,
        "prompt": prompt_text.strip(),
        "stream": False
    }
    if images_b64:
        payload["images"] = images_b64

    # Request JSON output format from Ollama if prompt requests JSON
    if "json" in prompt_text.lower():
        payload["format"] = "json"

    logger.info(f"Sending request to Ollama ({ollama_host}) with model '{ollama_model}'...")
    try:
        response = requests.post(
            f"{ollama_host}/api/generate",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=60  # Local models can take a moment to generate, especially vision
        )
        if response.status_code != 200:
            err_detail = response.text
            try:
                err_detail = response.json().get("error", response.text)
            except Exception:
                pass
            logger.error(f"Ollama server returned {response.status_code}: {err_detail}")
        response.raise_for_status()
        res_json = response.json()
        text_content = res_json.get("response", "")
        logger.info(f"Ollama generation successful.")
        return AIResponseWrapper(text_content)
    except Exception as e:
        logger.error(f"Ollama generation failed: {e}")
        raise e
