# 🌾 Krishi Sakhi Backend Agricultural Datasets

This directory houses the benchmark precision agriculture datasets utilized by the **Krishi Sakhi** machine learning suite to power crop recommendations, fertilizer prescriptions, and yield estimations.

---

## 📁 Datasets Overview

| File | Records | Features | Target Variable | Primary Model |
| :--- | :--- | :--- | :--- | :--- |
| **`crop_recommendation.csv`** | 2,200 | 7 agronomic & climate indicators | `label` (22 crops) | `RandomForestClassifier` |
| **`fertilizer_recommendation.csv`** | 500 | 8 soil, crop & atmospheric features | `Fertilizer Name` (7 classes) | `RandomForestClassifier` |
| **`crop_yield_data.csv`** | 480 | 10 agro-climatic & nutrient features | `Yield_Quintals_Per_Acre` | `GradientBoostingRegressor` |

---

## 1. Crop Recommendation Dataset (`crop_recommendation.csv`)

Ground-truth precision agriculture dataset providing optimal environmental and soil conditions for 22 major agricultural crops.

### Features
* **`N`** (int): Ratio of Nitrogen content in soil (kg/ha).
* **`P`** (int): Ratio of Phosphorus content in soil (kg/ha).
* **`K`** (int): Ratio of Potassium content in soil (kg/ha).
* **`temperature`** (float): Ambient temperature in Celsius (°C).
* **`humidity`** (float): Relative air humidity percentage (%).
* **`ph`** (float): Soil pH value (acidic < 6.5 to alkaline > 7.5).
* **`rainfall`** (float): Cumulative seasonal precipitation (mm).
* **`label`** (string): Recommended crop class.

### Supported Crops (22 Classes)
`Rice`, `Maize`, `Chickpea`, `Kidneybeans`, `Pigeonpeas`, `Mothbeans`, `Mungbean`, `Blackgram`, `Lentil`, `Pomegranate`, `Banana`, `Mango`, `Grapes`, `Watermelon`, `Muskmelon`, `Apple`, `Orange`, `Papaya`, `Coconut`, `Cotton`, `Jute`, `Coffee`.

---

## 2. Fertilizer Recommendation Dataset (`fertilizer_recommendation.csv`)

Diagnostic dataset for calculating soil nutrient deficits and prescribing targeted commercial fertilizer formulations.

### Features
* **`Temparature`** (float): Surface air temperature (°C).
* **`Humidity`** (float): Air moisture content (%).
* **`Moisture`** (float): Soil moisture percentage (%).
* **`Soil Type`** (string): `Sandy`, `Loamy`, `Black`, `Red`, `Clayey`.
* **`Crop Type`** (string): Target crop being cultivated.
* **`Nitrogen`** (int): Soil nitrogen reading (ppm / kg/ha).
* **`Potassium`** (int): Soil potassium reading (ppm / kg/ha).
* **`Phosphorous`** (int): Soil phosphorus reading (ppm / kg/ha).
* **`Fertilizer Name`** (string): Recommended fertilizer product.

### Prescribed Fertilizer Classes
`Urea`, `DAP`, `14-35-14`, `28-28`, `17-17-17`, `20-20`, `10-26-26`.

---

## 3. Crop Yield Benchmark Dataset (`crop_yield_data.csv`)

Empirical harvest dataset spanning multi-state Indian farming regions across Kharif, Rabi, and Annual growing seasons.

### Features
* **`Crop`** (string): Crop variety (`Paddy`, `Coconut`, `Rubber`, `Vegetables`, `Banana`, `Wheat`, `Maize`, `Cotton`).
* **`Season`** (string): `Kharif`, `Rabi`, `Whole Year`.
* **`State`** (string): Indian agricultural state.
* **`Area_Acres`** (float): Total parcel size under cultivation.
* **`Rainfall_mm`** (float): Seasonal rainfall index.
* **`Temperature_C`** (float): Average growing season temperature.
* **`Soil_pH`** (float): Soil acidity / alkalinity index.
* **`Nitrogen_kg_ha`**, **`Phosphorus_kg_ha`**, **`Potassium_kg_ha`** (float): Soil macronutrient concentrations.
* **`Yield_Quintals_Per_Acre`** (float): Actual measured yield output.

---

## 🚀 API Access & Endpoints

You can inspect and query metadata about these datasets via the FastAPI backend:
* **`GET /data/datasets`**: Enumerate available datasets with dimensions, file size, and descriptions.
* **`GET /data/datasets/{dataset_name}/preview`**: Retrieve summary statistics, column types, and preview records.
