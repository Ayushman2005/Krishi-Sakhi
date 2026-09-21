from fastapi import APIRouter
from schemas import YieldRequest
import random
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor

router = APIRouter()

CROP_BENCHMARKS = {
    "Paddy": {"unit": "quintals/acre", "avg": 20, "good": 25, "excellent": 30},
    "Coconut": {"unit": "nuts/tree/yr", "avg": 60, "good": 80, "excellent": 100},
    "Rubber": {"unit": "kg/acre/yr", "avg": 350, "good": 500, "excellent": 650},
    "Vegetables": {"unit": "quintals/acre", "avg": 80, "good": 120, "excellent": 160},
    "Banana": {"unit": "bunches/acre", "avg": 700, "good": 900, "excellent": 1100},
}

import os
import logging
import pandas as pd

logger = logging.getLogger(__name__)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
YIELD_DATA_PATH = os.path.join(DATA_DIR, "crop_yield_data.csv")

yield_models = {}

def _train_dummy_crop_yield(crop, bench):
    X, y = [], []
    for _ in range(200):
        rain = random.uniform(500, 3000)
        temp = random.uniform(20, 35)
        ph = random.uniform(5.0, 8.0)
        n = random.uniform(50, 150)
        p = random.uniform(20, 80)
        k = random.uniform(20, 80)

        rain_f = min(rain / 1500, 1.2)
        temp_f = 1.0 if 20 <= temp <= 32 else 0.85
        ph_f = 1.0 if 6.0 <= ph <= 7.0 else 0.88
        nutrients = min((n + p + k) / (90 + 45 + 45), 1.3)

        val = bench["avg"] * rain_f * temp_f * ph_f * nutrients
        X.append([rain, temp, ph, n, p, k])
        y.append(val)

    reg = GradientBoostingRegressor(n_estimators=50, random_state=42)
    reg.fit(X, y)
    return reg

def train_yield_models():
    global yield_models
    df_yield = None
    if os.path.isfile(YIELD_DATA_PATH):
        try:
            df_yield = pd.read_csv(YIELD_DATA_PATH)
            logger.info(f"Loaded yield dataset with {len(df_yield)} records.")
        except Exception as e:
            logger.warning(f"Could not load yield dataset: {e}")

    feature_cols = ["Rainfall_mm", "Temperature_C", "Soil_pH", "Nitrogen_kg_ha", "Phosphorus_kg_ha", "Potassium_kg_ha"]

    for crop, bench in CROP_BENCHMARKS.items():
        if df_yield is not None and crop in df_yield["Crop"].values:
            sub_df = df_yield[df_yield["Crop"] == crop]
            X = sub_df[feature_cols].values
            y = sub_df["Yield_Quintals_Per_Acre"].values
            reg = GradientBoostingRegressor(n_estimators=50, random_state=42)
            reg.fit(X, y)
            yield_models[crop] = reg
            logger.info(f"✅ Yield model for {crop} trained on real dataset ({len(sub_df)} samples).")
        else:
            yield_models[crop] = _train_dummy_crop_yield(crop, bench)

train_yield_models()

@router.post("/yield-predict")
async def yield_predict(request: YieldRequest):
    bench = CROP_BENCHMARKS.get(request.crop, CROP_BENCHMARKS["Paddy"])

    model = yield_models.get(request.crop)
    if model:

        X_test = np.array([[
            request.rainfall_mm,
            request.temperature_avg,
            request.soil_ph,
            request.nitrogen_kg_ha,
            request.phosphorus_kg_ha,
            request.potassium_kg_ha
        ]])
        raw_per_unit = model.predict(X_test)[0]
    else:

        rainfall_factor = min(request.rainfall_mm / 1500, 1.2)
        temp_factor = 1.0 if 20 <= request.temperature_avg <= 32 else 0.85
        ph_factor = 1.0 if 6.0 <= request.soil_ph <= 7.0 else 0.88
        numerator = (request.nitrogen_kg_ha + request.phosphorus_kg_ha + request.potassium_kg_ha)
        denominator = (90 + 45 + 45)
        nutrient_score = min(numerator / denominator, 1.3)
        raw_per_unit = bench["avg"] * rainfall_factor * temp_factor * ph_factor * nutrient_score

    irrigation_bonus = 1.1 if request.irrigation_type == "Drip" else 1.0
    raw_per_unit *= irrigation_bonus

    estimated_yield = round(raw_per_unit * request.land_size, 1)
    potential_yield = round(bench["good"] * request.land_size, 1)
    efficiency = round((estimated_yield / potential_yield) * 100, 1)

    recs = []
    nutrient_score = (
        request.nitrogen_kg_ha + request.phosphorus_kg_ha + request.potassium_kg_ha
    ) / (90 + 45 + 45)
    if nutrient_score < 0.9:
        recs.append(
            f"Increase NPK application. Recommended: {90}:{45}:{45} kg/ha for {request.crop}.")
    if request.rainfall_mm < 1200:
        recs.append(
            "Supplement with irrigation during dry spells to maintain moisture.")
    if not (6.0 <= request.soil_ph <= 7.0):
        recs.append(
            f"Soil pH {request.soil_ph} is suboptimal. Lime application advised if acidic.")
    if request.irrigation_type != "Drip":
        recs.append("Drip irrigation can improve efficiency by up to 10%.")
    recs.append("Consider intercropping with legumes to fix nitrogen naturally.")

    return {
        "estimated_yield": estimated_yield,
        "potential_yield": potential_yield,
        "unit": bench["unit"],
        "efficiency": min(efficiency, 100),
        "recommendations": recs[:3],
        "model_used": "GradientBoostingRegressor (scikit-learn)"
    }
