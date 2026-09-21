import { useState, useEffect, useRef, useCallback } from 'react';
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

/* ─── Animated count-up hook ─── */
function useCountUp(target, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const numeric = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    if (isNaN(numeric)) { setValue(target); return; }

    let start = null;
    const delayTimer = setTimeout(() => {
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        setValue(Math.floor(eased * numeric));
        if (progress < 1) raf.current = requestAnimationFrame(step);
        else setValue(numeric);
      };
      raf.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration, delay]);

  return value;
}


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

    fetchData();

  }, [profile, activities]);

  const handleLogActivity = (e) => {
    e.preventDefault();
    const note = e.target.note.value;
    if (!note.trim()) return; 

    addActivity({ type: logType, note });
    setShowLogModal(false);

    setToast(`Successfully logged ${logType.replace('-', ' ')} activity`);
    setTimeout(() => setToast(null), 3000);
  };

  const calculateHealth = () => {
    const baseHealth = 70;
    const bonus = Math.min(activities.length * 2, 28);
    return baseHealth + bonus;
  };

  const healthScore = calculateHealth();
  const animatedHealth = useCountUp(healthScore, 1400, 400);
  const healthLabel = healthScore > 90 ? 'Excellent' : healthScore > 80 ? 'Good' : 'Needs Care';
  const healthColor = healthScore > 90 ? 'text-success' : healthScore > 80 ? 'text-primary' : 'text-warning';

  /* Animated weather icon based on condition */
  const getWeatherIconMotion = () => {
    if (!weatherData || weatherData.error) return {};
    const main = weatherData.weather?.[0]?.main;
    if (main === 'Rain' || main === 'Drizzle') return { animate: { y: [0, 4, 0] }, transition: { duration: 1.2, repeat: Infinity } };
    if (main === 'Clear') return { animate: { rotate: [0, 360] }, transition: { duration: 8, repeat: Infinity, ease: 'linear' } };
    return { animate: { x: [0, 6, 0] }, transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } };
  };

  const getWeatherGradient = () => {
    if (!weatherData || weatherData.error) {
      return 'from-primary/10 via-background to-transparent border-primary/20';
    }
    const main = weatherData.weather?.[0]?.main;
    if (main === 'Rain' || main === 'Drizzle' || main === 'Thunderstorm') {
      return 'from-blue-500/10 via-[#0a0f1d] to-[#020617] border-blue-500/20';
    }
    if (main === 'Clear') {
      return 'from-amber-500/10 via-[#130d06] to-[#020617] border-amber-500/20';
    }
    return 'from-sky-500/10 via-[#0a121e] to-[#020617] border-sky-500/20';
  };

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
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
        <div className="z-10">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-3"
          >
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400/90 font-[var(--font-display)]">Agri-Telemetry Cyber Node</span>
          </motion.div>
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-7xl font-black mb-4 tracking-tighter leading-none font-[var(--font-display)]"
          >
            {t('welcome')}, <span className="gradient-text">{profile?.name || 'Commander'}</span>
          </motion.h1>
          <div className="flex flex-wrap items-center gap-3">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 bg-cyan-950/30 px-4 py-2 rounded-2xl border border-cyan-500/20 backdrop-blur-md text-xs font-bold text-cyan-200"
            >
              <Calendar size={14} className="text-cyan-400" /> {format(new Date(), 'EEEE, MMM d')}
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 bg-cyan-950/30 px-4 py-2 rounded-2xl border border-cyan-500/20 backdrop-blur-md text-xs font-bold text-cyan-200"
            >
              <Sprout size={14} className="text-cyan-400" /> {profile?.crop || 'Mixed'} Crop System
            </motion.span>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <motion.button 
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchData}
            className="btn btn-secondary w-14 h-14 rounded-2xl flex items-center justify-center p-0 border-cyan-500/20 text-cyan-300"
            title="Refresh Data"
          >
            <RefreshCw size={22} className={isLoading ? 'animate-spin' : ''} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(6,182,212,0.6)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLogModal(true)}
            className="btn btn-primary px-10 h-14 text-lg rounded-2xl font-black shadow-xl shadow-cyan-500/25 font-[var(--font-display)]"
          >
            <Plus size={24} /> {t('log_activity')}
          </motion.button>
        </div>
      </header>

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: t('health_index'), value: healthLabel, icon: null, color: 'text-cyan-400', sub: `${healthScore}/100`, isHealth: true, glowColor: 'rgba(6,182,212,0.3)' },
          { label: t('soil_health'), value: profile?.soilType === 'Alluvial' ? 'Optimum' : 'Balanced', icon: LayoutGrid, color: 'text-cyan-400', sub: 'pH 6.5', glowColor: 'rgba(6,182,212,0.3)' },
          { label: t('daily_water'), value: 'Optimal', icon: Droplets, color: 'text-cyan-300', sub: profile?.irrigation === 'Drip' ? 'Efficient Use' : 'Standard', glowColor: 'rgba(34,211,238,0.3)' },
          { label: t('pest_risk'), value: 'Low', icon: Bug, color: 'text-amber-400', sub: 'No Outbreaks', glowColor: 'rgba(245,158,11,0.3)' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{
              y: -10,
              scale: 1.02,
              boxShadow: `0 25px 50px -12px rgba(0,0,0,0.8), 0 0 30px -5px ${stat.glowColor}`,
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
            }}
            className="glass-card spotlight-card neon-border flex flex-col p-6 border border-cyan-500/20 transition-all duration-300 cursor-default relative group"
          >
            <div className="flex justify-between items-start mb-6">
              {stat.isHealth ? (
                <div className="relative flex items-center justify-center w-14 h-14 bg-cyan-950/40 rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.15)] border border-cyan-500/30 select-none z-10">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle cx="24" cy="24" r="16" className="text-white/5 stroke-current" strokeWidth="3" fill="transparent" />
                    <circle
                      cx="24" cy="24" r="16"
                      className="text-cyan-400 stroke-current transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={((100 - animatedHealth) / 100) * (2 * Math.PI * 16)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <motion.span
                    key={animatedHealth}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute text-[11px] font-black text-cyan-200 font-[var(--font-mono)]"
                  >
                    {animatedHealth}
                  </motion.span>
                </div>
              ) : (
                <div className={`p-4 bg-cyan-950/40 rounded-2xl ${stat.color} border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] z-10 relative`}>
                  <stat.icon size={26} />
                  {/* Subtle glow behind icon */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
                    style={{ backgroundColor: stat.glowColor }}
                  />
                </div>
              )}
              <div className="text-right z-10">
                <span className="text-[10px] font-black opacity-40 uppercase tracking-widest block mb-1 font-[var(--font-display)]">{stat.label}</span>
                <span className="text-xs font-black text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)] font-[var(--font-mono)]">{stat.sub}</span>
              </div>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="text-3xl font-black tracking-tighter z-10 text-white font-[var(--font-display)]"
            >
              {stat.value}
            </motion.p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4 font-[var(--font-display)]">
              <span className="w-3 h-3 bg-cyan-400 rounded-full pulse-primary" />
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
                advisories.map((adv, idx) => (
                  <motion.div
                    key={adv.id}
                    variants={itemVariants}
                    layoutId={adv.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07, type: 'spring', stiffness: 100 }}
                    className={`glass-card group relative overflow-hidden border border-cyan-500/15 ${
                      adv.priority === 'high' ? 'glass-card-warning' : ''
                    }`}
                  >
                    {/* Animated left accent border for high-priority */}
                    {adv.priority === 'high' ? (
                      <motion.div
                        animate={{ opacity: [0.6, 1, 0.6], scaleY: [0.9, 1, 0.9] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute left-0 top-4 bottom-4 w-1 bg-amber-400 rounded-r-full shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                      />
                    ) : (
                      <div className="absolute left-0 top-4 bottom-4 w-1 bg-cyan-500/40 rounded-r-full" />
                    )}
                    <div className="flex gap-6">
                      <div className="p-5 bg-cyan-950/40 border border-cyan-500/20 rounded-3xl group-hover:bg-cyan-500/20 group-hover:border-cyan-400/40 group-hover:scale-110 transition-all duration-300 shadow-inner shrink-0 text-cyan-400">
                        {getIcon(adv.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-black leading-tight font-[var(--font-display)] text-white">{adv.title}</h3>
                          {adv.priority === 'high' && (
                            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase rounded-lg border border-amber-500/30 animate-pulse font-[var(--font-display)]">Action Required</span>
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
              <h2 className="text-3xl font-black flex items-center gap-4 font-[var(--font-display)]">
                <span className="w-3 h-3 bg-violet-400 rounded-full" />
                {t('farm_timeline')}
              </h2>
              <span className="text-xs font-bold text-cyan-400/80 uppercase tracking-widest font-[var(--font-mono)]">{activities.length} Events Logged</span>
            </div>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="glass-card text-center py-20 text-text-muted flex flex-col items-center">
                  <Plus size={48} className="mb-4 opacity-10" />
                  <p className="italic font-medium">Your telemetry log is empty. Start by recording your first field event!</p>
                </div>
              ) : (
                activities.map((act) => (
                  <motion.div 
                    key={act.id}
                    variants={itemVariants}
                    layout
                    className="glass-card flex justify-between items-center hover:bg-cyan-950/20 border-l-4 border-l-cyan-400/50"
                  >
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400 shadow-lg">
                        {act.type === 'irrigation' ? <Droplets size={22} /> : 
                         act.type === 'pest-control' ? <Bug size={22} /> : 
                         act.type === 'harvest' ? <CheckCircle2 size={22} /> : <Sprout size={22} />}
                      </div>
                      <div>
                        <p className="font-black text-lg tracking-tight capitalize font-[var(--font-display)] text-white">{act.type.replace('-', ' ')}</p>
                        <p className="text-text-muted text-sm italic opacity-80">"{act.note}"</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-cyan-400 mb-1 flex items-center gap-1 justify-end uppercase tracking-widest font-[var(--font-display)]">
                        <CheckCircle2 size={12} /> Verified Telemetry
                      </p>
                      <p className="text-xs text-text-muted font-bold font-[var(--font-mono)]">
                        {format(new Date(act.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <motion.div variants={itemVariants} className="glass p-10 relative overflow-hidden group border border-cyan-500/20">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-cyan-500/20 transition-colors" />
            <h3 className="text-2xl font-black mb-8 flex items-center gap-4 font-[var(--font-display)]">
              <CalendarCheck className="text-cyan-400" /> {t('upcoming_tasks')}
            </h3>
            <div className="space-y-4">
              {[
                { date: addDays(new Date(), 1), task: 'Apply NPK Fertilizer', type: 'critical' },
                { date: addDays(new Date(), 3), task: 'Check Irrigation Lines', type: 'routine' },
                { date: addDays(new Date(), 5), task: 'Pesticide Spray (Preventive)', type: 'routine' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-cyan-500/15 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all cursor-pointer">
                  <div className="flex flex-col items-center justify-center min-w-[50px] border-r border-white/10 pr-4">
                    <span className="text-[10px] uppercase font-black text-text-muted font-[var(--font-mono)]">{format(item.date, 'MMM')}</span>
                    <span className="text-xl font-black text-white font-[var(--font-mono)]">{format(item.date, 'dd')}</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="font-bold text-sm text-white">{item.task}</p>
                    <p className={`text-[9px] uppercase font-black tracking-widest mt-1 font-[var(--font-display)] ${item.type === 'critical' ? 'text-amber-400' : 'text-cyan-400'}`}>
                      {item.type}
                    </p>
                  </div>
                  <button className="text-text-muted hover:text-cyan-400 self-center">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 transition-all text-xs font-black uppercase tracking-[0.2em] border border-cyan-500/30 text-cyan-300 flex items-center justify-center gap-2 font-[var(--font-display)]">
              <Plus size={14} /> Add Task
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className={`glass p-10 bg-gradient-to-br ${getWeatherGradient()} relative transition-all duration-700 border border-cyan-500/20`}>
            <div className="absolute top-4 right-4 animate-spin-slow">
              <Sun className="text-cyan-400 opacity-20" size={80} />
            </div>
            <h3 className="text-2xl font-black mb-8 relative z-10 flex items-center justify-between font-[var(--font-display)]">
              {t('regional_climate')}
              {(!weatherData || weatherData.error) && <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-1 rounded-full border border-rose-500/20 ml-2">{weatherData?.error || "Loading..."}</span>}
            </h3>
            <div className="flex items-center gap-10 mb-8 relative z-10">
              <div className="p-5 bg-cyan-950/40 border border-cyan-500/30 rounded-[32px] shadow-[0_0_20px_rgba(6,182,212,0.2)] animate-float">
                {!weatherData || weatherData.error ? (
                  <CloudRain size={72} className="text-text-muted opacity-50" />
                ) : weatherData.weather?.[0]?.main === 'Rain' || weatherData.weather?.[0]?.main === 'Drizzle' || weatherData.weather?.[0]?.main === 'Thunderstorm' ? (
                  <CloudRain size={72} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
                ) : weatherData.weather?.[0]?.main === 'Clear' ? (
                  <Sun size={72} className="text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
                ) : (
                  <Wind size={72} className="text-cyan-300" />
                )}
              </div>
              <div>
                <p className="text-6xl font-black tracking-tighter text-white font-[var(--font-mono)]">{weatherData && !weatherData.error ? Math.round(weatherData.main.temp) : 28}°C</p>
                <p className="text-text-muted font-bold text-xl tracking-tight capitalize">{weatherData && !weatherData.error ? weatherData.weather[0].description : 'Showers expected'}</p>
                {weatherData && !weatherData.error && <p className="text-xs text-cyan-400 font-bold tracking-widest uppercase mt-1 font-[var(--font-display)]">{weatherData.name}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-cyan-500/15">
                <p className="text-[10px] text-cyan-400/70 uppercase font-black tracking-widest mb-1 font-[var(--font-display)]">{t('humidity')}</p>
                <p className="font-black text-xl text-white font-[var(--font-mono)]">{weatherData && !weatherData.error ? weatherData.main.humidity : 84}%</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-cyan-500/15">
                <p className="text-[10px] text-cyan-400/70 uppercase font-black tracking-widest mb-1 font-[var(--font-display)]">{t('wind')}</p>
                <p className="font-black text-xl text-white font-[var(--font-mono)]">{weatherData && !weatherData.error ? weatherData.wind.speed : 12} <span className="text-sm font-bold text-text-muted">m/s</span></p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogModal(false)}
              className="absolute inset-0 bg-[#02040a]/90 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="glass p-12 max-w-xl w-full relative z-10 shadow-[0_50px_100px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.15)] border-cyan-500/30 bg-[#030712]/95"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black tracking-tighter font-[var(--font-display)] text-white">Record Field Telemetry</h2>
                <button onClick={() => setShowLogModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleLogActivity} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 font-[var(--font-display)]">Select Event Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['irrigation', 'sowing', 'fertilizer', 'pest-control', 'harvest'].map(type => (
                      <button 
                        key={type}
                        type="button"
                        onClick={() => setLogType(type)}
                        className={`px-4 py-4 rounded-2xl border-2 font-bold text-sm transition-all capitalize font-[var(--font-display)] ${
                          logType === type ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white/5 border-cyan-500/10 text-text-muted hover:border-cyan-500/30 hover:text-white'
                        }`}
                      >
                        {type.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 font-[var(--font-display)]">Telemetry Observation Details</label>
                  <textarea 
                    name="note" 
                    placeholder="Input field telemetry observations or chemical dosages..." 
                    required
                    className="min-h-[140px] text-lg py-5 px-6 bg-white/5 border-cyan-500/20 rounded-3xl focus:border-cyan-400 transition-all text-white"
                  ></textarea>
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowLogModal(false)} className="btn btn-secondary flex-1 py-5 text-lg font-black rounded-3xl">Abort</button>
                  <button type="submit" className="btn btn-primary flex-1 py-5 text-lg font-black rounded-3xl shadow-xl shadow-cyan-500/30">Commit Telemetry</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

const ShieldCheck = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" />
  </svg>
);

export default Dashboard;
