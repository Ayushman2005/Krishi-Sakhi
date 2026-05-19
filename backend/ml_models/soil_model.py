from fastapi import APIRouter, HTTPException, UploadFile, File
import logging
import io
import os
from google import genai
from PIL import Image

router = APIRouter()
logger = logging.getLogger(__name__)

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
gemini_configured = False
gemini_client = None
if api_key and api_key != "your_gemini_api_key_here":
    try:
        gemini_client = genai.Client(api_key=api_key)
        gemini_configured = True
    except Exception as e:
        logger.error(f"Failed to configure Gemini in Soil Model: {e}")


@router.post("/soil-report-ocr")
async def parse_soil_report(file: UploadFile = File(...)):
    """
    Parses a soil test report image and extracts key metrics using Gemini Vision.
    """
    if not gemini_configured:
        raise HTTPException(
            status_code=503, detail="Gemini API not configured.")

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400, detail="Only image files are accepted.")

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        prompt = """
        Analyze this soil test report. Extract the following parameters and return ONLY a valid JSON object.
        If a parameter is not found, set its value to null.
        Required JSON structure:
        {
            "ph": float,
            "nitrogen_kg_ha": float,
            "phosphorus_kg_ha": float,
            "potassium_kg_ha": float,
            "organic_carbon_percent": float,
            "electrical_conductivity": float,
            "recommendations": ["string"]
        }
        """
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[prompt, image]
        )

        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        import json
        data = json.loads(text)
        return data

    except Exception as e:
        logger.error(f"OCR Error: {e}")
        return {
            "ph": 6.5,
            "nitrogen_kg_ha": 120,
            "phosphorus_kg_ha": 40,
            "potassium_kg_ha": 45,
            "organic_carbon_percent": 0.8,
            "electrical_conductivity": 1.2,
            "recommendations": [
                "Apply 10kg/ha Zinc Sulphate",
                "Use neem-coated urea"],
            "note": "Fallback data used due to OCR/API failure."}
