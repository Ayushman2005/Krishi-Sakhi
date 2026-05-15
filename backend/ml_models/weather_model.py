from fastapi import APIRouter
from schemas import WeatherRequest
import os
import random
import logging
import urllib.parse

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/ml/weather-advisory")
async def weather_advisory(request: WeatherRequest):
    """
    Advanced NLP/Rules-Engine Weather Advisory.
    """
    alerts = []

    if request.rainfall_mm > 50:
        alerts.append(
            {
                "risk": "high",
                "label": "Heavy Rainfall",
                "action": f"Drain excess water from {
                    request.crop} fields. Check bund/drainage integrity.",
                "icon": "CloudRain"})
    if request.temperature > 35:
        alerts.append(
            {
                "risk": "medium",
                "label": "Heat Stress",
                "action": "Schedule irrigation at early morning (5–7 AM). Apply light mulch.",
                "icon": "Thermometer"})
    if request.humidity > 80:
        alerts.append(
            {
                "risk": "high",
                "label": "Fungal Disease Risk",
                "action": f"High humidity ({
                    request.humidity}%) favors Blast/Blight. Apply Propiconazole 25 EC @ 1ml/L.",
                "icon": "Droplets"})
    if request.wind_speed > 40:
        alerts.append(
            {
                "risk": "high",
                "label": "Wind Damage Warning",
                "action": f"Winds at {
                    request.wind_speed} km/h. Harvest mature {
                    request.crop} to prevent lodging.",
                "icon": "Wind"})
    if not alerts:
        alerts.append(
            {
                "risk": "low",
                "label": "All Clear",
                "action": "Conditions are favorable. Proceed with scheduled farm activities.",
                "icon": "Sun"})

    overall_risk = "high" if any(
        a["risk"] == "high" for a in alerts) else "medium" if any(
        a["risk"] == "medium" for a in alerts) else "low"
    spray_ok = request.wind_speed < 15 and request.humidity < 75

    return {
        "overall_risk": overall_risk,
        "alerts": alerts,
        "best_time_to_spray": "Early morning (6–9 AM) — Conditions Suitable" if spray_ok else "Delay spraying — Wind/Humidity unfavorable.",
        "irrigation_needed": request.rainfall_mm < 5 and request.humidity < 60,
    }


@router.get("/weather/live")
async def live_weather(lat: float = 10.8505, lon: float = 76.2711, q: str = None):
    """
    Fetches live weather from OpenWeatherMap if key exists, else provides simulated data.
    """
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if api_key:
        try:
            import urllib.request
            import json
            if q:
                url = f"https://api.openweathermap.org/data/2.5/weather?q={urllib.parse.quote(q)}&appid={api_key}&units=metric"
            else:
                url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
            req = urllib.request.Request(
                url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=5) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode())
                    return {
                        "location": data.get(
                            "name",
                            "Unknown"),
                        "temperature": data["main"]["temp"],
                        "humidity": data["main"]["humidity"],
                        "rainfall_mm": data.get(
                            "rain",
                            {}).get(
                            "1h",
                            0.0),
                        "wind_speed": data["wind"]["speed"],
                        "description": data["weather"][0]["description"].title(),
                        "source": "OpenWeatherMap"}
        except Exception as e:
            logger.error(f"Live Weather API Error: {e}")
            pass  # Fall back to simulation

    # Simulation fallback
    return {
        "location": "Simulated Location",
        "temperature": round(random.uniform(25.0, 34.0), 1),
        "humidity": round(random.uniform(60, 90), 1),
        "rainfall_mm": round(random.uniform(0, 15.0), 1),
        "wind_speed": round(random.uniform(5.0, 15.0), 1),
        "description": "Partly Cloudy (Simulated)",
        "source": "Simulation (Missing/Failed API Key)"
    }
