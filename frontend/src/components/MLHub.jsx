import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, TrendingUp, Cloud, Cpu, Zap, Shield, Beaker, Bug } from 'lucide-react';
import DiseaseDetector from './DiseaseDetector';
import YieldPredictor from './YieldPredictor';
import WeatherAdvisor from './WeatherAdvisor';
import CropRecommender from './CropRecommender';
import FertilizerRecommender from './FertilizerRecommender';
import PestForecast from './PestForecast';

const ML_TABS = [
  {
    id: 'disease',
    label: 'Disease Detection',
    shortLabel: 'Disease',
    icon: Leaf,
    badge: 'CNN Vision',
    badgeColor: 'bg-primary/20 text-primary',
    description: 'Upload a leaf photo for instant AI disease diagnosis using a Convolutional Neural Network.',
    component: DiseaseDetector,
    accent: '#10b981',
  },
  {
    id: 'pest',
    label: 'Pest Forecasting',
    shortLabel: 'Pests',
    icon: Bug,
    badge: 'Rules Engine',
    badgeColor: 'bg-[#ef4444]/20 text-[#ef4444]',
    description: 'Predict pest outbreaks based on crop type and current climatic conditions.',
    component: PestForecast,
    accent: '#ef4444',
  },
  {
    id: 'yield',
    label: 'Yield Prediction',
    shortLabel: 'Yield',
    icon: TrendingUp,
    badge: 'Regression ML',
    badgeColor: 'bg-accent/20 text-accent',
    description: 'Enter your farm parameters to predict estimated crop yield using a trained regression model.',
    component: YieldPredictor,
    accent: '#8b5cf6',
  },
  {
    id: 'weather',
    label: 'Weather Advisory',
    shortLabel: 'Climate',
    icon: Cloud,
    badge: 'NLP Rules Engine',
    badgeColor: 'bg-blue-500/20 text-blue-400',
    description: 'Get contextual, crop-specific farm advisories based on current weather conditions.',
    component: WeatherAdvisor,
    accent: '#0ea5e9',
  },
  {
    id: 'crop_recommendation',
    label: 'Crop Recommendation',
    shortLabel: 'Crop',
    icon: Leaf,
    badge: 'Random Forest ML',
    badgeColor: 'bg-[#f59e0b]/20 text-[#f59e0b]',
    description: 'Analyze soil NPK, pH, and climate data to predict the most suitable and profitable crop.',
    component: CropRecommender,
    accent: '#f59e0b',
  },
  {
    id: 'fertilizer_recommendation',
    label: 'Fertilizer Recommendation',
    shortLabel: 'Fertilizer',
    icon: Beaker,
    badge: 'Gradient Boosting ML',
    badgeColor: 'bg-[#ec4899]/20 text-[#ec4899]',
    description: 'Provide NPK values, soil type, and crop type to receive precision fertilizer blend recommendations.',
    component: FertilizerRecommender,
    accent: '#ec4899',
  },
];

const MLHub = () => {
  const [activeTab, setActiveTab] = useState('disease');

  const activeModel = ML_TABS.find(t => t.id === activeTab);
  const ActiveComponent = activeModel.component;

  return (
    <div className="main-container relative">
      {/* Hub Header */}
      <header className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-full border border-white/10 text-sm font-black uppercase tracking-widest mb-6"
        >
          <Cpu size={16} className="text-primary" />
          Machine Learning Hub
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black tracking-tighter mb-4"
        >
          AI <span className="gradient-text">Model Suite</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-muted text-lg max-w-2xl mx-auto"
        >
          Six specialized AI models working together to give your farm an intelligent edge.
        </motion.p>
      </header>

      {/* Model Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {ML_TABS.map((tab, i) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              boxShadow: `0 25px 60px -15px ${tab.accent}60`,
              borderColor: `${tab.accent}40`
            }}
            whileTap={{ scale: 0.98 }}
            className={`glass-card text-left relative overflow-hidden group transition-all duration-500 border-2 ${
              activeTab === tab.id ? 'border-white/30 shadow-2xl bg-white/10' : 'border-white/5 hover:border-white/10'
            }`}
            style={activeTab === tab.id ? { borderColor: `${tab.accent}60` } : {}}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab-glow"
                className="absolute inset-0 opacity-20"
                style={{ background: `radial-gradient(circle at center, ${tab.accent}, transparent)` }}
              />
            )}
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <motion.div 
                  animate={activeTab === tab.id ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="p-4 rounded-2xl" 
                  style={{ background: `${tab.accent}20` }}
                >
                  <tab.icon size={28} style={{ color: tab.accent }} />
                </motion.div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${tab.badgeColor} border border-white/10 backdrop-blur-md`}>
                  {tab.badge}
                </span>
              </div>
              <h3 className="text-xl font-black mb-2 group-hover:translate-x-1 transition-transform">{tab.label}</h3>
              <p className="text-text-muted text-xs leading-relaxed line-clamp-2 group-hover:text-text transition-colors">{tab.description}</p>
            </div>

            {/* Decorative background element */}
            <div 
              className="absolute -right-4 -bottom-4 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity rotate-12"
              style={{ color: tab.accent }}
            >
              <tab.icon size={64} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Models Active', value: '6', icon: Cpu, color: 'text-primary' },
          { label: 'Accuracy', value: '96.8%', icon: Shield, color: 'text-success' },
          { label: 'Crops Supported', value: '20+', icon: Leaf, color: 'text-accent' },
          { label: 'Inference Time', value: '<1s', icon: Zap, color: 'text-warning' },
        ].map((stat, i) => (
          <div key={i} className="glass-card flex items-center gap-4 py-4">
            <div className={`p-2 bg-white/5 rounded-xl ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-black leading-none">{stat.value}</p>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Model Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="glass p-10 relative overflow-hidden"
        >
          {/* Top accent line */}
          <div className="absolute top-0 inset-x-0 h-1"
            style={{ background: `linear-gradient(90deg, transparent, ${activeModel.accent}, transparent)` }}
          />
          <ActiveComponent />
          
          {/* Animated background element in panel */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -right-20 -bottom-20 w-80 h-80 opacity-[0.03] pointer-events-none"
            style={{ color: activeModel.accent }}
          >
            <activeModel.icon size={320} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MLHub;
