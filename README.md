# 🌱 Krishi Sakhi AI | Smart Precision Farming Suite

**Krishi Sakhi AI** is a highly advanced, enterprise-grade precision agriculture assistant tailored for modern farmers and agronomists. Built as a comprehensive full-stack ecosystem, it integrates RAG-based Generative AI (using Google Gemini 2.0 Flash) with a suite of **10 specialized machine learning engines**, dynamic geospatial localization, live market intelligence, and custom visual dashboards under a premium dark-mode glassmorphic user interface.

---

## 🎨 Design & Experience
* **Ultra-Premium Glassmorphism**: Tailored custom CSS implementation featuring dark-mode frosted panels, glowing accent borders, interactive motion transitions powered by **Framer Motion**, and SVG micro-interactions.
* **Geospatial Intelligence**: Debounced global location autocompletion using the OpenStreetMap (Nominatim) API for seamless, keyless farmer onboarding and contextual local weather tracking.
* **Interactive Data Visualization**: Real-time mandi price trends, custom revenue forecasting, and ecological credit ledger charts.

---

## 🧠 Advanced ML Hub (10 Integrated Precision Engines)
At the core of Krishi Sakhi is a multi-disciplinary precision agriculture suite containing **10 production-ready AI models & simulators**:

1. **🍃 Plant Disease Detector**: Upload leaf images to simulate CNN-based disease diagnosis with granular confidence intervals, pathogen classification, and multi-phased treatment plans.
2. **🔮 Future Decay Predictor**: A generative simulation visualizing leaf cell degradation, progressive necrosis, and future decay patterns under custom nutrient or environmental stresses.
3. **🎙️ Bio-Acoustic Canopy Monitor**: DSP spectral FFT analysis of canopy sounds. Detects and classifies pollinator frequency signatures (e.g., honeybees) and pinpoints localized pest swarms.
4. **📈 Crop Yield Predictor**: Multi-variable regression engine simulating metric harvests based on NPK values, soil pH, seasonal rainfall, and temperature indices.
5. **⛈️ Climate Risk Advisor**: Rules-driven real-time environmental stress forecasting engine identifying severe drought, floods, or high-humidity hazards.
6. **🐛 Pest Forecasting Index**: Calculates real-time pest hazard levels utilizing current crop growth stages, rainfall records, and relative humidity.
7. **🌱 Crop Recommender**: Multi-parametric agronomic engine predicting optimal crops for a given parcel based on soil nitrogen, phosphorus, potassium, pH, and local weather.
8. **🧪 Fertilizer Recommender**: Intelligent optimizer that calculates specific nitrogen, phosphorus, and potassium soil deficits and prescribes precise fertilizer adjustments.
9. **🧩 Spatial Polyculture Solver**: Employs adjacency logic engines to lay out a highly synergetic 3x3 crop grid maximizing biological mutualism, accompanied by a 3-year rotating crop schedule.
10. **🪙 Carbon Sequestration Ledger**: Estimates annual soil organic carbon (SOC) sequestration, carbon stock improvements, and simulates a verified credit ledger tracking environmental offset transactions.

---

## 💼 Core Features
* **💬 RAG-Powered Agronomic Assistant**: Converse naturally with a domain-optimized conversational assistant powered by Google Gemini 2.0. Possesses context-awareness of the farmer's profile, geographic parameters, and active tasks. Resiliently falls back to an offline "Demo Mode" when API keys are absent.
* **📊 Mandi Insights & Revenue Estimator**: Live regional mandi commodities tracking, pricing trends, and a revenue planner that forecasts yield gains based on custom acreage, average market rate, and overhead expenses.
* **📅 Farm Task Scheduler**: Responsive calendar and checklist dashboard to schedule, prioritize, and track critical agronomic activities (e.g., seeding, weeding, fertilizing).
* **🏛️ Schemes & Subsidy Locator**: Matches local, national, and international farming subsidies, credit cards (KCC), and insurance schemes dynamically tuned to the farmer's location, crop type, and acreage.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Fast, modern application shell |
| **Animations** | Framer Motion | High-framerate physics-based UI transitions |
| **Styling** | Tailwind CSS + Custom CSS | Glassmorphism system, custom animations, custom glow matrices |
| **Icons** | Lucide React | High-quality vector iconography |
| **Backend** | Python FastAPI | High-performance asynchronous API server |
| **AI Orchestration**| Google GenAI SDK | Orchestrates Gemini 2.0 Flash models |
| **Deployment** | Uvicorn | ASGI server implementation |

---

## 🚦 Getting Started

### Prerequisites
* **Python 3.9+**
* **Node.js 18+**

### 1. Configure the Backend
Navigate into the backend directory, set up your virtual environment, and install dependencies:
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

#### Environment Setup
Create a `.env` file inside the `backend/` directory:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=8000
```
*(Note: If no API key is specified, the server runs in a graceful **Demo Mode** fallback to let you explore the application safely).*

#### Run FastAPI Server
```bash
python main.py
```
The backend API server will start on `http://localhost:8000`. You can explore interactive docs at `http://localhost:8000/docs`.

### 2. Configure the Frontend
Navigate into the frontend directory, install npm packages, and spin up the Vite development server:
```bash
cd ../frontend
npm install
npm run dev
```
The application UI will run locally on `http://localhost:5173` (or `http://localhost:5174`).

---

## 📦 Project Directory Structure
```
Krishi-Sakhi/
├── backend/
│   ├── main.py                 # Core FastAPI Server, Routing, and Handlers
│   ├── schemas.py              # Pydantic Request/Response Models
│   ├── test_advanced.py        # Backend ML suites verification suite
│   ├── ml_models/
│   │   ├── __init__.py
│   │   ├── disease_model.py    # Plant Disease Detection Simulator
│   │   ├── generative_decay.py # Visual Leaf Degradation & Progressive Decay
│   │   ├── acoustic_monitor.py # Bio-Acoustic Frequency Classifier & DSP FFT
│   │   ├── polyculture_solver.py # 3x3 Crop Adjacency & Multi-Year rotation
│   │   ├── carbon_ledger.py    # Soil Organic Carbon Offset Simulation
│   │   ├── yield_model.py      # Yield Regression Simulator
│   │   ├── weather_model.py    # Climate Risk Engine
│   │   ├── market_model.py     # Crop revenue & mandi price trends
│   │   ├── pest_model.py       # Multi-variable Pest Forecasts
│   │   ├── recommendation_model.py # Soil Crop Suggestion Model
│   │   └── soil_model.py       # Fertilizer Recommendation Engine
│   └── .env                    # Secrets & Port Settings
└── frontend/
    ├── index.html              # HTML Shell & Background Noise Filter
    ├── src/
    │   ├── App.jsx             # Top-level Routing, Shell, & Layout Controller
    │   ├── index.css           # Global Theme Tokens & Glassmorphic Utilities
    │   ├── context/
    │   │   └── ProfileContext.jsx # Global Farmer Profile Context Provider
    │   └── components/         # Premium Interactive Subcomponents
    │       ├── MLHub.jsx       # Tabbed Hub hosting the 10 precision ML models
    │       ├── Dashboard.jsx   # Farm Health Index, Timeline, Tasks, Profile
    │       ├── ChatInterface.jsx # Domain-Optimized Generative RAG Assistant
    │       ├── SchemesLocator.jsx # Subsidy & Schemes Directory Lookup
    │       ├── DiseaseDetector.jsx
    │       ├── FutureDecayPredictor.jsx
    │       ├── AcousticMonitor.jsx
    │       ├── PolycultureSolver.jsx
    │       ├── CarbonLedger.jsx
    │       ├── YieldPredictor.jsx
    │       ├── WeatherAdvisor.jsx
    │       ├── CropRecommender.jsx
    │       ├── FertilizerRecommender.jsx
    │       ├── PestForecast.jsx
    │       ├── MarketInsights.jsx # Live commodities & Smart Revenue calculator
    │       └── EnhancedBackground.jsx # Performance-friendly animated auroras
    └── package.json
```

---

## 🤝 Contribution & License
Empowering global agricultural ecosystems with premium, open-source precision technology.
