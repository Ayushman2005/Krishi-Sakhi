# 🌾 Krishi Sakhi Backend Agricultural Datasets

This directory houses the benchmark precision agriculture datasets utilized by the **Krishi Sakhi** machine learning suite to power crop recommendations, fertilizer prescriptions, yield estimations, and multi-model plant classification.

---

## 📁 Datasets Overview

| File | Records | Features | Target Variable | Primary Model |
| :--- | :--- | :--- | :--- | :--- |
| **`comprehensive_plants_and_crops.csv`** | 4,060 | 12 soil, climate, agro-ecological attributes | `label` (58 plant varieties) | `RandomForestClassifier` (99.26% test acc) |
| **`crop_recommendation.csv`** | 2,200 | 7 agronomic & climate indicators | `label` (22 crops) | `RandomForestClassifier` |
| **`fertilizer_recommendation.csv`** | 500 | 8 soil, crop & atmospheric features | `Fertilizer Name` (7 classes) | `RandomForestClassifier` |
| **`crop_yield_data.csv`** | 480 | 10 agro-climatic & nutrient features | `Yield_Quintals_Per_Acre` | `GradientBoostingRegressor` |

---

## 1. Comprehensive Plants & Crops Dataset (`comprehensive_plants_and_crops.csv`)

Exhaustive multi-category precision agriculture dataset covering **58 plant & crop varieties across all 8 botanical and economic domains**.

### Categorical Breakdown (58 Varieties)
1. **Cereals & Grains (8)**: `Rice`, `Wheat`, `Maize`, `Barley`, `Pearl Millet`, `Sorghum`, `Finger Millet`, `Oats`.
2. **Pulses & Legumes (9)**: `Chickpea`, `Pigeonpea`, `Kidney Bean`, `Blackgram`, `Mungbean`, `Lentil`, `Mothbean`, `Peas`, `Soybean`.
3. **Fruits & Tree Crops (13)**: `Mango`, `Banana`, `Apple`, `Orange`, `Grapes`, `Papaya`, `Pomegranate`, `Guava`, `Pineapple`, `Lemon`, `Watermelon`, `Muskmelon`, `Coconut`.
4. **Vegetables & Roots (12)**: `Tomato`, `Potato`, `Onion`, `Garlic`, `Ginger`, `Carrot`, `Cabbage`, `Cauliflower`, `Spinach`, `Brinjal`, `Chilli`, `Okra`.
5. **Commercial & Cash Crops (5)**: `Cotton`, `Jute`, `Sugarcane`, `Tobacco`, `Rubber`.
6. **Plantation & Beverages (2)**: `Tea`, `Coffee`.
7. **Oilseeds (4)**: `Mustard`, `Groundnut`, `Sunflower`, `Sesame`.
8. **Spices & Herbs (5)**: `Turmeric`, `Black Pepper`, `Cardamom`, `Cumin`, `Coriander`.

### Features
* **`N`** (int): Soil Nitrogen content (kg/ha).
* **`P`** (int): Soil Phosphorus content (kg/ha).
* **`K`** (int): Soil Potassium content (kg/ha).
* **`temperature`** (float): Ambient surface temperature (°C).
* **`humidity`** (float): Relative air humidity (%).
* **`ph`** (float): Soil pH (acidic to alkaline).
* **`rainfall`** (float): Cumulative seasonal precipitation (mm).
* **`soil_type`** (string): Soil texture class (`Loamy`, `Clayey`, `Sandy`, `Black`, `Red`, `Alluvial`, `Laterite`).
* **`category`** (string): Botanical domain (`Cereal`, `Pulse`, `Fruit`, `Vegetable`, `Cash Crop`, `Plantation`, `Oilseed`, `Spice`).
* **`growth_duration_days`** (int): Phenological cycle duration until harvest.
* **`water_requirement`** (string): Irrigation demand index (`Low`, `Medium`, `High`, `Very High`).
* **`sunlight_hours`** (float): Mean daily photoperiod requirement.
* **`label`** (string): Target plant or crop name.

### 📓 Training Notebook
This dataset is trained, benchmarked, and evaluated in the dedicated Jupyter Notebook:
* **[`backend/notebooks/train_plants_and_crops.ipynb`](../notebooks/train_plants_and_crops.ipynb)**
  * Benchmarks 5 models (Random Forest, Gradient Boosting, Decision Tree, KNN, Logistic Regression).
  * Feature importance & 5-fold cross-validation.
  * Exports serialized model artifacts to `backend/ml_models/best_crop_model.joblib`.

---

## 2. Crop Recommendation Dataset (`crop_recommendation.csv`)

Ground-truth precision agriculture dataset providing optimal environmental and soil conditions for 22 major agricultural crops.

### Features
* **`N`**, **`P`**, **`K`**: Macronutrients (kg/ha).
* **`temperature`**, **`humidity`**, **`ph`**, **`rainfall`**: Agro-climatic parameters.
* **`label`**: 22 standard crop varieties.

---

## 3. Fertilizer Recommendation Dataset (`fertilizer_recommendation.csv`)

Diagnostic dataset for calculating soil nutrient deficits and prescribing targeted commercial fertilizer formulations.

### Features
* **`Temparature`**, **`Humidity`**, **`Moisture`**, **`Soil Type`**, **`Crop Type`**, **`Nitrogen`**, **`Potassium`**, **`Phosphorous`**.
* **`Fertilizer Name`**: Urea, DAP, 14-35-14, 28-28, 17-17-17, 20-20, 10-26-26.

---

## 4. Crop Yield Benchmark Dataset (`crop_yield_data.csv`)

Empirical harvest dataset spanning multi-state Indian farming regions across Kharif, Rabi, and Annual growing seasons.

### Features
* **`Crop`**, **`Season`**, **`State`**, **`Area_Acres`**, **`Rainfall_mm`**, **`Temperature_C`**, **`Soil_pH`**, **`Nitrogen_kg_ha`**, **`Phosphorus_kg_ha`**, **`Potassium_kg_ha`**, **`Yield_Quintals_Per_Acre`**.

---

## 🚀 API Access & Endpoints

You can inspect and query metadata about these datasets via the FastAPI backend:
* **`GET /data/datasets`**: Enumerate available datasets with dimensions, file size, and descriptions.
* **`GET /data/datasets/{dataset_name}/preview`**: Retrieve summary statistics, column types, and preview records.
