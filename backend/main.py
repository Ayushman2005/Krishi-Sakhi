from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import google.generativeai as genai
from dotenv import load_dotenv
from typing import List, Optional
import datetime
import logging

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
        logger.info("Gemini AI configured successfully.")
    except Exception as e:
        logger.error(f"Failed to configure Gemini: {e}")
        model = None
else:
    logger.warning("Gemini API Key missing or placeholder used.")
    model = None

app = FastAPI(title="Krishi Sakhi API", version="2.0.0")

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
    logger.error(f"Global Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "An internal server error occurred.", "details": str(exc)},
    )

# Models
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

# Knowledge Base
KNOWLEDGE_BASE = """
Krishi Sakhi Expert Knowledge Base:
- Kerala Farming Districts: Palakkad (Rice bowl), Idukki (Spices), Kottayam (Rubber), Alappuzha (Kuttanad - Below sea level farming).
- Paddy Stages: Sowing, Seedling, Tillering, Panicle Initiation, Flowering, Maturity.
- Nutrient Ratios for Paddy: NPK (Nitrogen, Phosphorus, Potassium) 90:45:45 kg/ha.
- Organic Solutions: Jeevamrutham (Cow dung/urine based), Neem cake for root health.
- Alerts: Yellowing leaves in Paddy often indicates Zinc deficiency. 
- Weather context: High humidity (>80%) leads to fungal issues like Blast disease.
"""

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if not model:
        # Graceful fallback for demo purposes
        return {"response": "Hi! I'm currently in Demo Mode because the API key is not set. However, based on your profile, I recommend checking for adequate moisture in your fields today."}

    context = f"Farmer Profile: {request.profile}\nRecent Activities: {request.activities}\n\n{KNOWLEDGE_BASE}"
    
    prompt = f"""
    System: You are Krishi Sakhi, the most advanced agricultural AI for Kerala.
    Context: {context}
    
    Goal: Provide accurate, technical yet accessible advice. If the user asks in Malayalam, reply in Malayalam.
    
    User Question: {request.message}
    """
    
    try:
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        raise HTTPException(status_code=500, detail="The AI engine is temporarily unavailable.")

@app.get("/advisories")
async def get_advisories(crop: str, location: str):
    logger.info(f"Generating advisories for {crop} in {location}")
    advisories = []
    
    # Advanced logic simulation
    if "Palakkad" in location:
        advisories.append({
            "id": "adv_heat",
            "type": "weather",
            "title": "Severe Heat Advisory",
            "content": "Temps in Palakkad hitting 38°C. Ensure heavy mulching to preserve soil moisture.",
            "priority": "high",
            "icon": "Sun"
        })
    
    if "Alappuzha" in location or "Kuttanad" in location:
        advisories.append({
            "id": "adv_water",
            "type": "weather",
            "title": "Submerged Field Alert",
            "content": "Water levels rising. Check bund integrity immediately.",
            "priority": "high",
            "icon": "CloudRain"
        })

    if crop == "Paddy":
        advisories.append({
            "id": "adv_pest",
            "type": "pest",
            "title": "Blast Disease Warning",
            "content": "Current humidity favors Blast fungus. Inspect your paddy leaves for spindle-shaped spots.",
            "priority": "medium",
            "icon": "Bug"
        })

    # Always add a general seasonal advisory
    advisories.append({
        "id": "adv_gen",
        "type": "crop",
        "title": "Seasonal Planning",
        "content": "Best time to apply organic fertilizers for long-term soil health.",
        "priority": "low",
        "icon": "Sprout"
    })

    return advisories

@app.get("/market-trends")
async def get_market_trends():
    # In a real app, this would fetch from AGMARKNET or local API
    return [
        {"name": "Paddy (Jaya)", "price": "₹28.80", "trend": "up", "change": "+1.8%"},
        {"name": "Coconut (Dry)", "price": "₹31.50", "trend": "down", "change": "-1.5%"},
        {"name": "Rubber (RSS-4)", "price": "₹164.00", "trend": "up", "change": "+2.1%"},
        {"name": "Arecanut", "price": "₹420.00", "trend": "up", "change": "+0.8%"},
    ]

@app.get("/health")
async def health_check():
    return {"status": "online", "timestamp": datetime.datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
