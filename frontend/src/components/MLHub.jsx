import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, TrendingUp, Cloud, Cpu, Zap, Shield, Beaker, Bug, ChevronRight, Eye, Mic, Grid3X3, Coins, Search, ArrowLeft } from 'lucide-react';

/* ─── Animated count-up hook ─── */
function useCountUp(target, duration = 1000, delay = 0) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const numeric = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    if (isNaN(numeric)) { setValue(target); return; }
    let start = null;
    const t = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.floor(eased * numeric));
        if (p < 1) raf.current = requestAnimationFrame(step);
        else setValue(numeric);
      };
      raf.current = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(t); if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration, delay]);
  return value;
}

/* ─── 3D tilt hook ─── */
function useTilt(strength = 8) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) scale(1.03)`;
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, [strength]);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = '';
  }, []);
  return { ref, onMove, onLeave };
}

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

const ML_TABS = [
  {
    id: 'disease',
    label: 'Disease Detection',
    shortLabel: 'Disease',
    icon: Leaf,
    badge: 'CNN Vision',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Upload a leaf photo for instant AI disease diagnosis using a Convolutional Neural Network.',
    component: DiseaseDetector,
    accent: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.15)',
    accuracy: '98.2%',
    category: 'Vision & Acoustics',
  },
  {
    id: 'decay',
    label: 'Future Decay Predictor',
    shortLabel: 'Decay',
    icon: Eye,
    badge: 'Generative ML',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: 'Predict and visualize leaf degradation and future decay patterns under simulated nutrient stresses.',
    component: FutureDecayPredictor,
    accent: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.15)',
    accuracy: '97.2%',
    category: 'Vision & Acoustics',
  },
  {
    id: 'acoustic',
    label: 'Bio-Acoustic Canopy Monitor',
    shortLabel: 'Acoustic',
    icon: Mic,
    badge: 'DSP Spectral FFT',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Analyze real-time or recorded farm canopy audio to classify pollinator frequency signatures or locate pest swarms.',
    component: AcousticMonitor,
    accent: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.15)',
    accuracy: '98.4%',
    category: 'Vision & Acoustics',
  },
  {
    id: 'pest',
    label: 'Pest Forecasting',
    shortLabel: 'Pests',
    icon: Bug,
    badge: 'Rules Engine',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    description: 'Predict pest outbreaks based on crop type and current climatic conditions.',
    component: PestForecast,
    accent: '#f43f5e',
    accentGlow: 'rgba(244, 63, 94, 0.15)',
    accuracy: '94.5%',
    category: 'Analytics & Planning',
  },
  {
    id: 'yield',
    label: 'Yield Prediction',
    shortLabel: 'Yield',
    icon: TrendingUp,
    badge: 'Regression ML',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    description: 'Enter your farm parameters to predict estimated crop yield using a trained regression model.',
    component: YieldPredictor,
    accent: '#8b5cf6',
    accentGlow: 'rgba(139, 92, 246, 0.15)',
    accuracy: '96.1%',
    category: 'Analytics & Planning',
  },
  {
    id: 'weather',
    label: 'Weather Advisory',
    shortLabel: 'Climate',
    icon: Cloud,
    badge: 'NLP Rules Engine',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    description: 'Get contextual, crop-specific farm advisories based on current weather conditions.',
    component: WeatherAdvisor,
    accent: '#0ea5e9',
    accentGlow: 'rgba(14, 165, 233, 0.15)',
    accuracy: '95.8%',
    category: 'Advisories & Guides',
  },
  {
    id: 'polyculture',
    label: 'Spatial Polyculture Solver',
    shortLabel: 'Polyculture',
    icon: Grid3X3,
    badge: 'Adjacency Logic Engine',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    description: 'Design a highly synergetic 3x3 crop layout and calculate a 3-year rotating genetic plantation timeline.',
    component: PolycultureSolver,
    accent: '#8b5cf6',
    accentGlow: 'rgba(139, 92, 246, 0.15)',
    accuracy: '95.6%',
    category: 'Analytics & Planning',
  },
  {
    id: 'crop_recommendation',
    label: 'Crop Recommendation',
    shortLabel: 'Crop',
    icon: Leaf,
    badge: 'Random Forest',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: 'Analyze soil NPK, pH, and climate data to predict the most suitable and profitable crop.',
    component: CropRecommender,
    accent: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.15)',
    accuracy: '97.6%',
    category: 'Advisories & Guides',
  },
  {
    id: 'fertilizer_recommendation',
    label: 'Fertilizer Guide',
    shortLabel: 'Fertilizer',
    icon: Beaker,
    badge: 'Gradient Boost',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    description: 'Provide NPK values, soil type, and crop type to receive precision fertilizer blend recommendations.',
    component: FertilizerRecommender,
    accent: '#ec4899',
    accentGlow: 'rgba(236, 72, 153, 0.15)',
    accuracy: '96.8%',
    category: 'Advisories & Guides',
  },
  {
    id: 'carbon',
    label: 'Carbon Sequestration Ledger',
    shortLabel: 'Carbon Ledger',
    icon: Coins,
    badge: 'Eco-Ledger Simulation',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    description: 'Estimate annual soil organic carbon sequestration and maintain a verified transaction credit ledger.',
    component: CarbonLedger,
    accent: '#0ea5e9',
    accentGlow: 'rgba(14, 165, 233, 0.15)',
    accuracy: '99.1%',
    category: 'Analytics & Planning',
  },
];

const MLHub = () => {
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [launchingId, setLaunchingId] = useState(null);

  /* Count-up for stat row */
  const countModels = useCountUp(10, 800, 300);
  const countAccuracy = useCountUp(96.9, 1000, 400);
  const countCrops = useCountUp(25, 700, 500);

  const handleLaunch = (id) => {
    setLaunchingId(id);
    setTimeout(() => {
      setLaunchingId(null);
      setSelectedModelId(id);
    }, 520);
  };

  const selectedModel = ML_TABS.find(tab => tab.id === selectedModelId);
  const ActiveComponent = selectedModel ? selectedModel.component : null;

  const filteredModels = ML_TABS.filter((model) => {
    const matchesSearch = model.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || model.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } }
  };

  return (
    <div className="main-container relative">
      <header className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 bg-cyan-950/40 rounded-full border border-cyan-500/30 text-sm font-black uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)] text-cyan-300 font-display"
        >
          <Cpu size={16} className="text-cyan-400 animate-pulse" />
          Cyber-Intelligence Neural Hub
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black tracking-tighter mb-4 font-display"
        >
          AI <span className="gradient-text">Neural Core Suite</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-muted text-lg max-w-2xl mx-auto"
        >
          An integrated ecosystem of ten specialized machine learning nodes giving your farm a precision edge.
        </motion.p>
      </header>

      {selectedModelId === null ? (
        /* Grid Dashboard View */
        <div className="space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Models Active', value: countModels, suffix: '', icon: Cpu, color: 'text-cyan-400', glow: 'rgba(6,182,212,0.4)' },
              { label: 'Avg Suite Accuracy', value: countAccuracy, suffix: '%', icon: Shield, color: 'text-cyan-300', glow: 'rgba(34,211,238,0.4)' },
              { label: 'Crops Calibrated', value: countCrops, suffix: '+', icon: Leaf, color: 'text-violet-400', glow: 'rgba(139,92,246,0.4)' },
              { label: 'Inference Latency', value: null, display: '<0.4s', icon: Zap, color: 'text-amber-400', glow: 'rgba(245,158,11,0.4)' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.2, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -4, boxShadow: `0 20px 40px -10px rgba(0,0,0,0.7), 0 0 25px -5px ${stat.glow}` }}
                className="glass-card flex items-center gap-4 py-4 px-6 cursor-default border border-cyan-500/20"
              >
                <div className={`p-2.5 bg-cyan-950/40 border border-cyan-500/20 rounded-2xl ${stat.color} shadow-inner pulse-ring`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <motion.p
                    key={stat.value}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-black leading-none tabular-nums text-white font-[var(--font-mono)]"
                  >
                    {stat.display ?? `${stat.value}${stat.suffix}`}
                  </motion.p>
                  <p className="text-[9px] text-cyan-400/60 font-black uppercase tracking-widest mt-1 font-display">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Controls: Search and Category filter chips */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-cyan-950/20 border border-cyan-500/20 p-5 rounded-3xl backdrop-blur-md">
            <div className="relative w-full lg:max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                placeholder="Search Neural Models (e.g. CNN, yield, soil)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-cyan-500/20 rounded-2xl text-white outline-none focus:border-cyan-400 focus:bg-cyan-950/30 transition-all placeholder-white/30"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center w-full lg:w-auto">
              {['All', 'Vision & Acoustics', 'Advisories & Guides', 'Analytics & Planning'].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 border font-display ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-white/5 text-text-muted border-cyan-500/10 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Models Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredModels.map((tab) => {
              const Icon = tab.icon;
              const isLaunching = launchingId === tab.id;
              return (
                <motion.div
                  key={tab.id}
                  variants={itemVariants}
                  onClick={() => handleLaunch(tab.id)}
                  onMouseMove={(e) => {
                    const el = e.currentTarget;
                    const rect = el.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    el.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
                    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = '';
                  }}
                  className="glass-card spotlight-card tilt-card flex flex-col justify-between h-full border border-white/5 cursor-pointer relative overflow-hidden group transition-[border-color,box-shadow] duration-300 hover:border-white/20"
                  style={{ transformOrigin: 'center center' }}
                >
                  {/* Model launch progress bar */}
                  {isLaunching && (
                    <div className="absolute top-0 left-0 right-0 z-20">
                      <div className="model-loading-bar" />
                    </div>
                  )}

                  {/* Dynamic glow corner — scales up on hover */}
                  <motion.div
                    className="absolute -top-24 -right-24 w-48 h-48 rounded-full pointer-events-none filter blur-[40px]"
                    initial={{ opacity: 0.03, scale: 1 }}
                    whileHover={{ opacity: 0.18, scale: 1.5 }}
                    transition={{ duration: 0.4 }}
                    style={{ backgroundColor: tab.accent }}
                  />

                  <div className="relative z-10 flex-1">
                    <div className="flex justify-between items-start mb-5">
                      <motion.div
                        className="p-3.5 rounded-2xl transition-all duration-300 relative"
                        whileHover={{ scale: 1.12 }}
                        style={{ backgroundColor: `${tab.accent}15`, color: tab.accent }}
                      >
                        <Icon size={24} />
                      </motion.div>
                      <span className="text-[10px] font-black text-success bg-success/10 border border-success/20 px-3 py-1 rounded-full pulse-ring">
                        {tab.accuracy} Acc
                      </span>
                    </div>

                    <h3 className="font-black text-xl mb-2 text-white group-hover:text-white transition-colors">
                      {tab.label}
                    </h3>

                    <div className="flex gap-2 mb-4">
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${tab.badgeColor}`}>
                        {tab.badge}
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/5 bg-white/5 text-text-muted">
                        {tab.category}
                      </span>
                    </div>

                    <p className="text-text-muted text-sm leading-relaxed mb-6 font-medium">
                      {tab.description}
                    </p>
                  </div>

                  <div className="relative z-10 pt-4 border-t border-cyan-500/15 flex items-center justify-between text-xs font-black uppercase tracking-widest text-cyan-400 group-hover:text-white transition-colors font-display">
                    <span>{isLaunching ? 'Initializing Node…' : 'Launch Model'}</span>
                    <motion.div
                      animate={isLaunching ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.5, ease: 'linear', repeat: isLaunching ? Infinity : 0 }}
                      className="p-2 bg-white/5 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-cyan-600 rounded-xl transition-all duration-300 text-white group-hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                    >
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      ) : (
        /* Interactive Model Workspace View */
        <div className="flex flex-col gap-6 w-full">
          <div>
            <button
              onClick={() => setSelectedModelId(null)}
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-950/30 rounded-full border border-cyan-500/25 hover:border-cyan-400/50 text-xs font-black uppercase tracking-widest transition-all duration-300 hover:bg-cyan-500/15 hover:shadow-[0_4px_20px_rgba(6,182,212,0.2)] hover:-translate-y-0.5 text-cyan-200 font-display"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300 text-cyan-400" />
              <span>Back to Neural Suite</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedModel.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="glass p-8 md:p-12 relative overflow-hidden flex flex-col h-full border border-cyan-500/25 w-full bg-[#030712]/90"
              style={{
                boxShadow: `0 30px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px -10px ${selectedModel.accentGlow}`
              }}
            >
              <div 
                className="absolute top-0 inset-x-0 h-[3px] transition-colors duration-500"
                style={{ 
                  background: `linear-gradient(90deg, transparent, ${selectedModel.accent}, transparent)` 
                }}
              />

              <div 
                className="absolute -top-40 -right-40 w-96 h-96 rounded-full pointer-events-none filter blur-[100px] opacity-[0.08] transition-all duration-500"
                style={{ backgroundColor: selectedModel.accent }}
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-8 mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div 
                    className="p-4 rounded-2xl shadow-inner transition-colors duration-500"
                    style={{ 
                      backgroundColor: `${selectedModel.accent}20`, 
                      color: selectedModel.accent 
                    }}
                  >
                    <selectedModel.icon size={26} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-1">
                      <h3 className="text-2.5xl font-black tracking-tight">{selectedModel.label}</h3>
                      <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-white/5 bg-white/5 text-text-muted">
                        {selectedModel.category}
                      </span>
                    </div>
                    <p className="text-text-muted text-sm leading-relaxed max-w-xl">
                      {selectedModel.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <span className={`text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border ${selectedModel.badgeColor}`}>
                    {selectedModel.badge}
                  </span>
                  <span className="text-[10px] font-black text-success bg-success/15 border border-success/20 px-3 py-1 rounded-full shrink-0">
                    Accuracy: {selectedModel.accuracy}
                  </span>
                </div>
              </div>

              <div className="relative z-10 w-full overflow-hidden min-h-[300px]">
                <ActiveComponent />
              </div>

              <div
                className="absolute -right-16 -bottom-16 w-80 h-80 opacity-[0.015] pointer-events-none transition-all duration-500"
                style={{ color: selectedModel.accent }}
              >
                <selectedModel.icon size={320} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MLHub;
