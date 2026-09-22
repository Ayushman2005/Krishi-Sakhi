import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFarmer } from '../context/FarmerContext';
import {
  ShieldCheck, Cpu, Terminal, Activity, Server,
  Database, RefreshCw, CheckCircle2, AlertTriangle,
  Play, ExternalLink, Sliders, Layers, Code,
  Eye, EyeOff, Leaf, Sprout, Beaker, Cloud, Bug, TrendingUp,
  Mic, Grid3X3, Coins, User, ArrowRight, Lock, KeyRound, Sparkles
} from 'lucide-react';
import {
  fetchAllFarmers,
  fetchRecentActivities,
  fetchAdminAuditLogs,
  syncAdminCredentialsToFirestore,
  fetchFirestoreAdminDoc,
  IMMUTABLE_ADMIN
} from '../services/firebaseService';
import { isFirebaseConfigured, firebaseConfig } from '../config/firebase';

import DiseaseDetector from './DiseaseDetector';
import YieldPredictor from './YieldPredictor';
import WeatherAdvisor from './WeatherAdvisor';
import CropRecommender from './CropRecommender';
import FertilizerRecommender from './FertilizerRecommender';
import PestForecast from './PestForecast';
import FutureDecayPredictor from './FutureDecayPredictor';
import AcousticMonitor from './AcousticMonitor';
import PolycultureSolver from './PolycultureSolver';
import CarbonLedger from './CarbonLedger';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const ADMIN_MODELS = [
  {
    id: 'disease',
    name: 'Disease Detection Core',
    type: 'PyTorch / CNN Vision',
    endpoint: '/ml/disease-detect',
    badge: 'PyTorch .pth',
    accuracy: '98.2%',
    desc: 'Convolutional neural network for plant pathology classification across 38+ plant disease classes.',
    component: DiseaseDetector,
    icon: Leaf,
    color: '#10b981',
  },
  {
    id: 'yield',
    name: 'Yield Prediction Engine',
    type: 'Gradient Boosting Regression',
    endpoint: '/ml/yield-predict',
    badge: 'Joblib / Scikit-Learn',
    accuracy: '94.6%',
    desc: 'Multi-variable agricultural yield regressor factoring seasonal rainfall, fertilizer inputs, and soil chemistry.',
    component: YieldPredictor,
    icon: TrendingUp,
    color: '#8b5cf6',
  },
  {
    id: 'crop',
    name: 'Crop Recommendation Model',
    type: 'Random Forest Multi-Class',
    endpoint: '/ml/recommend-crop',
    badge: 'Joblib Pipeline',
    accuracy: '99.1%',
    desc: 'Decision-tree ensemble predicting top 3 optimal crop varieties based on NPK, pH, and climate metrics.',
    component: CropRecommender,
    icon: Sprout,
    color: '#06b6d4',
  },
  {
    id: 'fertilizer',
    name: 'Fertilizer Nutrient Optimizer',
    type: 'Nutrient Matrix Regressor',
    endpoint: '/ml/fertilizer-predict',
    badge: 'Matrix Optimization',
    accuracy: '96.3%',
    desc: 'Stoichiometric soil chemistry solver calculating exact elemental deficiency compensation.',
    component: FertilizerRecommender,
    icon: Beaker,
    color: '#6366f1',
  },
  {
    id: 'weather',
    name: 'Micro-Climate Advisor',
    type: 'Open-Meteo Ensemble Service',
    endpoint: '/weather',
    badge: 'Live Meteorological Feed',
    accuracy: '95.0%',
    desc: 'GPS-pinned numerical weather forecasting with spraying window analysis and thermal risk tracking.',
    component: WeatherAdvisor,
    icon: Cloud,
    color: '#0ea5e9',
  },
  {
    id: 'pest',
    name: 'Pest Outbreak Forecaster',
    type: 'Time-Series Epidemic Model',
    endpoint: '/ml/pest-predict',
    badge: 'Degree-Day Modeling',
    accuracy: '91.8%',
    desc: 'Epidemiological degree-day simulation projecting insect emergence and spore dispersion.',
    component: PestForecast,
    icon: Bug,
    color: '#f43f5e',
  },
  {
    id: 'decay',
    name: 'Generative Shelf-Life Predictor',
    type: 'Generative Visual ML',
    endpoint: '/ml/decay/forecast',
    badge: 'Multi-Modal Vision',
    accuracy: '89.4%',
    desc: 'Simulates cellular senescence and post-harvest microbial decay under variable storage parameters.',
    component: FutureDecayPredictor,
    icon: Eye,
    color: '#f59e0b',
  },
  {
    id: 'acoustic',
    name: 'Acoustic Bio-Telemetry',
    type: 'ResNet-18 Audio Spectrogram',
    endpoint: '/ml/acoustic/analyze',
    badge: 'STFT Spectrogram',
    accuracy: '93.7%',
    desc: 'Short-time Fourier transform neural classifier evaluating apiary buzzing frequencies and borer vibrations.',
    component: AcousticMonitor,
    icon: Mic,
    color: '#ec4899',
  },
  {
    id: 'polyculture',
    name: 'Polyculture Intercropping Solver',
    type: 'Combinatorial Compatibility Solver',
    endpoint: '/ml/polyculture/solve',
    badge: 'NP-Hard Optimization',
    accuracy: '97.2%',
    desc: 'Allelochemical and root-depth compatibility engine generating synergistic spatial crop layouts.',
    component: PolycultureSolver,
    icon: Grid3X3,
    color: '#14b8a6',
  },
  {
    id: 'carbon',
    name: 'Agri-Carbon Ledger Protocol',
    type: 'Verified Carbon Metric Engine',
    endpoint: '/ml/carbon/calculate',
    badge: 'Carbon Sequestration Protocol',
    accuracy: '99.9%',
    desc: 'Quantifies biomass carbon sequestration for carbon credits and ESG compliance ledgering.',
    component: CarbonLedger,
    icon: Coins,
    color: '#10b981',
  },
];

const AdminPanel = () => {
  const { profile, activities } = useFarmer();
  const [adminTab, setAdminTab] = useState('models'); // 'models' | 'system' | 'api' | 'database' | 'telemetry'
  const [selectedModelId, setSelectedModelId] = useState(null);

  // System status state
  const [healthStatus, setHealthStatus] = useState(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [ollamaTags, setOllamaTags] = useState(null);

  // Database state
  const [farmersList, setFarmersList] = useState([]);
  const [dbActivities, setDbActivities] = useState([]);
  const [adminAuditLogs, setAdminAuditLogs] = useState([]);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [firestoreAdminRecord, setFirestoreAdminRecord] = useState(IMMUTABLE_ADMIN);
  const [isSyncingAdmin, setIsSyncingAdmin] = useState(false);
  const [adminSyncMessage, setAdminSyncMessage] = useState('');
  const [showAdminCredPassword, setShowAdminCredPassword] = useState(false);

  const loadDatabaseData = async () => {
    setIsLoadingDb(true);
    try {
      const [farmers, acts, logs, adminDoc] = await Promise.all([
        fetchAllFarmers(),
        fetchRecentActivities(40),
        fetchAdminAuditLogs(20),
        fetchFirestoreAdminDoc()
      ]);
      setFarmersList(farmers);
      setDbActivities(acts);
      setAdminAuditLogs(logs);
      if (adminDoc) setFirestoreAdminRecord(adminDoc);
    } catch (err) {
      console.error("Failed to load DB data:", err);
    } finally {
      setIsLoadingDb(false);
    }
  };

  const handleSyncAdminToFirebase = async () => {
    setIsSyncingAdmin(true);
    setAdminSyncMessage('');
    try {
      const res = await syncAdminCredentialsToFirestore();
      if (res.success) {
        setAdminSyncMessage('Admin credentials verified & successfully synced to Firebase Firestore (/system_admins/admin_root)!');
        const updated = await fetchFirestoreAdminDoc();
        setFirestoreAdminRecord(updated);
      } else {
        setAdminSyncMessage(`Sync failed: ${res.error || 'Check Firebase credentials in .env'}`);
      }
    } catch (err) {
      setAdminSyncMessage(`Error: ${err.message}`);
    } finally {
      setIsSyncingAdmin(false);
      setTimeout(() => setAdminSyncMessage(''), 6000);
    }
  };

  useEffect(() => {
    if (adminTab === 'database') {
      loadDatabaseData();
    }
  }, [adminTab]);

  // API Tester state
  const [apiEndpoint, setApiEndpoint] = useState('/health');
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiParam, setApiParam] = useState('location=Sambalpur, Odisha, India');
  const [apiResult, setApiResult] = useState(null);
  const [isTestingApi, setIsTestingApi] = useState(false);

  const fetchSystemStatus = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await fetch(`${BACKEND_URL}/health`);
      if (res.ok) {
        const data = await res.json();
        setHealthStatus(data);
      } else {
        setHealthStatus({ status: 'offline', error: `HTTP ${res.status}` });
      }
    } catch (err) {
      setHealthStatus({ status: 'unreachable', error: String(err) });
    }

    try {
      const oRes = await fetch('http://127.0.0.1:11434/api/tags');
      if (oRes.ok) {
        const oData = await oRes.json();
        setOllamaTags(oData);
      } else {
        setOllamaTags({ error: `Ollama HTTP ${oRes.status}` });
      }
    } catch {
      setOllamaTags({ status: 'not_running' });
    }
    setIsCheckingHealth(false);
  };

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  const runApiTest = async () => {
    setIsTestingApi(true);
    setApiResult(null);
    const start = performance.now();
    try {
      let url = `${BACKEND_URL}${apiEndpoint}`;
      let options = { method: apiMethod };

      if (apiMethod === 'GET' && apiParam) {
        url += (url.includes('?') ? '&' : '?') + apiParam;
      } else if (apiMethod === 'POST') {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify({ message: "What is the recommended fertilizer for paddy?" });
      }

      const res = await fetch(url, options);
      const latency = Math.round(performance.now() - start);
      const text = await res.text();
      let parsed = text;
      try { parsed = JSON.parse(text); } catch {}

      setApiResult({
        status: res.status,
        statusText: res.statusText,
        latencyMs: latency,
        data: parsed,
      });
    } catch (err) {
      setApiResult({
        status: 500,
        error: String(err),
        latencyMs: Math.round(performance.now() - start)
      });
    } finally {
      setIsTestingApi(false);
    }
  };

  const activeModel = ADMIN_MODELS.find(m => m.id === selectedModelId);
  const ActiveComponent = activeModel ? activeModel.component : null;

  return (
    <div className="main-container space-y-8">
      {/* Admin Top Banner */}
      <div className="glass p-6 rounded-3xl border border-cyan-500/30 bg-[#030712]/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-cyan-400 via-indigo-500 to-violet-500" />
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={12} /> Root Controller
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Activity size={12} /> 10 ML Models Active
            </span>
          </div>
          <h1 className="text-3xl font-black text-white font-display tracking-tight">
            Admin & <span className="gradient-text">Machine Learning Studio</span>
          </h1>
          <p className="text-xs text-text-muted">
            Direct operational access to ML inference pipelines, API endpoints, telemetry logs, and LLM controllers.
          </p>
        </div>

        <button
          onClick={fetchSystemStatus}
          disabled={isCheckingHealth}
          className="btn btn-secondary px-5 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-wider"
        >
          <RefreshCw size={14} className={isCheckingHealth ? 'animate-spin text-cyan-400' : ''} />
          Refresh Nodes
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#030712]/80 backdrop-blur-md rounded-2xl border border-white/5">
        {[
          { id: 'models', label: 'ML Models Lab (10 Models)', icon: Cpu },
          { id: 'system', label: 'System & LLM Engine', icon: Server },
          { id: 'api', label: 'API Testing Studio', icon: Terminal },
          { id: 'database', label: 'Firestore Database & Records', icon: Database },
          { id: 'telemetry', label: 'Active Session Telemetry', icon: Activity },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setAdminTab(tab.id);
                setSelectedModelId(null);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-linear-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ALL 10 ML MODELS */}
      {adminTab === 'models' && (
        <div className="space-y-6">
          {selectedModelId ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <button
                  onClick={() => setSelectedModelId(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black text-cyan-400 uppercase tracking-wider transition-all"
                >
                  ← Return to Model Grid
                </button>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-text-muted">Endpoint: <code className="text-cyan-300 font-bold">{activeModel?.endpoint}</code></span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {activeModel?.type}
                  </span>
                </div>
              </div>

              {/* Directly Render Model Component */}
              <ActiveComponent />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {ADMIN_MODELS.map(model => {
                const Icon = model.icon;
                return (
                  <div
                    key={model.id}
                    className="glass rounded-3xl p-6 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center justify-between">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center border"
                          style={{ backgroundColor: `${model.color}15`, borderColor: `${model.color}30`, color: model.color }}
                        >
                          <Icon size={20} />
                        </div>
                        <span className="font-mono text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white/5 text-cyan-300 border border-white/5">
                          {model.accuracy}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-white font-display">
                          {model.name}
                        </h3>
                        <p className="text-[11px] font-mono text-cyan-400/80 font-bold">
                          {model.type}
                        </p>
                        <p className="text-xs text-text-muted mt-2 leading-relaxed">
                          {model.desc}
                        </p>
                      </div>

                      <div className="bg-[#030712]/90 p-2.5 rounded-xl border border-white/5 font-mono text-[10px] text-text-muted flex justify-between items-center">
                        <span>Route:</span>
                        <span className="text-cyan-400 font-bold">{model.endpoint}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedModelId(model.id)}
                      className="mt-5 w-full btn btn-secondary py-2.5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:border-cyan-400/40"
                    >
                      <Play size={14} /> Launch Model Lab
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SYSTEM & LLM DIAGNOSTICS */}
      {adminTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Backend Diagnostics */}
          <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-widest">
              <Server size={16} /> FastAPI Backend Core
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-text-muted">Host URL:</span>
                <span className="text-white font-bold">{BACKEND_URL}</span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-text-muted">API Status:</span>
                <span className={healthStatus?.status === 'online' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {healthStatus?.status?.toUpperCase() || 'CHECKING...'}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-text-muted">Backend Version:</span>
                <span className="text-white font-bold">{healthStatus?.version || '2.1.0'}</span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-text-muted">AI Configured:</span>
                <span className={healthStatus?.ai_enabled ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {healthStatus?.ai_enabled ? 'TRUE (Active)' : 'FALSE (Fallback Mode)'}
                </span>
              </div>
            </div>
          </div>

          {/* Ollama LLM Diagnostics */}
          <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-violet-400 text-xs font-black uppercase tracking-widest">
              <Cpu size={16} /> Ollama Local LLM Engine
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-text-muted">Ollama Endpoint:</span>
                <span className="text-white font-bold">http://127.0.0.1:11434</span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-text-muted">Target Model:</span>
                <span className="text-cyan-400 font-bold">llama3.2</span>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <span className="text-text-muted block">Installed Model Tags:</span>
                {ollamaTags?.models && ollamaTags.models.length > 0 ? (
                  <div className="space-y-1">
                    {ollamaTags.models.map((m, i) => (
                      <div key={i} className="flex justify-between text-emerald-400 font-bold">
                        <span>{m.name}</span>
                        <span className="text-text-muted text-[10px]">{(m.size / (1024 * 1024 * 1024)).toFixed(2)} GB</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-amber-400 text-[11px]">No models installed or Ollama daemon offline.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: API TESTING STUDIO */}
      {adminTab === 'api' && (
        <div className="glass p-6 rounded-3xl border border-white/5 space-y-6">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-widest">
            <Terminal size={16} /> Interactive Endpoint Tester
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-text-muted mb-2 uppercase">Method</label>
              <select
                value={apiMethod}
                onChange={(e) => setApiMethod(e.target.value)}
                className="w-full bg-[#030712] border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono text-white focus:outline-none"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-mono text-text-muted mb-2 uppercase">Endpoint</label>
              <select
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="w-full bg-[#030712] border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono text-white focus:outline-none"
              >
                <option value="/health">/health</option>
                <option value="/ml/market-rates">/ml/market-rates</option>
                <option value="/ml/market-forecast?crop=Paddy">/ml/market-forecast</option>
                <option value="/advisories?crop=Paddy&location=Sambalpur">/advisories</option>
                <option value="/schemes?state=Odisha&crop=Paddy">/schemes</option>
                <option value="/chat">/chat (Ollama LLM)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-text-muted mb-2 uppercase">Action</label>
              <button
                onClick={runApiTest}
                disabled={isTestingApi}
                className="w-full btn btn-primary py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2"
              >
                <Play size={14} /> {isTestingApi ? 'Executing...' : 'Send Request'}
              </button>
            </div>
          </div>

          {apiMethod === 'GET' && apiEndpoint === '/ml/market-rates' && (
            <div>
              <label className="block text-[11px] font-mono text-text-muted mb-2 uppercase">Query Parameters</label>
              <input
                type="text"
                value={apiParam}
                onChange={(e) => setApiParam(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none"
                placeholder="location=Sambalpur, Odisha, India"
              />
            </div>
          )}

          {/* Test Results Output */}
          {apiResult && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-text-muted">Response Inspector:</span>
                <span className="text-cyan-400 font-bold">Latency: {apiResult.latencyMs} ms | Status: {apiResult.status}</span>
              </div>
              <pre className="p-4 bg-[#01040a] rounded-2xl border border-cyan-500/20 text-cyan-200 text-xs font-mono max-h-96 overflow-y-auto leading-relaxed shadow-inner">
                {JSON.stringify(apiResult.data || apiResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* TAB: CLOUD FIRESTORE DATABASE & USER MANAGEMENT */}
      {adminTab === 'database' && (
        <div className="space-y-6">
          {/* Cloud Connection Status Header */}
          <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                isFirebaseConfigured
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
              }`}>
                <Database size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white font-display">
                    Cloud Firestore Engine
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isFirebaseConfigured
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {isFirebaseConfigured ? 'Live Cloud Sync' : 'Local Storage Cache'}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5 font-mono">
                  {isFirebaseConfigured
                    ? `Connected to Firebase Project: ${firebaseConfig.projectId}`
                    : 'Running in offline/local storage fallback. Set VITE_FIREBASE_PROJECT_ID in .env to sync with remote Google Cloud.'}
                </p>
              </div>
            </div>

            <button
              onClick={loadDatabaseData}
              disabled={isLoadingDb}
              className="btn btn-secondary px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider self-start sm:self-auto"
            >
              <RefreshCw size={14} className={isLoadingDb ? 'animate-spin text-cyan-400' : ''} />
              Sync Firestore
            </button>
          </div>

          {/* Admin Credentials & Security Policy Card */}
          <div className="glass p-6 rounded-3xl border border-white/5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/5 gap-3">
              <div className="flex items-center gap-2 text-violet-400 text-xs font-black uppercase tracking-widest">
                <ShieldCheck size={16} /> Firebase Root Administrator Credentials
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                  Firestore: /system_admins/admin_root
                </span>
                <button
                  onClick={handleSyncAdminToFirebase}
                  disabled={isSyncingAdmin}
                  className="px-3 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/30 text-white text-xs font-black flex items-center gap-1.5 transition-all"
                >
                  <Sparkles size={13} className={isSyncingAdmin ? 'animate-spin text-violet-400' : 'text-violet-300'} />
                  {isSyncingAdmin ? 'Syncing...' : 'Sync to Firebase'}
                </button>
              </div>
            </div>

            {adminSyncMessage && (
              <div className="p-3 bg-violet-500/10 border border-violet-500/30 rounded-2xl text-xs font-mono text-violet-300 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>{adminSyncMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-text-muted">Admin Username</span>
                <p className="text-sm font-black text-white font-mono">{firestoreAdminRecord.username || IMMUTABLE_ADMIN.username}</p>
                <span className="text-[10px] text-text-muted">Cloud Firestore Key</span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase text-text-muted">Root Password</span>
                  <button
                    onClick={() => setShowAdminCredPassword(!showAdminCredPassword)}
                    className="text-text-muted hover:text-white transition-colors"
                  >
                    {showAdminCredPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                <p className="text-xs font-black text-emerald-400 font-mono tracking-wider break-all">
                  {showAdminCredPassword
                    ? (firestoreAdminRecord.password || IMMUTABLE_ADMIN.password)
                    : '•••••••••••••••••••••••••'}
                </p>
                <span className="text-[10px] text-emerald-400 font-bold">25 chars • Ultra-Strong</span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-text-muted">System Role</span>
                <p className="text-sm font-black text-violet-300">{firestoreAdminRecord.role || IMMUTABLE_ADMIN.role}</p>
                <span className="text-[10px] text-text-muted">Full Model Execution Access</span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-text-muted">Security Policy</span>
                <p className="text-xs font-bold text-emerald-400">Strictly Immutable</p>
                <span className="text-[10px] text-text-muted">Protected in Cloud Firestore</span>
              </div>
            </div>

            {/* Admin Audit Log */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Recent Admin Authentication Audit Logs ({adminAuditLogs.length})
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {adminAuditLogs.length > 0 ? (
                  adminAuditLogs.map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/5 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${log.action === 'ADMIN_AUTH_SUCCESS' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span className="text-white font-bold">{log.action}</span>
                        <span className="text-text-muted">({log.attemptedUser})</span>
                      </div>
                      <span className="text-text-muted text-[11px]">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-muted font-mono p-3 bg-black/20 rounded-xl">No admin auth events recorded yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Registered Farmers Database */}
          <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-widest">
                <User size={16} /> Registered Farmers Database ({farmersList.length})
              </div>
              <span className="text-xs font-mono text-text-muted">Collection: /farmers</span>
            </div>

            {farmersList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-text-muted text-[10px] uppercase tracking-wider">
                      <th className="py-3 px-3">Farmer Name</th>
                      <th className="py-3 px-3">Location / District</th>
                      <th className="py-3 px-3">Crop</th>
                      <th className="py-3 px-3">Land Size</th>
                      <th className="py-3 px-3">Soil Type</th>
                      <th className="py-3 px-3">Irrigation</th>
                      <th className="py-3 px-3">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {farmersList.map((farmer, idx) => (
                      <tr key={farmer.id || idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs">🌾</span>
                          {farmer.name}
                        </td>
                        <td className="py-3 px-3 text-cyan-200">{farmer.location}</td>
                        <td className="py-3 px-3 text-emerald-300 font-bold">{farmer.crop}</td>
                        <td className="py-3 px-3 text-text-muted">{farmer.landSize} ac</td>
                        <td className="py-3 px-3 text-text-muted">{farmer.soilType}</td>
                        <td className="py-3 px-3 text-text-muted">{farmer.irrigation}</td>
                        <td className="py-3 px-3 text-text-muted text-[11px]">
                          {farmer.updatedAt ? new Date(farmer.updatedAt).toLocaleDateString() : 'Active'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-text-muted font-mono text-xs">
                No farmer records found in database yet. New registrations in Farmer Portal will appear here.
              </div>
            )}
          </div>

          {/* Farm Activity Stream */}
          <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest">
                <Activity size={16} /> Global Farm Activities Stream ({dbActivities.length})
              </div>
              <span className="text-xs font-mono text-text-muted">Collection: /farm_activities</span>
            </div>

            {dbActivities.length > 0 ? (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                {dbActivities.map((act, idx) => (
                  <div key={act.id || idx} className="p-3 bg-white/5 rounded-2xl border border-white/5 text-xs font-mono space-y-1">
                    <div className="flex justify-between text-cyan-400 font-bold uppercase text-[10px]">
                      <span>{act.type} • Farmer: {act.farmerId}</span>
                      <span className="text-text-muted">{new Date(act.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-white text-xs">{act.note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-text-muted font-mono text-xs">
                No farm activities logged yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: FARMER TELEMETRY & STATE */}
      {adminTab === 'telemetry' && (
        <div className="glass p-6 rounded-3xl border border-white/5 space-y-6">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-widest">
            <Database size={16} /> Farmer Session State & Logged Telemetry
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-base font-black text-white font-display">Active Farmer Profile</h3>
              {profile ? (
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-text-muted">Name:</span>
                    <span className="text-white font-bold">{profile.name}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-text-muted">Location:</span>
                    <span className="text-white font-bold">{profile.location}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-text-muted">Primary Crop:</span>
                    <span className="text-white font-bold">{profile.crop}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-text-muted">Land Size:</span>
                    <span className="text-white font-bold">{profile.landSize} Acres</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-text-muted">Soil Type:</span>
                    <span className="text-white font-bold">{profile.soilType}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-text-muted font-mono">No active farmer profile in session.</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-black text-white font-display">Logged Field Activities ({activities.length})</h3>
              {activities && activities.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {activities.map(act => (
                    <div key={act.id} className="p-3 bg-white/5 rounded-2xl border border-white/5 text-xs font-mono space-y-1">
                      <div className="flex justify-between text-cyan-400 font-bold uppercase text-[10px]">
                        <span>{act.type}</span>
                        <span className="text-text-muted">{new Date(act.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-white text-xs">{act.note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-muted font-mono">No activities logged yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
