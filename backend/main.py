from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from google import genai
from dotenv import load_dotenv
import datetime
import logging

# Import Schemas
from schemas import ChatRequest

from ml_models.disease_model import router as disease_router
from ml_models.yield_model import router as yield_router
from ml_models.weather_model import router as weather_router
from ml_models.market_model import router as market_router
from ml_models.recommendation_model import router as recommendation_router
from ml_models.soil_model import router as soil_router
from ml_models.pest_model import router as pest_router
from ml_models.generative_decay import router as generative_decay_router
from ml_models.acoustic_monitor import router as acoustic_router
from ml_models.polyculture_solver import router as polyculture_router
from ml_models.carbon_ledger import router as carbon_router

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key and api_key != "your_gemini_api_key_here":
    try:
        gemini_client = genai.Client(api_key=api_key)
        model = gemini_client
        logger.info("✅ Gemini AI configured successfully.")
    except Exception as e:
        logger.error(f"❌ Failed to configure Gemini: {e}")
        model = None
else:
    logger.warning("⚠ Gemini API Key missing. Running in Demo Mode.")
    model = None

app = FastAPI(
    title="Krishi Sakhi API",
    version="2.1.0",
    description="AI-Powered Farming Assistant Backend"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(disease_router, prefix="/ml", tags=["Machine Learning"])
app.include_router(yield_router, prefix="/ml", tags=["Machine Learning"])
app.include_router(weather_router, tags=["Weather & Advisories"])
app.include_router(market_router, prefix="/ml", tags=["Machine Learning"])
app.include_router(recommendation_router, prefix="/ml",
                   tags=["Machine Learning"])
app.include_router(soil_router, prefix="/ml", tags=["Machine Learning"])
app.include_router(pest_router, prefix="/ml", tags=["Machine Learning"])
app.include_router(generative_decay_router, prefix="/ml", tags=["Machine Learning"])
app.include_router(acoustic_router, prefix="/ml", tags=["Machine Learning"])
app.include_router(polyculture_router, prefix="/ml", tags=["Machine Learning"])
app.include_router(carbon_router, prefix="/ml", tags=["Machine Learning"])


# Global Error Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global Error on {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "message": "An internal server error occurred.",
            "details": str(exc)
        },
    )

# ─────────────────────────────────
# Knowledge Base
# ─────────────────────────────────
KNOWLEDGE_BASE = """
Krishi Sakhi Expert Agricultural Knowledge:
- General NPK ratios vary by crop. Always test soil for exact requirements.
- Common diseases: Blight, Rust, Mildew. Early detection is key.
- Weather adaptations: Use drought-resistant varieties in dry areas, improve drainage in flood-prone zones.
- Organic: Compost, Neem extracts, and crop rotation enhance soil health globally.
- Seasonal: Align planting with local seasonal shifts (e.g., monsoons, spring thaw).
"""

# ─────────────────────────────────
# Core Routes
# ─────────────────────────────────


@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "version": "2.1.0",
        "timestamp": datetime.datetime.now().isoformat(),
        "ai_enabled": model is not None
    }


@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if not model:
        return {
            "response": (
                "Demo Mode: I'm running without an AI key. Based on your profile, "
                "I suggest applying Jeevamrutham this week for organic yield boost. "
                "Set your GEMINI_API_KEY in backend/.env for full AI capabilities.")}

    context = f"Profile: {
        request.profile}\nActivities: {
        request.activities}\n\nKnowledge:\n{KNOWLEDGE_BASE}"
    prompt = f"""You are Krishi Sakhi, a highly experienced agricultural AI for farmers worldwide.
Use the context to answer accurately. Be concise, practical, and warm.
Reply in the user's preferred language based on their prompt.

Context: {context}
User: {request.message}"""

    try:
        response = model.models.generate_content(model="gemini-2.0-flash", contents=prompt)
        return {"response": response.text}
    except Exception as e:
        logger.error(f"Gemini error: {e}")
        raise HTTPException(
            status_code=500, detail="AI engine temporarily unavailable.")


@app.get("/advisories")
async def get_advisories(crop: str, location: str):
    advisories = []
    if "dry" in location.lower() or "desert" in location.lower() or "arid" in location.lower():
        advisories.append({
            "id": "adv_heat",
            "type": "weather",
            "title": "Severe Heat/Drought Advisory",
            "content": "High temperatures detected. Apply heavy mulch and use drip irrigation to preserve soil moisture.",
            "priority": "high",
            "icon": "Sun"
        })
    if "coast" in location.lower() or "rain" in location.lower() or "flood" in location.lower():
        advisories.append({
            "id": "adv_flood",
            "type": "weather",
            "title": "Heavy Rain/Flood Alert",
            "content": "Potential heavy rains. Ensure proper drainage and check bund integrity.",
            "priority": "high",
            "icon": "CloudRain"
        })
    if crop == "Paddy":
        advisories.append({
            "id": "adv_pest",
            "type": "pest",
            "title": "Blast Disease Warning",
            "content": "High humidity favors Blast. Inspect for spindle-shaped leaf spots.",
            "priority": "medium",
            "icon": "Bug"
        })
    advisories.append({
        "id": "adv_gen",
        "type": "crop",
        "title": "Seasonal Fertilization",
        "content": "Optimal time to apply organic fertilizers for long-term soil health.",
        "priority": "low",
        "icon": "Sprout"
    })
    return advisories


@app.get("/market-trends")
async def get_market_trends():
    return [
        {"name": "Wheat", "price": "$280.00/MT",
         "trend": "up", "change": "+1.8%"},
        {"name": "Corn", "price": "$175.50/MT",
         "trend": "down", "change": "-1.5%"},
        {"name": "Soybeans", "price": "$430.00/MT",
         "trend": "up", "change": "+2.1%"},
        {"name": "Rice", "price": "$420.00/MT", "trend": "up", "change": "+0.8%"},
    ]


@app.get("/schemes")
async def get_schemes(
        state: str = "Global",
        crop: str = "General",
        land_size_acres: float = 2.0):
    schemes = [{"name": "PM-KISAN",
                "benefit": "₹6,000 per year in 3 equal installments.",
                "eligibility": "All landholding farmers."},
               {"name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                "benefit": "Crop insurance against natural calamities.",
                "eligibility": "Farmers growing notified crops."},
               {"name": "Kisan Credit Card (KCC)",
                "benefit": "Short-term formal credit at subsidized interest rates (4-7%).",
                "eligibility": "Farmers, tenant farmers, sharecroppers."},
               ]

    if state.lower() == "global" or state.lower() == "india":
        schemes.append({"name": "Sustainable Agriculture Mission",
                        "benefit": "Subsidies for integrated farming and sustainable practices.",
                        "eligibility": "Farmers worldwide / National guidelines."})
        if crop.lower() == "wheat" or crop.lower() == "rice":
            schemes.append({"name": "Staple Crop Protection Scheme",
                            "benefit": "Financial assistance for staple crop rejuvenation.",
                            "eligibility": "Staple crop farmers."})

    if land_size_acres < 5.0:
        schemes.append({"name": "Paramparagat Krishi Vikas Yojana (PKVY)",
                        "benefit": "Financial assistance for adopting organic farming.",
                        "eligibility": "Small/marginal farmers forming clusters."})

    return {"state": state, "crop": crop, "schemes": schemes}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
