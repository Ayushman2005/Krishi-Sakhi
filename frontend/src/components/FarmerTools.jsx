import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, Sprout, Cloud, Bug, TrendingUp, Beaker, 
  Eye, Mic, Grid3X3, Coins, ArrowLeft, ArrowRight, 
  CheckCircle2, Sparkles, HeartPulse, Search
} from 'lucide-react';

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

const FARMER_TOOLS = [
  {
    id: 'disease',
    title: 'Plant Health & Disease Doctor',
    tagline: 'Instant leaf diagnosis',
    description: 'Take or upload a photo of any unhealthy leaf to identify plant diseases and get natural, organic cure solutions.',
    icon: Leaf,
    badge: 'Photo Diagnosis',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    component: DiseaseDetector,
    accent: '#10b981',
  },
  {
    id: 'crop',
    title: 'Best Crop Selector',
    tagline: 'Smart crop recommendation',
    description: 'Find the highest-yielding crop for your specific soil type, rainfall, temperature, and local farming season.',
    icon: Sprout,
    badge: 'Crop Advice',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    component: CropRecommender,
    accent: '#06b6d4',
  },
  {
    id: 'fertilizer',
    title: 'Fertilizer & Soil Nutrition Guide',
    tagline: 'Accurate nutrient dosage',
    description: 'Calculate the exact required doses of Nitrogen, Phosphorus, Potassium, and compost for your field.',
    icon: Beaker,
    badge: 'Soil Nutrition',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    component: FertilizerRecommender,
    accent: '#6366f1',
  },
  {
    id: 'weather',
    title: 'Farm Weather & Rain Forecast',
    tagline: 'Local 7-day weather',
    description: 'Get daily rain probabilities, wind speeds, and ideal windows for fertilizer spraying and irrigation.',
    icon: Cloud,
    badge: 'Weather & Rain',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    component: WeatherAdvisor,
    accent: '#0ea5e9',
  },
  {
    id: 'pest',
    title: 'Pest & Insect Alert',
    tagline: 'Early attack warning',
    description: 'Forecast upcoming pest outbreaks (like stem borers or aphids) based on humidity and seasonal patterns.',
    icon: Bug,
    badge: 'Pest Protection',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    component: PestForecast,
    accent: '#f43f5e',
  },
  {
    id: 'yield',
    title: 'Harvest & Yield Estimator',
    tagline: 'Predict your harvest',
    description: 'Estimate expected quintals per acre based on your seed variety, irrigation type, and land size.',
    icon: TrendingUp,
    badge: 'Harvest Estimate',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    component: YieldPredictor,
    accent: '#8b5cf6',
  },
  {
    id: 'decay',
    title: 'Crop Freshness & Storage Life',
    tagline: 'Post-harvest shelf life',
    description: 'Estimate how long harvested produce will stay fresh under different temperature and storage conditions.',
    icon: Eye,
    badge: 'Storage Life',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    component: FutureDecayPredictor,
    accent: '#f59e0b',
  },
  {
    id: 'polyculture',
    title: 'Companion & Mixed Cropping',
    tagline: 'Double your income',
    description: 'Find beneficial companion crops and pulse varieties to grow alongside your main crop for healthier soil.',
    icon: Grid3X3,
    badge: 'Intercropping',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    component: PolycultureSolver,
    accent: '#14b8a6',
  },
  {
    id: 'acoustic',
    title: 'Field Sound & Hive Health',
    tagline: 'Acoustic farm sensor',
    description: 'Analyze farm audio to monitor honeybee hive activity and identify harmful insect swarms.',
    icon: Mic,
    badge: 'Audio Sensor',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    component: AcousticMonitor,
    accent: '#ec4899',
  },
  {
    id: 'carbon',
    title: 'Green Farming Points & Rewards',
    tagline: 'Eco-friendly benefits',
    description: 'Track organic farming practices and calculate carbon points that can be redeemed for sustainable bonuses.',
    icon: Coins,
    badge: 'Green Rewards',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    component: CarbonLedger,
    accent: '#10b981',
  },
];

const FarmerTools = () => {
  const [activeToolId, setActiveToolId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeTool = FARMER_TOOLS.find(t => t.id === activeToolId);
  const ActiveComponent = activeTool ? activeTool.component : null;

  const filteredTools = FARMER_TOOLS.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="main-container">
      <AnimatePresence mode="wait">
        {activeTool ? (
          <motion.div
            key="tool-detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Back Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <button
                type="button"
                onClick={() => setActiveToolId(null)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-wider text-cyan-400 border border-white/5 transition-all"
              >
                <ArrowLeft size={16} /> All Farming Tools
              </button>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${activeTool.badgeColor}`}>
                  {activeTool.badge}
                </span>
                <h3 className="text-xl font-black text-white font-display">
                  {activeTool.title}
                </h3>
              </div>
            </div>

            {/* Embedded Tool Component */}
            <div className="mt-4">
              <ActiveComponent />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="tool-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-semibold uppercase tracking-wider mb-2">
                  <Sprout size={12} /> Simple Crop Assistance
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Farming <span className="text-emerald-400">Tools</span>
                </h2>
                <p className="text-text-muted mt-1 text-xs sm:text-sm max-w-xl">
                  Select a tool below to check plant health, calculate fertilizer, get weather warnings, or predict harvest.
                </p>
              </div>

              {/* Search bar */}
              <div className="relative w-full md:w-64">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-text-muted/50 focus:outline-none focus:border-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Grid of Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => setActiveToolId(tool.id)}
                    className="glass-card p-5 border border-white/10 hover:border-emerald-500/30 transition-all duration-200 cursor-pointer flex flex-col justify-between group rounded-2xl"
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center border transition-transform"
                          style={{ 
                            backgroundColor: `${tool.accent}12`, 
                            borderColor: `${tool.accent}25`,
                            color: tool.accent 
                          }}
                        >
                          <Icon size={20} />
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${tool.badgeColor}`}>
                          {tool.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-emerald-400 font-medium mt-0.5">
                          {tool.tagline}
                        </p>
                        <p className="text-xs text-text-muted mt-1.5 line-clamp-2 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3.5 mt-3.5 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-emerald-400">
                      <span>Open Tool</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FarmerTools;
