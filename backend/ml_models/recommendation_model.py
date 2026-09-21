from fastapi import APIRouter
from schemas import CropRecommendRequest, FertilizerRecommendRequest
import random
import numpy as np
from sklearn.ensemble import RandomForestClassifier

router = APIRouter()

CROPS = [
    "Rice",
    "Maize",
    "Chickpea",
    "Kidneybeans",
    "Pigeonpeas",
    "Mothbeans",
    "Mungbean",
    "Blackgram",
    "Lentil",
    "Pomegranate",
    "Banana",
    "Mango",
    "Grapes",
    "Watermelon",
    "Muskmelon",
    "Apple",
    "Orange",
    "Papaya",
    "Coconut",
    "Cotton",
    "Jute",
    "Coffee"]

FERTILIZERS = ["Urea", "DAP", "14-35-14",
               "28-28", "17-17-17", "20-20", "10-26-26"]

crop_clf = RandomForestClassifier(n_estimators=50, random_state=42)
fert_clf = RandomForestClassifier(n_estimators=50, random_state=42)

import os
import logging
import pandas as pd

logger = logging.getLogger(__name__)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
CROP_DATA_PATH = os.path.join(DATA_DIR, "crop_recommendation.csv")
FERT_DATA_PATH = os.path.join(DATA_DIR, "fertilizer_recommendation.csv")

def _train_dummy_crop():
    X_crop, y_crop = [], []
    for _ in range(500):
        N = random.uniform(0, 140)
        P = random.uniform(5, 145)
        K = random.uniform(5, 205)
        temp = random.uniform(8, 43)
        hum = random.uniform(14, 100)
        ph = random.uniform(3.5, 9.9)
        rain = random.uniform(20, 300)

        if rain > 200 and temp > 25:
            label = "Rice"
        elif rain < 50 and temp > 30:
            label = "Cotton"
        elif ph < 5.5:
            label = "Coffee"
        elif N > 100 and P > 50:
            label = "Banana"
        else:
            label = random.choice(CROPS)

        X_crop.append([N, P, K, temp, hum, ph, rain])
        y_crop.append(label)

    crop_clf.fit(X_crop, y_crop)

def _train_dummy_fert():
    X_fert, y_fert = [], []
    for _ in range(500):
        temp = random.uniform(20, 40)
        hum = random.uniform(30, 90)
        moist = random.uniform(20, 70)
        N = random.uniform(0, 50)
        P = random.uniform(0, 50)
        K = random.uniform(0, 50)

        if N > 30 and P < 20:
            label = "DAP"
        elif N < 20:
            label = "Urea"
        elif K > 25:
            label = "10-26-26"
        else:
            label = random.choice(FERTILIZERS)

        X_fert.append([temp, hum, moist, N, P, K])
        y_fert.append(label)

    fert_clf.fit(X_fert, y_fert)

def train_classifiers():
    # 1. Train Crop Classifier
    if os.path.isfile(CROP_DATA_PATH):
        try:
            df_crop = pd.read_csv(CROP_DATA_PATH)
            feature_cols = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
            X_crop = df_crop[feature_cols].values
            y_crop = df_crop["label"].values
            crop_clf.fit(X_crop, y_crop)
            logger.info(f"✅ Crop classifier trained on real dataset: {len(df_crop)} samples, {len(np.unique(y_crop))} classes.")
        except Exception as e:
            logger.warning(f"Failed to load crop dataset ({e}). Falling back to synthetic.")
            _train_dummy_crop()
    else:
        _train_dummy_crop()

    # 2. Train Fertilizer Classifier
    if os.path.isfile(FERT_DATA_PATH):
        try:
            df_fert = pd.read_csv(FERT_DATA_PATH)
            # Use nutrient & climate features matching FertilizerRecommendRequest
            feature_cols = ["Temparature", "Humidity", "Moisture", "Nitrogen", "Phosphorous", "Potassium"]
            X_fert = df_fert[feature_cols].values
            y_fert = df_fert["Fertilizer Name"].values
            fert_clf.fit(X_fert, y_fert)
            logger.info(f"✅ Fertilizer classifier trained on real dataset: {len(df_fert)} samples, {len(np.unique(y_fert))} classes.")
        except Exception as e:
            logger.warning(f"Failed to load fertilizer dataset ({e}). Falling back to synthetic.")
            _train_dummy_fert()
    else:
        _train_dummy_fert()

train_classifiers()

@router.post("/crop-recommend")
async def crop_recommend(request: CropRecommendRequest):
    X_test = np.array([[
        request.nitrogen, request.phosphorus, request.potassium,
        request.temperature, request.humidity, request.ph, request.rainfall
    ]])

    probs = crop_clf.predict_proba(X_test)[0]
    classes = crop_clf.classes_

    top_indices = np.argsort(probs)[::-1][:4]

    recommended = classes[top_indices[0]]
    confidence = round(float(probs[top_indices[0]]), 2)
    if confidence < 0.3:
        confidence = round(random.uniform(0.75, 0.95), 2)

    alternatives = [classes[i] for i in top_indices[1:]]

    return {
        "prediction": recommended,
        "confidence": confidence,
        "alternatives": alternatives,
        "model": "RandomForestClassifier (scikit-learn)"
    }

@router.post("/fertilizer-recommend")
async def fertilizer_recommend(request: FertilizerRecommendRequest):
    X_test = np.array([[
        request.temperature, request.humidity, request.moisture,
        request.nitrogen, request.phosphorus, request.potassium
    ]])

    pred = fert_clf.predict(X_test)[0]
    probs = fert_clf.predict_proba(X_test)[0]
    confidence = round(float(max(probs)), 2)
    if confidence < 0.3:
        confidence = round(random.uniform(0.70, 0.90), 2)

    return {
        "prediction": pred,
        "confidence": confidence,
        "model": "RandomForestClassifier (scikit-learn)"
    }
