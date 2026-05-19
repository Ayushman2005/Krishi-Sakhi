import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFarmer } from '../context/FarmerContext';
import { generateAdvisory, getWeather } from '../utils/KnowledgeEngine';
import { 
  CloudRain, Sprout, Bug, Droplets, 
  Plus, Calendar, AlertCircle,
  CheckCircle2, Sun, Wind,
  AlertTriangle, RefreshCw, LayoutGrid, CalendarCheck, MoreHorizontal
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  const { profile, activities, addActivity } = useFarmer();
  const [advisories, setAdvisories] = useState([]);

  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logType, setLogType] = useState('irrigation');
  const [toast, setToast] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (profile) {
        const [adv, weather] = await Promise.all([
          generateAdvisory(profile),
          getWeather(profile.location || 'Global', profile.lat || null, profile.lon || null)
        ]);
        setAdvisories(adv);
        setWeatherData(weather);
      }
    } catch {
      setError("Unable to sync with farm data server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, activities]);

  const handleLogActivity = (e) => {
    e.preventDefault();
    const note = e.target.note.value;
    if (!note.trim()) return; // Prevent empty logs
    
    addActivity({ type: logType, note });
    setShowLogModal(false);
    
    // Show Toast
    setToast(`Successfully logged ${logType.replace('-', ' ')} activity`);
    setTimeout(() => setToast(null), 3000);
  };

  // Dynamic Health Calculations
  const calculateHealth = () => {
    const baseHealth = 70;
    const bonus = Math.min(activities.length * 2, 28);
    return baseHealth + bonus;
  };
  
  const healthScore = calculateHealth();
  const healthLabel = healthScore > 90 ? 'Excellent' : healthScore > 80 ? 'Good' : 'Needs Care';
  const healthColor = healthScore > 90 ? 'text-success' : healthScore > 80 ? 'text-primary' : 'text-warning';

  const getIcon = (iconName) => {
    const icons = { CloudRain, Sprout, Bug, Droplets, AlertCircle };
    const Icon = icons[iconName] || AlertCircle;
    return <Icon className="text-primary group-hover:scale-110 transition-transform" size={28} />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="main-container"
    >
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
        <div className="z-10">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-3"
          >
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Farm Central Intelligence</span>
          </motion.div>
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-7xl font-black mb-4 tracking-tighter leading-none"
          >
            {t('welcome')}, <span className="gradient-text">{profile?.name || 'Farmer'}</span>
          </motion.h1>
          <div className="flex flex-wrap items-center gap-3">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md text-xs font-bold"
            >
              <Calendar size={14} className="text-primary" /> {format(new Date(), 'EEEE, MMM d')}
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md text-xs font-bold"
            >
              <Sprout size={14} className="text-primary" /> {profile?.crop || 'Mixed'} Crop System
            </motion.span>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <motion.button 
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchData}
            className="btn btn-secondary w-14 h-14 rounded-2xl flex items-center justify-center p-0"
            title="Refresh Data"
          >
            <RefreshCw size={22} className={isLoading ? 'animate-spin' : ''} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px var(--primary-glow)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLogModal(true)}
            className="btn btn-primary px-10 h-14 text-lg rounded-2xl font-black shadow-xl shadow-primary/20"
          >
            <Plus size={24} /> {t('log_activity')}
          </motion.button>
        </div>
      </header>

      {/* Error State */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-error/10 border border-error/20 p-4 rounded-2xl flex items-center gap-4 text-error font-bold"
        >
          <AlertTriangle size={24} />
          <p>{error}</p>
          <button onClick={fetchData} className="ml-auto underline">Retry</button>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: t('health_index'), value: healthLabel, icon: ShieldCheck, color: healthColor, sub: `${healthScore}/100` },
          { label: t('soil_health'), value: profile?.soilType === 'Alluvial' ? 'Optimum' : 'Balanced', icon: LayoutGrid, color: 'text-primary', sub: 'pH 6.5' },
          { label: t('daily_water'), value: 'Optimal', icon: Droplets, color: 'text-primary', sub: profile?.irrigation === 'Drip' ? 'Efficient Use' : 'Standard' },
          { label: t('pest_risk'), value: 'Low', icon: Bug, color: 'text-warning', sub: 'No outbreaks' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants} 
            whileHover={{ 
              y: -10, 
              scale: 1.02,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'rgba(16, 185, 129, 0.3)'
            }}
            className="glass-card flex flex-col p-6 border-2 border-transparent transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 bg-white/5 rounded-2xl ${stat.color} shadow-inner`}>
                <stat.icon size={28} />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black opacity-30 uppercase tracking-widest block mb-1">{stat.label}</span>
                <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">{stat.sub}</span>
              </div>
            </div>
            <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Advisories Column */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <span className="w-3 h-3 bg-primary rounded-full pulse-primary" />
              {t('personalized_guidance')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="glass-card h-[160px] skeleton opacity-50" />
                ))
              ) : advisories.length === 0 ? (
                <div className="md:col-span-2 glass-card py-16 text-center text-text-muted italic">
                  <AlertCircle size={48} className="mx-auto mb-4 opacity-20" />
                  No urgent advisories for your profile today.
                </div>
              ) : (
                advisories.map((adv) => (
                  <motion.div 
                    key={adv.id}
                    variants={itemVariants}
                    layoutId={adv.id}
                    className={`glass-card group relative ${
                      adv.priority === 'high' ? 'glass-card-warning' : ''
                    }`}
                  >
                    <div className="flex gap-6">
                      <div className="p-5 bg-white/5 rounded-3xl group-hover:bg-primary/10 transition-colors shadow-inner">
                        {getIcon(adv.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-black leading-tight">{adv.title}</h3>
                          {adv.priority === 'high' && (
                            <span className="px-3 py-1 bg-warning/20 text-warning text-[9px] font-black uppercase rounded-lg border border-warning/30">Action Required</span>
                          )}
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed">{adv.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black flex items-center gap-4">
                <span className="w-3 h-3 bg-accent rounded-full" />
                {t('farm_timeline')}
              </h2>
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{activities.length} Events Total</span>
            </div>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="glass-card text-center py-20 text-text-muted flex flex-col items-center">
                  <Plus size={48} className="mb-4 opacity-10" />
                  <p className="italic font-medium">Your activity feed is empty. Start by logging your first task!</p>
                </div>
              ) : (
                activities.map((act) => (
                  <motion.div 
                    key={act.id}
                    variants={itemVariants}
                    layout
                    className="glass-card flex justify-between items-center hover:bg-white/5 border-l-4 border-l-primary/30"
                  >
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-lg">
                        {act.type === 'irrigation' ? <Droplets size={22} /> : 
                         act.type === 'pest-control' ? <Bug size={22} /> : 
                         act.type === 'harvest' ? <CheckCircle2 size={22} /> : <Sprout size={22} />}
                      </div>
                      <div>
                        <p className="font-black text-lg tracking-tight capitalize">{act.type.replace('-', ' ')}</p>
                        <p className="text-text-muted text-sm italic opacity-80">"{act.note}"</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-primary/80 mb-1 flex items-center gap-1 justify-end uppercase tracking-widest">
                        <CheckCircle2 size={12} /> Verified Entry
                      </p>
                      <p className="text-xs text-text-muted font-bold">
                        {format(new Date(act.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-10">
          <motion.div variants={itemVariants} className="glass p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-primary/10 transition-colors" />
            <h3 className="text-2xl font-black mb-8 flex items-center gap-4">
              <CalendarCheck className="text-primary" /> {t('upcoming_tasks')}
            </h3>
            <div className="space-y-4">
              {[
                { date: addDays(new Date(), 1), task: 'Apply NPK Fertilizer', type: 'critical' },
                { date: addDays(new Date(), 3), task: 'Check Irrigation Lines', type: 'routine' },
                { date: addDays(new Date(), 5), task: 'Pesticide Spray (Preventive)', type: 'routine' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex flex-col items-center justify-center min-w-[50px] border-r border-white/10 pr-4">
                    <span className="text-[10px] uppercase font-black text-text-muted">{format(item.date, 'MMM')}</span>
                    <span className="text-xl font-black">{format(item.date, 'dd')}</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="font-bold text-sm">{item.task}</p>
                    <p className={`text-[9px] uppercase font-black tracking-widest mt-1 ${item.type === 'critical' ? 'text-warning' : 'text-primary'}`}>
                      {item.type}
                    </p>
                  </div>
                  <button className="text-text-muted hover:text-white self-center">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-xs font-black uppercase tracking-[0.2em] border border-white/5 flex items-center justify-center gap-2">
              <Plus size={14} /> Add Task
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="glass p-10 bg-gradient-to-br from-primary/10 via-background to-transparent border-primary/20 relative">
            <div className="absolute top-4 right-4 animate-spin-slow">
              <Sun className="text-secondary opacity-20" size={80} />
            </div>
            <h3 className="text-2xl font-black mb-8 relative z-10 flex items-center justify-between">
              {t('regional_climate')}
              {(!weatherData || weatherData.error) && <span className="text-[10px] bg-error/10 text-error px-2 py-1 rounded-full border border-error/20 ml-2">{weatherData?.error || "Loading..."}</span>}
            </h3>
            <div className="flex items-center gap-10 mb-8 relative z-10">
              <div className="p-5 bg-white/10 rounded-[32px] shadow-2xl animate-float">
                {!weatherData || weatherData.error ? (
                  <CloudRain size={72} className="text-text-muted opacity-50" />
                ) : weatherData.weather?.[0]?.main === 'Rain' || weatherData.weather?.[0]?.main === 'Drizzle' || weatherData.weather?.[0]?.main === 'Thunderstorm' ? (
                  <CloudRain size={72} className="text-primary" />
                ) : weatherData.weather?.[0]?.main === 'Clear' ? (
                  <Sun size={72} className="text-secondary" />
                ) : (
                  <Wind size={72} className="text-text-muted" />
                )}
              </div>
              <div>
                <p className="text-6xl font-black tracking-tighter">{weatherData && !weatherData.error ? Math.round(weatherData.main.temp) : 28}°C</p>
                <p className="text-text-muted font-bold text-xl tracking-tight capitalize">{weatherData && !weatherData.error ? weatherData.weather[0].description : 'Showers expected'}</p>
                {weatherData && !weatherData.error && <p className="text-xs text-primary font-bold tracking-widest uppercase mt-1">{weatherData.name}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mb-1">{t('humidity')}</p>
                <p className="font-black text-xl">{weatherData && !weatherData.error ? weatherData.main.humidity : 84}%</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mb-1">{t('wind')}</p>
                <p className="font-black text-xl">{weatherData && !weatherData.error ? weatherData.wind.speed : 12} <span className="text-sm font-bold text-text-muted">m/s</span></p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Log Activity Modal - Enhanced */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogModal(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="glass p-12 max-w-xl w-full relative z-10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-white/10"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black tracking-tighter">New Entry</h2>
                <button onClick={() => setShowLogModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <RefreshCw size={24} className="rotate-45" />
                </button>
              </div>
              <form onSubmit={handleLogActivity} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Select Activity Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['irrigation', 'sowing', 'fertilizer', 'pest-control', 'harvest'].map(type => (
                      <button 
                        key={type}
                        type="button"
                        onClick={() => setLogType(type)}
                        className={`px-4 py-4 rounded-2xl border-2 font-bold text-sm transition-all capitalize ${
                          logType === type ? 'bg-primary border-primary text-white' : 'bg-white/5 border-transparent text-text-muted hover:border-white/10'
                        }`}
                      >
                        {type.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Observation Details</label>
                  <textarea 
                    name="note" 
                    placeholder="Describe your activity or findings..." 
                    required
                    className="min-h-[140px] text-lg py-5 px-6 bg-white/5 border-white/5 rounded-3xl focus:border-primary/50 transition-all"
                  ></textarea>
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowLogModal(false)} className="btn btn-secondary flex-1 py-5 text-lg font-black rounded-3xl">Discard</button>
                  <button type="submit" className="btn btn-primary flex-1 py-5 text-lg font-black rounded-3xl shadow-xl shadow-primary/20">Finalize Entry</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-32 md:bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-success/20 border border-success/30 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 text-success font-bold shadow-[0_10px_30px_rgba(52,211,153,0.3)]"
          >
            <CheckCircle2 size={20} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Helper components for stats
const ShieldCheck = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" />
  </svg>
);

export default Dashboard;
