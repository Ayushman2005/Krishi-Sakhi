from pydantic import BaseModel
from typing import List, Optional

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

class CropRecommendRequest(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class FertilizerRecommendRequest(BaseModel):
    temperature: float
    humidity: float
    moisture: float
    soil_type: str
    crop_type: str
    nitrogen: float
    phosphorus: float
    potassium: float

class PestForecastRequest(BaseModel):
    crop: str
    temperature: float
    humidity: float
    rainfall: float
    growth_stage: str
