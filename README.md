# 🌱 Krishi Sakhi AI | Smart Farming Assistant

**Krishi Sakhi** is a highly advanced, full-stack AI-powered personal farming assistant tailored for modern agriculture. Built initially for the SIH 2026 initiative, it empowers farmers with hyper-personalized agronomic intelligence, integrating RAG-based LLMs, Computer Vision, and dynamic global APIs within a premium glassmorphism interface.

## 🚀 Key Features

*   **Premium Glassmorphism UI**: A cutting-edge frontend built with React, Framer Motion, and Tailwind CSS. Features animated aurora backgrounds, multi-layer frosted glass panels, and dynamic shimmers.
*   **Global Location Intelligence**: Integrated with the OpenStreetMap (Nominatim) API for 100% accurate, debounced global city and country autocomplete without requiring user API keys.
*   **RAG-Powered Conversational AI**: A robust chatbot interface backed by Google's Gemini 2.0 Flash and a localized Kerala-specific agricultural Knowledge Base.
*   **Advanced ML Hub**:
    *   **🍃 Plant Disease Detector**: Upload leaf images for simulated CNN-based disease diagnosis with confidence intervals and treatment protocols.
    *   **📈 Crop Yield Predictor**: A multi-factor regression simulator predicting harvests based on 10+ agronomic parameters (pH, NPK, Rainfall).
    *   **⛈️ Climate Risk Advisor**: An NLP-style rules engine assessing crop risk based on live temperature, humidity, and wind parameters.
*   **Dynamic Dashboard**: Real-time activity timeline tracking with a dynamically calculated "Farm Health Index", and mock live market trend streams.

## 🛠️ Technology Stack

**Frontend (`/frontend`)**
*   **Framework**: React 19 + Vite
*   **Styling**: Custom CSS (Advanced Glassmorphism) + Tailwind CSS (via CDN)
*   **Animations**: Framer Motion
*   **Icons**: Lucide React

**Backend (`/backend`)**
*   **Framework**: Python FastAPI
*   **AI Engine**: Google GenAI SDK (Gemini 2.0 Flash)
*   **Server**: Uvicorn
*   **Architecture**: RESTful APIs, CORS configured, Global Exception Handlers.

## 🚦 Getting Started

### 1. Start the Backend
Navigate to the backend directory, install requirements, and run the FastAPI server:
```bash
cd backend
pip install fastapi uvicorn google-generativeai python-dotenv
python main.py
```
*(Runs on `http://localhost:8000`)*

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```
*(Note: The app features a resilient "Demo Mode" fallback if no key is provided).*

### 3. Start the Frontend
Open a new terminal, navigate to the frontend directory, and start Vite:
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:5174` or `5173`)*

## 📦 Project Structure

```
SIH 2026/
├── backend/
│   ├── main.py              # FastAPI server & ML endpoints
│   └── .env                 # API keys
└── frontend/
    ├── index.html           # Tailwind CDN & Noise overlay
    ├── src/
    │   ├── App.jsx          # Routing & Layout Shell
    │   ├── index.css        # Core Glassmorphism System
    │   ├── components/      # UI & ML Model Components
    │   └── context/         # Farmer Profile State Management
    └── package.json
```

## 🤝 Contribution
Built for SIH 2026. Empowering the roots of India through technology.
