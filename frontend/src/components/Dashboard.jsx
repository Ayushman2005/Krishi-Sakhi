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
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 relative">
        <div className="z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Live Farm Overview</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2.5">
            {t('welcome')}, <span className="text-emerald-400">{profile?.name || 'Kisan'}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-medium text-slate-300">
              <Calendar size={13} className="text-emerald-400" /> {format(new Date(), 'EEEE, MMM d')}
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-medium text-slate-300">
              <Sprout size={13} className="text-emerald-400" /> {profile?.crop || 'Mixed'} Cultivation
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={fetchData}
            className="btn btn-secondary w-10 h-10 rounded-xl flex items-center justify-center p-0"
            title="Refresh Data"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setShowLogModal(true)}
            className="btn btn-primary px-4 h-10 text-xs sm:text-sm rounded-xl font-semibold"
          >
            <Plus size={16} /> {t('log_activity')}
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl flex items-center gap-3 text-rose-400 text-sm font-medium">
          <AlertTriangle size={18} />
          <p>{error}</p>
          <button onClick={fetchData} className="ml-auto underline text-xs">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('health_index'), value: healthLabel, icon: null, color: 'text-emerald-400', sub: `${healthScore}/100`, isHealth: true },
          { label: t('soil_health'), value: profile?.soilType === 'Alluvial' ? 'Optimum' : 'Balanced', icon: LayoutGrid, color: 'text-emerald-400', sub: 'pH 6.5' },
          { label: t('daily_water'), value: 'Optimal', icon: Droplets, color: 'text-teal-400', sub: profile?.irrigation === 'Drip' ? 'Efficient' : 'Standard' },
          { label: t('pest_risk'), value: 'Low', icon: Bug, color: 'text-amber-400', sub: 'No Outbreaks' },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass-card flex flex-col p-4 sm:p-5 border border-white/10 rounded-2xl transition-all cursor-default"
          >
            <div className="flex justify-between items-start mb-4">
              {stat.isHealth ? (
                <div className="relative flex items-center justify-center w-10 h-10 bg-emerald-500/10 rounded-xl border border-emerald-500/20 select-none">
                  <svg className="w-8 h-8 transform -rotate-90">
                    <circle cx="16" cy="16" r="12" className="text-white/10 stroke-current" strokeWidth="2.5" fill="transparent" />
                    <circle
                      cx="16" cy="16" r="12"
                      className="text-emerald-400 stroke-current transition-all duration-1000 ease-out"
                      strokeWidth="2.5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 12}
                      strokeDashoffset={((100 - animatedHealth) / 100) * (2 * Math.PI * 12)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-emerald-300 font-mono">
                    {animatedHealth}
                  </span>
                </div>
              ) : (
                <div className={`p-2.5 bg-white/5 rounded-xl ${stat.color} border border-white/10`}>
                  <stat.icon size={18} />
                </div>
              )}
              <div className="text-right">
                <span className="text-[11px] font-medium text-text-muted block">{stat.label}</span>
                <span className="text-xs font-semibold text-slate-300">{stat.sub}</span>
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-auto">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              {t('personalized_guidance')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading ? (
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="glass-card h-[130px] opacity-40 animate-pulse" />
                ))
              ) : advisories.length === 0 ? (
                <div className="md:col-span-2 glass-card py-12 text-center text-text-muted text-sm">
                  <AlertCircle size={36} className="mx-auto mb-2 opacity-30 text-emerald-400" />
                  No urgent advisories for your profile today.
                </div>
              ) : (
                advisories.map((adv) => (
                  <div
                    key={adv.id}
                    className={`glass-card p-4 rounded-2xl border transition-all ${
                      adv.priority === 'high' ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/10'
                    }`}
                  >
                    <div className="flex gap-3.5">
                      <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl shrink-0 text-emerald-400 h-fit">
                        {getIcon(adv.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="text-sm font-semibold text-white">{adv.title}</h3>
                          {adv.priority === 'high' && (
                            <span className="px-2 py-0.5 bg-amber-500/15 text-amber-400 text-[10px] font-semibold rounded-md border border-amber-500/30">Action Needed</span>
                          )}
                        </div>
                        <p className="text-text-muted text-xs leading-relaxed">{adv.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <span className="w-2 h-2 bg-slate-400 rounded-full" />
                {t('farm_timeline')}
              </h2>
              <span className="text-xs font-medium text-text-muted">{activities.length} Activities Logged</span>
            </div>
            <div className="space-y-3">
              {activities.length === 0 ? (
                <div className="glass-card text-center py-12 text-text-muted flex flex-col items-center text-sm">
                  <Plus size={36} className="mb-2 opacity-20" />
                  <p>Your farm log is empty. Record your first field activity above!</p>
                </div>
              ) : (
                activities.map((act) => (
                  <div 
                    key={act.id}
                    className="glass-card p-3.5 flex justify-between items-center border border-white/10 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 border border-white/10 rounded-lg text-emerald-400">
                        {act.type === 'irrigation' ? <Droplets size={16} /> : 
                         act.type === 'pest-control' ? <Bug size={16} /> : 
                         act.type === 'harvest' ? <CheckCircle2 size={16} /> : <Sprout size={16} />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm capitalize text-white">{act.type.replace('-', ' ')}</p>
                        <p className="text-text-muted text-xs">"{act.note}"</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-text-muted">
                        {format(new Date(act.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-5 border border-white/10 rounded-2xl relative">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-white">
              <CalendarCheck className="text-emerald-400" size={16} /> {t('upcoming_tasks')}
            </h3>
            <div className="space-y-2.5">
              {[
                { date: addDays(new Date(), 1), task: 'Apply NPK Fertilizer', type: 'critical' },
                { date: addDays(new Date(), 3), task: 'Check Irrigation Lines', type: 'routine' },
                { date: addDays(new Date(), 5), task: 'Pesticide Spray (Preventive)', type: 'routine' }
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5 items-center">
                  <div className="flex flex-col items-center justify-center min-w-[42px] border-r border-white/10 pr-2.5">
                    <span className="text-[10px] uppercase font-medium text-text-muted">{format(item.date, 'MMM')}</span>
                    <span className="text-sm font-bold text-white font-mono">{format(item.date, 'dd')}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-xs text-white">{item.task}</p>
                    <p className={`text-[10px] font-medium capitalize mt-0.5 ${item.type === 'critical' ? 'text-amber-400' : 'text-slate-400'}`}>
                      {item.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5 border border-white/10 rounded-2xl relative">
            <h3 className="text-sm font-semibold mb-4 flex items-center justify-between text-white">
              <span className="flex items-center gap-2">
                <Sun className="text-amber-400" size={16} /> {t('regional_climate')}
              </span>
              {(!weatherData || weatherData.error) && <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">{weatherData?.error || "Loading..."}</span>}
            </h3>
            <div className="flex items-center gap-5 mb-5">
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl text-emerald-400">
                {!weatherData || weatherData.error ? (
                  <CloudRain size={36} className="text-text-muted opacity-50" />
                ) : weatherData.weather?.[0]?.main === 'Rain' || weatherData.weather?.[0]?.main === 'Drizzle' || weatherData.weather?.[0]?.main === 'Thunderstorm' ? (
                  <CloudRain size={36} className="text-teal-400" />
                ) : weatherData.weather?.[0]?.main === 'Clear' ? (
                  <Sun size={36} className="text-amber-400" />
                ) : (
                  <Wind size={36} className="text-slate-300" />
                )}
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-white font-mono">{weatherData && !weatherData.error ? Math.round(weatherData.main.temp) : 28}°C</p>
                <p className="text-text-muted text-xs capitalize">{weatherData && !weatherData.error ? weatherData.weather[0].description : 'Showers expected'}</p>
                {weatherData && !weatherData.error && <p className="text-[11px] text-emerald-400 font-medium mt-0.5">{weatherData.name}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[10px] text-text-muted uppercase font-medium mb-0.5">{t('humidity')}</p>
                <p className="font-semibold text-base text-white font-mono">{weatherData && !weatherData.error ? weatherData.main.humidity : 84}%</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[10px] text-text-muted uppercase font-medium mb-0.5">{t('wind')}</p>
                <p className="font-semibold text-base text-white font-mono">{weatherData && !weatherData.error ? weatherData.wind.speed : 12} <span className="text-xs font-normal text-text-muted">m/s</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.98, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className="p-6 sm:p-7 max-w-lg w-full relative z-10 shadow-2xl border border-white/10 bg-[#0e1311] rounded-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">Record Field Activity</h2>
                <button onClick={() => setShowLogModal(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-text-muted hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleLogActivity} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Activity Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['irrigation', 'sowing', 'fertilizer', 'pest-control', 'harvest'].map(type => (
                      <button 
                        key={type}
                        type="button"
                        onClick={() => setLogType(type)}
                        className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all capitalize ${
                          logType === type ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-text-muted hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {type.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Notes & Observations</label>
                  <textarea 
                    name="note" 
                    placeholder="e.g. applied 50kg urea, watered south field..." 
                    required
                    className="min-h-[100px] text-xs py-3 px-3.5 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 transition-all text-white placeholder-text-muted/50"
                  ></textarea>
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button type="button" onClick={() => setShowLogModal(false)} className="btn btn-secondary flex-1 py-2 text-xs font-medium rounded-xl">Cancel</button>
                  <button type="submit" className="btn btn-primary flex-1 py-2 text-xs font-medium rounded-xl">Save Activity</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-[#0e1311] border border-emerald-500/30 px-4 py-2.5 rounded-full flex items-center gap-2 text-emerald-400 text-xs font-medium shadow-xl"
          >
            <CheckCircle2 size={16} />
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
