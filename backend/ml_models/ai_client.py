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

# Load Ollama Configuration
ollama_host = os.getenv("OLLAMA_HOST", "http://localhost:11434").rstrip("/")
ollama_model = os.getenv("OLLAMA_MODEL", "llama3.2")

ollama_configured = False

try:
    # Verify connection to local Ollama instance
    response = requests.get(f"{ollama_host}/api/tags", timeout=3)
    if response.status_code == 200:
        ollama_configured = True
        logger.info(f"Ollama connection verified at {ollama_host}. Default model: {ollama_model}")
    else:
        logger.warning(f"Ollama returned status {response.status_code} at {ollama_host}. Running in Demo Mode.")
except Exception as e:
    logger.warning(f"Failed to reach Ollama at {ollama_host}: {e}. Running in Demo Mode.")

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
        response.raise_for_status()
        res_json = response.json()
        text_content = res_json.get("response", "")
        logger.info(f"Ollama generation successful.")
        return AIResponseWrapper(text_content)
    except Exception as e:
        logger.error(f"Ollama generation failed: {e}")
        raise e
