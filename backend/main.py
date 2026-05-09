from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import google.generativeai as genai
from dotenv import load_dotenv
from typing import List, Optional
import datetime
import logging
import random

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key and api_key != "your_gemini_api_key_here":
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        logger.info("✅ Gemini AI configured successfully.")
    except Exception as e:
        logger.error(f"❌ Failed to configure Gemini: {e}")
        model = None
else:
    logger.warning("⚠ Gemini API Key missing. Running in Demo Mode.")
    model = None

app = FastAPI(title="Krishi Sakhi API", version="2.1.0", description="AI-Powered Farming Assistant Backend")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Error Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global Error on {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "An internal server error occurred.", "details": str(exc)},
    )

# ─────────────────────────────────
# Pydantic Models
# ─────────────────────────────────
class Profile(BaseModel):
    name: str
    location: str
    crop: str
    irrigation: str

class Activity(BaseModel):
    type: str
    note: str
    timestamp: str

class ChatRequest(BaseModel):
    message: str
    profile: Optional[Profile] = None
    activities: Optional[List[Activity]] = []

class YieldRequest(BaseModel):
    crop: str
    land_size: float
    rainfall_mm: float
    temperature_avg: float
    soil_ph: float
    nitrogen_kg_ha: float
    phosphorus_kg_ha: float
    potassium_kg_ha: float
    irrigation_type: str
    growth_stage: str

class WeatherRequest(BaseModel):
    crop: str
    location: str
    temperature: float
    humidity: float
    rainfall_mm: float
    wind_speed: float
    uv_index: float
    forecast: str

# ─────────────────────────────────
# Knowledge Base
# ─────────────────────────────────
KNOWLEDGE_BASE = """
Krishi Sakhi Expert Agricultural Knowledge:
- Paddy NPK: 90:45:45 kg/ha. Zinc deficiency → yellowing of leaves.
- Blast disease: Spindle-shaped spots. Apply Tricyclazole @0.6g/L.
- Kerala districts: Palakkad (heat), Kuttanad (submerged fields), Idukki (spices), Wayanad (tribal farming).
- Organic: Jeevamrutham (cow-based), Panchagavya, Neem cake, Vermiculture.
- Monsoons: South-West (June–Sept), North-East (Oct–Nov).
- Rubber tapping: Best done early morning (5–8 AM).
"""

DISEASE_CLASSES = ["Healthy", "Leaf Blast", "Brown Plant Hopper", "Neck Rot", "Sheath Blight", "Tungro Virus"]
CROP_BENCHMARKS = {
    "Paddy":     {"unit": "quintals/acre", "avg": 20, "good": 25, "excellent": 30},
    "Coconut":   {"unit": "nuts/tree/yr",  "avg": 60, "good": 80, "excellent": 100},
    "Rubber":    {"unit": "kg/acre/yr",    "avg": 350, "good": 500, "excellent": 650},
    "Vegetables":{"unit": "quintals/acre", "avg": 80, "good": 120, "excellent": 160},
    "Banana":    {"unit": "bunches/acre",  "avg": 700, "good": 900, "excellent": 1100},
}

# ─────────────────────────────────
# Core Routes
# ─────────────────────────────────
@app.get("/health")
async def health_check():
    return {"status": "online", "version": "2.1.0", "timestamp": datetime.datetime.now().isoformat(), "ai_enabled": model is not None}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if not model:
        return {"response": "Demo Mode: I'm running without an AI key. Based on your profile, I suggest applying Jeevamrutham this week for organic yield boost. Set your GEMINI_API_KEY in backend/.env for full AI capabilities."}

    context = f"Profile: {request.profile}\nActivities: {request.activities}\n\nKnowledge:\n{KNOWLEDGE_BASE}"
    prompt = f"""You are Krishi Sakhi, a highly experienced agricultural AI for Kerala farmers.
Use the context to answer accurately. Be concise, practical, and warm.
If asked in Malayalam, reply in Malayalam.

Context: {context}
User: {request.message}"""
    
    try:
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        logger.error(f"Gemini error: {e}")
        raise HTTPException(status_code=500, detail="AI engine temporarily unavailable.")

@app.get("/advisories")
async def get_advisories(crop: str, location: str):
    advisories = []
    if "Palakkad" in location:
        advisories.append({"id": "adv_heat", "type": "weather", "title": "Severe Heat Advisory",
            "content": "Palakkad is experiencing 38°C. Apply heavy mulch to preserve soil moisture.", "priority": "high", "icon": "Sun"})
    if any(k in location for k in ["Alappuzha", "Kuttanad"]):
        advisories.append({"id": "adv_flood", "type": "weather", "title": "Submerged Field Alert",
            "content": "Water levels rising. Check bund integrity immediately.", "priority": "high", "icon": "CloudRain"})
    if crop == "Paddy":
        advisories.append({"id": "adv_pest", "type": "pest", "title": "Blast Disease Warning",
            "content": "High humidity favors Blast. Inspect for spindle-shaped leaf spots.", "priority": "medium", "icon": "Bug"})
    advisories.append({"id": "adv_gen", "type": "crop", "title": "Seasonal Fertilization",
        "content": "Optimal time to apply organic fertilizers for long-term soil health.", "priority": "low", "icon": "Sprout"})
    return advisories

@app.get("/market-trends")
async def get_market_trends():
    return [
        {"name": "Paddy (Jaya)", "price": "₹28.80", "trend": "up", "change": "+1.8%"},
        {"name": "Coconut (Dry)", "price": "₹31.50", "trend": "down", "change": "-1.5%"},
        {"name": "Rubber (RSS-4)", "price": "₹164.00", "trend": "up", "change": "+2.1%"},
        {"name": "Arecanut", "price": "₹420.00", "trend": "up", "change": "+0.8%"},
    ]

# ─────────────────────────────────
# ML Model Routes
# ─────────────────────────────────

@app.post("/ml/disease-detect")
async def disease_detect(file: UploadFile = File(...)):
    """
    CNN-based Plant Disease Detection.
    Production: Load a TensorFlow/PyTorch MobileNet model trained on PlantVillage dataset.
    Demo: Returns a weighted random simulation.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted.")
    
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be under 10MB.")

    logger.info(f"Analyzing image: {file.filename}, size: {len(contents)} bytes")

    # ── Production stub: replace with actual model inference ──
    # import tensorflow as tf
    # img = preprocess(contents)
    # logits = model.predict(img)
    # prediction = DISEASE_CLASSES[np.argmax(logits)]
    # confidence = float(np.max(softmax(logits)))

    # Demo simulation with realistic distribution
    weights = [0.35, 0.25, 0.15, 0.10, 0.10, 0.05]
    predicted_idx = random.choices(range(len(DISEASE_CLASSES)), weights=weights, k=1)[0]
    confidence = round(random.uniform(0.78, 0.96), 2)
    
    other_scores = [(1 - confidence) * w / sum(weights[:predicted_idx] + weights[predicted_idx+1:]) for w in weights]
    all_preds = [{"label": cls, "score": round(confidence if i == predicted_idx else other_scores[i] * (1 - confidence), 3)}
                 for i, cls in enumerate(DISEASE_CLASSES)]
    all_preds.sort(key=lambda x: x["score"], reverse=True)

    return {
        "prediction": DISEASE_CLASSES[predicted_idx],
        "confidence": confidence,
        "all_predictions": all_preds[:4],
    }

@app.post("/ml/yield-predict")
async def yield_predict(request: YieldRequest):
    """
    Regression-based Crop Yield Prediction.
    Production: Gradient Boosting (XGBoost/LightGBM) model trained on Kerala crop datasets.
    Demo: Multi-factor heuristic calculation.
    """
    bench = CROP_BENCHMARKS.get(request.crop, CROP_BENCHMARKS["Paddy"])
    
    # Feature engineering (mirrors what an ML model would learn)
    rainfall_factor = min(request.rainfall_mm / 1500, 1.2)
    temp_factor = 1.0 if 20 <= request.temperature_avg <= 32 else 0.85
    ph_factor = 1.0 if 6.0 <= request.soil_ph <= 7.0 else 0.88
    nutrient_score = min((request.nitrogen_kg_ha + request.phosphorus_kg_ha + request.potassium_kg_ha) / (90 + 45 + 45), 1.3)
    irrigation_bonus = 1.1 if request.irrigation_type == "Drip" else 1.0
    
    raw_per_unit = bench["avg"] * rainfall_factor * temp_factor * ph_factor * min(nutrient_score, 1.3) * irrigation_bonus
    estimated_yield = round(raw_per_unit * request.land_size, 1)
    potential_yield = round(bench["good"] * request.land_size, 1)
    efficiency = round((estimated_yield / potential_yield) * 100, 1)

    recs = []
    if nutrient_score < 0.9: recs.append(f"Increase NPK application. Recommended: {90}:{45}:{45} kg/ha for {request.crop}.")
    if request.rainfall_mm < 1200: recs.append("Supplement with irrigation during dry spells to maintain moisture.")
    if not (6.0 <= request.soil_ph <= 7.0): recs.append(f"Soil pH {request.soil_ph} is suboptimal. Lime application advised if acidic.")
    if request.irrigation_type != "Drip": recs.append("Drip irrigation can improve efficiency by up to 10%.")
    recs.append("Consider intercropping with legumes to fix nitrogen naturally.")

    return {
        "estimated_yield": estimated_yield,
        "potential_yield": potential_yield,
        "unit": bench["unit"],
        "efficiency": efficiency,
        "recommendations": recs[:3],
    }

@app.post("/ml/weather-advisory")
async def weather_advisory(request: WeatherRequest):
    """
    NLP Rules-Engine Weather Advisory.
    Production: Fine-tuned LLM (Gemini/GPT) or LSTM time-series forecaster.
    Demo: Deterministic rules-based engine.
    """
    alerts = []
    
    if request.rainfall_mm > 50:
        alerts.append({"risk": "high", "label": "Heavy Rainfall", "action": f"Drain excess water from {request.crop} fields. Check bund/drainage integrity.", "icon": "CloudRain"})
    if request.temperature > 35:
        alerts.append({"risk": "medium", "label": "Heat Stress", "action": "Schedule irrigation at early morning (5–7 AM). Apply light mulch.", "icon": "Thermometer"})
    if request.humidity > 80:
        alerts.append({"risk": "high", "label": "Fungal Disease Risk", "action": f"High humidity ({request.humidity}%) favors Blast/Blight. Apply Propiconazole 25 EC @ 1ml/L.", "icon": "Droplets"})
    if request.wind_speed > 40:
        alerts.append({"risk": "high", "label": "Wind Damage Warning", "action": f"Winds at {request.wind_speed} km/h. Harvest mature {request.crop} to prevent lodging.", "icon": "Wind"})
    if not alerts:
        alerts.append({"risk": "low", "label": "All Clear", "action": "Conditions are favorable. Proceed with scheduled farm activities.", "icon": "Sun"})

    overall_risk = "high" if any(a["risk"] == "high" for a in alerts) else "medium" if any(a["risk"] == "medium" for a in alerts) else "low"
    spray_ok = request.wind_speed < 15 and request.humidity < 75
    
    return {
        "overall_risk": overall_risk,
        "alerts": alerts,
        "best_time_to_spray": "Early morning (6–9 AM) — Conditions Suitable" if spray_ok else "Delay spraying — Wind/Humidity unfavorable.",
        "irrigation_needed": request.rainfall_mm < 5 and request.humidity < 60,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
