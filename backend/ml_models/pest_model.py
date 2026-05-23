from fastapi import APIRouter
from schemas import PestForecastRequest

router = APIRouter()

@router.post("/pest-forecast")
async def pest_forecast(request: PestForecastRequest):

    forecasts = []

    if request.crop.lower() == "paddy":
        if request.humidity > 80 and request.temperature > 28:
            forecasts.append(
                {
                    "pest": "Brown Plant Hopper",
                    "risk": "High",
                    "timeframe": "3-5 days",
                    "action": "Drain field intermittently, apply Neem oil (10000 ppm) @ 2ml/L."})
        if request.rainfall > 20 and request.temperature < 30:
            forecasts.append(
                {
                    "pest": "Leaf Folder",
                    "risk": "Medium",
                    "timeframe": "7-10 days",
                    "action": "Avoid excessive nitrogen fertilizer. Release Trichogramma chilonis."})
    elif request.crop.lower() == "cotton":
        if request.temperature > 32 and request.humidity < 60:
            forecasts.append(
                {
                    "pest": "Whitefly",
                    "risk": "High",
                    "timeframe": "2-4 days",
                    "action": "Install yellow sticky traps. Spray Imidacloprid if severe."})

    if not forecasts:
        forecasts.append(
            {
                "pest": "No major immediate threats",
                "risk": "Low",
                "timeframe": "14 days",
                "action": "Continue regular monitoring and good agricultural practices."})

    return {
        "crop": request.crop,
        "current_weather": {
            "temp": request.temperature,
            "humidity": request.humidity},
        "forecasts": forecasts}
