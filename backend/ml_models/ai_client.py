import os
import logging
import io
import base64
from openai import OpenAI
from google import genai
from dotenv import load_dotenv
from PIL import Image

# Ensure environment variables are loaded
load_dotenv()

logger = logging.getLogger(__name__)

# Load API keys
openai_key = os.getenv("OPENAI_API_KEY")
gemini_key = os.getenv("GEMINI_API_KEY")

openai_client = None
openai_configured = False
gemini_client = None
gemini_configured = False

# Initialize OpenAI if key is present and not placeholder
if openai_key and openai_key != "your_openai_api_key_here":
    try:
        openai_client = OpenAI(api_key=openai_key)
        openai_configured = True
        logger.info("Centralized OpenAI client configured.")
    except Exception as e:
        logger.error(f"Failed to configure centralized OpenAI client: {e}")

# Initialize Gemini if key is present and not placeholder
if gemini_key and gemini_key != "your_gemini_api_key_here":
    try:
        gemini_client = genai.Client(api_key=gemini_key)
        gemini_configured = True
        logger.info("Centralized Gemini client configured.")
    except Exception as e:
        logger.error(f"Failed to configure centralized Gemini client: {e}")

# Read primary model from env, default to gpt-4o-mini
primary_model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# Fallback sequence supporting cross-provider fallback (OpenAI -> Gemini)
fallback_models = [
    "gpt-4o",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-2.0-flash-lite",
    "gemini-2.5-pro"
]

class AIResponseWrapper:
    """
    Compatibility wrapper to match the response object's .text attribute across providers.
    """
    def __init__(self, text):
        self.text = text

def generate_content_with_fallback(contents, **kwargs):
    """
    Generate content supporting cross-provider fallbacks.
    Tries OpenAI models first (if configured), then falls back to Gemini models.
    """
    global primary_model
    
    # Build unique list of models to try in order
    models_to_try = [primary_model]
    for m in fallback_models:
        if m not in models_to_try:
            models_to_try.append(m)

    last_error = None
    for model_name in models_to_try:
        is_openai_model = model_name.startswith("gpt-")
        is_gemini_model = model_name.startswith("gemini-")
        
        # Skip if the selected provider client is not configured
        if is_openai_model and not openai_client:
            continue
        if is_gemini_model and not gemini_client:
            continue
            
        try:
            if is_openai_model:
                logger.info(f"Attempting OpenAI chat completion with model: {model_name}")
                
                # Format contents for OpenAI Chat Completion Vision / Text API
                messages = []
                if isinstance(contents, str):
                    messages.append({"role": "user", "content": contents})
                elif isinstance(contents, list):
                    content_parts = []
                    for item in contents:
                        if isinstance(item, str):
                            content_parts.append({"type": "text", "text": item})
                        elif isinstance(item, Image.Image) or (hasattr(item, "save") and hasattr(item, "convert")):
                            buffered = io.BytesIO()
                            item.save(buffered, format="PNG")
                            img_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
                            content_parts.append({
                                "type": "image_url",
                                "image_url": {"url": f"data:image/png;base64,{img_b64}"}
                            })
                        else:
                            content_parts.append({"type": "text", "text": str(item)})
                    messages.append({"role": "user", "content": content_parts})
                else:
                    messages.append({"role": "user", "content": str(contents)})

                response = openai_client.chat.completions.create(
                    model=model_name,
                    messages=messages,
                    **kwargs
                )
                text_content = response.choices[0].message.content
                
            elif is_gemini_model:
                logger.info(f"Attempting Gemini content generation with model: {model_name}")
                
                # Gemini client generate_content accepts strings and PIL Images directly
                response = gemini_client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    **kwargs
                )
                text_content = response.text
                
            else:
                raise ValueError(f"Unknown model provider for model: {model_name}")
                
            logger.info(f"Successfully generated content with model: {model_name}")
            
            if model_name != primary_model:
                logger.info(f"Promoting {model_name} to primary model to optimize subsequent API requests.")
                primary_model = model_name
                
            return AIResponseWrapper(text_content)
            
        except Exception as e:
            last_error = e
            logger.warning(
                f"Model {model_name} failed: {e}. Trying next fallback model if available..."
            )

    logger.error("All OpenAI and Gemini model attempts failed.")
    if last_error:
        raise last_error
    else:
        raise ValueError("No AI clients (OpenAI or Gemini) are configured.")
