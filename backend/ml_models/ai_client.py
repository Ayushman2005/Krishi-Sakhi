import os
import logging
import base64
from io import BytesIO
from PIL import Image
import httpx
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

logger = logging.getLogger(__name__)

api_key = os.getenv("ANTHROPIC_API_KEY")
gemini_configured = False
gemini_client = None

# Read primary model from env, default to claude-3-5-sonnet-20241022
primary_model = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
fallback_models = [
    "claude-3-5-haiku-20241022",
    "claude-3-opus-20240229",
]

class AnthropicClientMock:
    """Mock client object to maintain compatibility with downstream checks."""
    pass

if api_key and api_key != "your_anthropic_api_key_here":
    try:
        # We verify key exists and mark configured
        gemini_client = AnthropicClientMock()
        gemini_configured = True
        logger.info(f"Centralized Anthropic AI client configured. Primary model: {primary_model}")
    except Exception as e:
        logger.error(f"Failed to configure centralized Anthropic client: {e}")

class AnthropicResponse:
    """Wrapper class to match the response interface expected by downstream modules (e.g. response.text)."""
    def __init__(self, text: str):
        self.text = text

def convert_contents_to_blocks(contents):
    """Converts mixed prompt lists (strings, PIL Images) to Anthropic API content blocks."""
    if isinstance(contents, str):
        return [{"type": "text", "text": contents}]
    
    if not isinstance(contents, list):
        contents = [contents]
        
    blocks = []
    for item in contents:
        if isinstance(item, str):
            blocks.append({"type": "text", "text": item})
        elif hasattr(item, "save") or isinstance(item, Image.Image):
            buffered = BytesIO()
            # Save as JPEG for RGB, PNG for RGBA or others
            img_format = "JPEG" if item.mode in ("RGB", "L") else "PNG"
            item.save(buffered, format=img_format)
            img_bytes = buffered.getvalue()
            base64_data = base64.b64encode(img_bytes).decode("utf-8")
            media_type = f"image/{img_format.lower()}"
            blocks.append({
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": media_type,
                    "data": base64_data
                }
            })
        else:
            blocks.append({"type": "text", "text": str(item)})
    return blocks

def generate_content_with_fallback(contents, **kwargs):
    """
    Generate content with Anthropic Claude API.
    If the primary model fails, this helper automatically falls back to alternative models.
    """
    global primary_model
    if not gemini_configured:
        raise ValueError("Anthropic client is not configured (missing or invalid API key).")

    # Build unique list of models to try in order
    models_to_try = [primary_model]
    for m in fallback_models:
        if m not in models_to_try:
            models_to_try.append(m)

    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    content_blocks = convert_contents_to_blocks(contents)

    last_error = None
    for model_name in models_to_try:
        try:
            logger.info(f"Attempting Anthropic generate content with model: {model_name}")
            
            payload = {
                "model": model_name,
                "max_tokens": kwargs.get("max_tokens", 4096),
                "messages": [
                    {
                        "role": "user",
                        "content": content_blocks
                    }
                ]
            }
            if "temperature" in kwargs:
                payload["temperature"] = kwargs["temperature"]

            with httpx.Client() as client:
                response = client.post(
                    "https://api.anthropic.com/v1/messages",
                    json=payload,
                    headers=headers,
                    timeout=120.0
                )
            
            if response.status_code != 200:
                logger.error(f"Anthropic API Error (status={response.status_code}): {response.text}")
            response.raise_for_status()
            
            response_json = response.json()
            text_content = ""
            for block in response_json.get("content", []):
                if block.get("type") == "text":
                    text_content += block.get("text", "")

            logger.info(f"Successfully generated content with model: {model_name}")
            
            if model_name != primary_model:
                logger.info(f"Promoting {model_name} to primary model to optimize subsequent API requests.")
                primary_model = model_name
                
            return AnthropicResponse(text_content)
        except Exception as e:
            last_error = e
            logger.warning(
                f"Model {model_name} failed: {e}. Trying next fallback model if available..."
            )

    logger.error("All Anthropic model attempts failed.")
    raise last_error
