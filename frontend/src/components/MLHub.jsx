import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, TrendingUp, Cloud, Cpu, Zap, Shield } from 'lucide-react';
import DiseaseDetector from './DiseaseDetector';
import YieldPredictor from './YieldPredictor';
import WeatherAdvisor from './WeatherAdvisor';

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
];

const MLHub = () => {
  const [activeTab, setActiveTab] = useState('disease');

  const activeModel = ML_TABS.find(t => t.id === activeTab);
  const ActiveComponent = activeModel.component;

  return (
    <div className="main-container">
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
          Three specialized AI models working together to give your farm an intelligent edge.
        </motion.p>
      </header>

      {/* Model Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ML_TABS.map((tab, i) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.97 }}
            className={`glass-card text-left relative overflow-hidden group transition-all duration-300 ${
              activeTab === tab.id ? 'border-white/20 shadow-2xl' : 'hover:border-white/10'
            }`}
            style={activeTab === tab.id ? { boxShadow: `0 20px 50px -10px ${tab.accent}40` } : {}}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab-bg"
                className="absolute inset-0 rounded-3xl"
                style={{ background: `linear-gradient(135deg, ${tab.accent}15, transparent)` }}
              />
            )}
            <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-3xl transition-all duration-300"
              style={{ background: activeTab === tab.id ? `linear-gradient(90deg, transparent, ${tab.accent}, transparent)` : 'transparent' }}
            />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl" style={{ background: `${tab.accent}20` }}>
                  <tab.icon size={28} style={{ color: tab.accent }} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${tab.badgeColor} border border-white/10`}>
                  {tab.badge}
                </span>
              </div>
              <h3 className="text-xl font-black mb-2">{tab.label}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{tab.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Models Active', value: '3', icon: Cpu, color: 'text-primary' },
          { label: 'Accuracy', value: '92.3%', icon: Shield, color: 'text-success' },
          { label: 'Crops Supported', value: '5+', icon: Leaf, color: 'text-accent' },
          { label: 'Inference Time', value: '<2s', icon: Zap, color: 'text-warning' },
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
          <div className="absolute top-0 inset-x-0 h-1 rounded-t-[32px]"
            style={{ background: `linear-gradient(90deg, transparent, ${activeModel.accent}, transparent)` }}
          />
          <ActiveComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MLHub;
