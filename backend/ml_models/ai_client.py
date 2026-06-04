import os
import logging
from google import genai
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

logger = logging.getLogger(__name__)

api_key = os.getenv("GEMINI_API_KEY")
gemini_client = None
gemini_configured = False

# Read primary model from env, default to gemini-2.0-flash
primary_model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
# A sequence of potential fallback models in case the primary model is throttled / out of quota
fallback_models = ["gemini-1.5-flash", "gemini-2.5-flash", "gemini-2.5-pro"]

if api_key and api_key != "your_gemini_api_key_here":
    try:
        gemini_client = genai.Client(api_key=api_key)
        gemini_configured = True
        logger.info(f"Centralized Gemini AI client configured. Primary model: {primary_model}")
    except Exception as e:
        logger.error(f"Failed to configure centralized Gemini client: {e}")

def generate_content_with_fallback(contents, **kwargs):
    """
    Generate content with Gemini API.
    If the primary model fails (e.g., due to 429 quota exhaustion), 
    this helper automatically falls back to alternative models.
    """
    if not gemini_client:
        raise ValueError("Gemini client is not configured (missing or invalid API key).")

    # Build unique list of models to try in order
    models_to_try = [primary_model]
    for m in fallback_models:
        if m not in models_to_try:
            models_to_try.append(m)

    last_error = None
    for model_name in models_to_try:
        try:
            logger.info(f"Attempting generate_content with model: {model_name}")
            # Ensure model argument is passed correctly to generate_content
            response = gemini_client.models.generate_content(
                model=model_name,
                contents=contents,
                **kwargs
            )
            logger.info(f"Successfully generated content with model: {model_name}")
            return response
        except Exception as e:
            last_error = e
            logger.warning(
                f"Model {model_name} failed: {e}. Trying next fallback model if available..."
            )

    logger.error("All Gemini model attempts failed.")
    raise last_error
