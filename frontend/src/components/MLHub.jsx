import React from 'react';
import { motion } from 'framer-motion';
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
  return (
    <div className="main-container relative">
      {/* Hub Header */}
      <header className="text-center mb-12">
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

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
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

      {/* Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {ML_TABS.map((model, i) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 relative overflow-hidden flex flex-col h-full"
          >
            {/* Top accent line */}
            <div className="absolute top-0 inset-x-0 h-1"
              style={{ background: `linear-gradient(90deg, transparent, ${model.accent}, transparent)` }}
            />
            
            {/* Header for the model */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl" style={{ background: `${model.accent}20`, color: model.accent }}>
                  <model.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black">{model.label}</h3>
                  <p className="text-text-muted text-sm mt-1 max-w-sm">{model.description}</p>
                </div>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${model.badgeColor} border border-white/10 shrink-0 hidden sm:block`}>
                {model.badge}
              </span>
            </div>

            {/* The Model Component */}
            <div className="flex-1 relative z-10 w-full overflow-hidden">
              <model.component />
            </div>

            {/* Background Icon */}
            <div
              className="absolute -right-10 -bottom-10 w-64 h-64 opacity-[0.03] pointer-events-none"
              style={{ color: model.accent }}
            >
              <model.icon size={256} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MLHub;
