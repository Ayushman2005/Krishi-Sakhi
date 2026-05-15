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

# Train a simple proxy model at startup to act as a more advanced predictor
# In a real scenario, this would load a pre-trained .pkl file.
yield_models = {}


def train_dummy_models():
    for crop, bench in CROP_BENCHMARKS.items():
        X = []
        y = []
        for _ in range(200):
            rain = random.uniform(500, 3000)
            temp = random.uniform(20, 35)
            ph = random.uniform(5.0, 8.0)
            n = random.uniform(50, 150)
            p = random.uniform(20, 80)
            k = random.uniform(20, 80)

            # Formulate yield
            rain_f = min(rain / 1500, 1.2)
            temp_f = 1.0 if 20 <= temp <= 32 else 0.85
            ph_f = 1.0 if 6.0 <= ph <= 7.0 else 0.88
            nutrients = min((n + p + k) / (90 + 45 + 45), 1.3)

            val = bench["avg"] * rain_f * temp_f * ph_f * nutrients

            X.append([rain, temp, ph, n, p, k])
            y.append(val)

        reg = GradientBoostingRegressor(n_estimators=50, random_state=42)
        reg.fit(X, y)
        yield_models[crop] = reg


train_dummy_models()


@router.post("/yield-predict")
async def yield_predict(request: YieldRequest):
    bench = CROP_BENCHMARKS.get(request.crop, CROP_BENCHMARKS["Paddy"])

    model = yield_models.get(request.crop)
    if model:
        # Use ML Model
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
        # Fallback
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
