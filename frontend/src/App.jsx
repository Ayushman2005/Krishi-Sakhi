import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FarmerProvider, useFarmer } from './context/FarmerContext';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import MLHub from './components/MLHub';
import MarketInsights from './components/MarketInsights';
import SchemesLocator from './components/SchemesLocator';
import EnhancedBackground from './components/EnhancedBackground';
import FloatingStats from './components/FloatingStats';

import { Sprout, Settings, Bell, ShieldCheck, ArrowUpRight, LayoutDashboard, Cpu, LogOut, TrendingUp, X, User, Landmark, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'dashboard', icon: LayoutDashboard },
  { id: 'ml', label: 'ai_models', icon: Cpu },
  { id: 'market', label: 'market_rates', icon: TrendingUp },
  { id: 'schemes', label: 'schemes', icon: Landmark },
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'मराठी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'or', name: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'অসমীয়া' },
  { code: 'ur', name: 'اردو' },
  { code: 'ks', name: 'کٲشُر' },
  { code: 'ne', name: 'नेपाली' },
  { code: 'sa', name: 'संस्कृतम्' },
  { code: 'kok', name: 'कोंकणी' },
  { code: 'doi', name: 'डोगरी' },
  { code: 'mai', name: 'मैथिली' },
  { code: 'sat', name: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'mni', name: 'ꯃꯩꯇꯩꯂꯣꯟ' },
  { code: 'brx', name: 'बर’' },
  { code: 'sd', name: 'سنڌي' },
];

const AppContent = () => {
  const { t, i18n } = useTranslation();
  const { profile, clearProfile } = useFarmer();
  const [activePage, setActivePage] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getGlowColor = () => {
    switch (activePage) {
      case 'dashboard': return 'rgba(6, 182, 212, 0.12)';
      case 'ml': return 'rgba(139, 92, 246, 0.12)';
      case 'market': return 'rgba(245, 158, 11, 0.12)';
      case 'schemes': return 'rgba(34, 211, 238, 0.12)';
      default: return 'rgba(6, 182, 212, 0.12)';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
      <EnhancedBackground />

      {/* Premium Ambient Interactive Cursor Glow */}
      <motion.div
        className="pointer-events-none fixed -left-32 -top-32 w-72 h-72 rounded-full filter blur-[90px] z-0 hidden lg:block transition-colors duration-500"
        style={{ backgroundColor: getGlowColor() }}
        animate={{
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{
          type: 'spring',
          damping: 35,
          stiffness: 220,
          mass: 0.5
        }}
      />

      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full flex justify-center z-50 sticky top-6 px-4 pointer-events-none"
      >
        <nav className="w-full max-w-6xl flex justify-between items-center px-6 py-3 pointer-events-auto rounded-full shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.1)] border border-cyan-500/20 bg-[#030712]/80 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
          {/* Active-page accent line at bottom of nav */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-px"
            animate={{
              background: activePage === 'dashboard'
                ? 'linear-gradient(90deg, transparent, rgba(6,182,212,0.8), transparent)'
                : activePage === 'ml'
                ? 'linear-gradient(90deg, transparent, rgba(139,92,246,0.8), transparent)'
                : activePage === 'market'
                ? 'linear-gradient(90deg, transparent, rgba(245,158,11,0.8), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(34,211,238,0.8), transparent)'
            }}
            transition={{ duration: 0.5 }}
          />

          <div className="flex items-center gap-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 cursor-pointer pl-2"
              onClick={() => setActivePage('dashboard')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-cyan-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Sprout size={20} className="relative z-10" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-black tracking-tight leading-none text-white font-[var(--font-display)]">{t('app_name')}</span>
              </div>
            </motion.div>

            {profile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="hidden md:flex items-center gap-1 ml-6 bg-white/5 rounded-full p-1 border border-white/5 relative"
              >
                {NAV_ITEMS.map(item => (
                  <motion.button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors duration-300 z-10 ${
                      activePage === item.id
                        ? 'text-white'
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    {activePage === item.id && (
                      <motion.div
                        layoutId="desktop-active-nav"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.55)] -z-10"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <item.icon size={16} className={activePage === item.id ? 'text-white' : ''} />
                    {t(item.label)}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>

          {profile ? (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3 pr-1">

              <div className="relative flex items-center" ref={notificationRef}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2.5 rounded-full transition-all duration-300 border ${showNotifications ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-text-muted hover:bg-white/10 border-transparent hover:text-white hover:scale-105'}`} 
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#030712] animate-pulse"></span>
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-4 w-80 glass p-4 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] z-[100] border border-cyan-500/30 bg-[#030712]/95 origin-top-right"
                    >
                      <h3 className="text-sm font-black mb-3 px-2 flex items-center justify-between font-[var(--font-display)]">
                        Telemetry Alerts
                        <span className="text-[9px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">2 New</span>
                      </h3>
                      <div className="space-y-2">
                        <div className="p-3 bg-white/5 hover:bg-cyan-500/10 transition-colors rounded-2xl cursor-pointer border border-transparent hover:border-cyan-500/20">
                          <p className="text-xs font-bold text-rose-400 mb-1">Weather Alert</p>
                          <p className="text-[11px] text-text-muted leading-tight">Heavy unseasonal rain expected tomorrow in your district. Delay fertilizer application.</p>
                        </div>
                        <div className="p-3 bg-white/5 hover:bg-cyan-500/10 transition-colors rounded-2xl cursor-pointer border border-transparent hover:border-cyan-500/20">
                          <p className="text-xs font-bold text-cyan-400 mb-1">Market Pulse</p>
                          <p className="text-[11px] text-text-muted leading-tight">Paddy rates have increased by 2.4% today in local mandis.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative flex items-center">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettings(true)}
                  className="p-2.5 bg-white/5 text-text-muted hover:bg-white/10 border border-transparent rounded-full hover:text-cyan-400 transition-all duration-300 hover:scale-105"
                  title={t('language')}
                >
                  <Languages size={18} />
                </motion.button>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSettings(true)}
                className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-cyan-950/30 rounded-full border border-cyan-500/20 hover:bg-cyan-900/40 hover:border-cyan-400/40 transition-all duration-300 mr-2 text-left group shadow-[0_0_15px_rgba(6,182,212,0.1)]"
              >
                <div>
                  <p className="text-xs font-black leading-none group-hover:text-cyan-400 transition-colors font-[var(--font-display)]">{profile.name}</p>
                  <p className="text-[9px] text-cyan-400/70 group-hover:text-cyan-300 font-bold uppercase tracking-widest transition-colors">{profile.crop}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.4)] flex items-center justify-center text-white font-black text-xs border border-cyan-300/40">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              </motion.button>

              {clearProfile && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearProfile}
                  className="p-2.5 bg-rose-500/10 rounded-full hover:bg-rose-500/20 transition-colors border border-rose-500/20 ml-1 hover:scale-105"
                  title="Reset Profile"
                  aria-label="Log out"
                >
                  <LogOut size={16} className="text-rose-400" />
                </motion.button>
              )}
            </motion.div>
          ) : (
            <div className="flex gap-3 items-center pr-2">
              <span className="px-4 py-1.5 bg-cyan-500/10 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] border border-cyan-500/30 flex items-center gap-2 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <ShieldCheck size={12} /> v2.0 Cyber HUD
              </span>
            </div>
          )}
        </nav>
      </motion.div>

      <AnimatePresence>
        {profile && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="md:hidden fixed bottom-6 left-6 right-6 z-50 pointer-events-none flex justify-center"
          >
            <div className="w-full max-w-md flex justify-between items-center p-2 pointer-events-auto rounded-[2rem] shadow-[0_25px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(6,182,212,0.15)] border border-cyan-500/20 bg-[#030712]/90 backdrop-blur-3xl relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
              {NAV_ITEMS.map(item => (
                <motion.button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-[1.25rem] transition-colors duration-300 z-10 ${
                    activePage === item.id
                      ? 'text-cyan-400'
                      : 'text-text-muted hover:text-white'
                  }`}
                >
                  {activePage === item.id && (
                    <motion.div
                      layoutId="mobile-active-nav"
                      className="absolute inset-0 bg-cyan-500/20 border border-cyan-400/40 rounded-[1.25rem] -z-10 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <item.icon size={20} className={`transition-transform duration-300 ${activePage === item.id ? 'scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]' : ''}`} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{t(item.label)}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {!profile ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 24, scale: 0.97, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, scale: 0.97, filter: 'blur(6px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProfileForm />
            </motion.div>
          ) : activePage === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 24, scale: 0.97, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, scale: 0.97, filter: 'blur(6px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Dashboard />
              <ChatInterface />
              <FloatingStats />
            </motion.div>
          ) : activePage === 'market' ? (
            <motion.div
              key="market"
              initial={{ opacity: 0, y: 24, scale: 0.97, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, scale: 0.97, filter: 'blur(6px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <MarketInsights />
              <ChatInterface />
            </motion.div>
          ) : activePage === 'schemes' ? (
            <motion.div
              key="schemes"
              initial={{ opacity: 0, y: 24, scale: 0.97, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, scale: 0.97, filter: 'blur(6px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <SchemesLocator />
              <ChatInterface />
            </motion.div>
          ) : (
            <motion.div
              key="ml"
              initial={{ opacity: 0, y: 24, scale: 0.97, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, scale: 0.97, filter: 'blur(6px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <MLHub />
              <ChatInterface />
            </motion.div>
          )}
        </AnimatePresence>
      </main>


      <AnimatePresence>
        {showSettings && profile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass p-8 md:p-12 max-w-lg w-full relative z-10 shadow-[0_50px_100px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.15)] border-cyan-500/30 bg-[#030712]/95"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black flex items-center gap-3 font-[var(--font-display)]">
                  <Settings className="text-cyan-400" size={28} /> {t('preferences')}
                </h2>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-5 bg-white/5 rounded-3xl border border-cyan-500/15 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Languages className="text-cyan-400" size={20} />
                    <h3 className="font-black text-sm uppercase tracking-widest text-cyan-300 font-[var(--font-display)]">{t('language')}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => i18n.changeLanguage(lang.code)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          i18n.language === lang.code
                            ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                            : 'bg-white/5 border-white/10 text-text-muted hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-white'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-cyan-950/20 rounded-3xl border border-cyan-500/20 flex items-center gap-5">
                  <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 font-black text-2xl border-2 border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-xl font-[var(--font-display)]">{profile.name}</h3>
                    <p className="text-sm text-text-muted">{profile.location || 'Location Not Set'}</p>
                    <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest mt-1">{profile.crop} Agri-Node</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/60 font-[var(--font-display)]">Account Management</p>
                  <button className="w-full btn btn-secondary py-4 justify-start bg-white/5 border-cyan-500/10 hover:bg-cyan-500/10 hover:border-cyan-500/30">
                    <User size={16} className="text-cyan-400" /> Edit Farm Details
                  </button>
                  <button className="w-full btn btn-secondary py-4 justify-start bg-white/5 border-cyan-500/10 hover:bg-cyan-500/10 hover:border-cyan-500/30">
                    <ShieldCheck size={16} className="text-cyan-400" /> Privacy & Data
                  </button>
                  <button 
                    onClick={() => { clearProfile(); setShowSettings(false); }}
                    className="w-full btn py-4 justify-start bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                  >
                    <LogOut size={16} /> {t('reset_profile')} (Clear Data)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="w-full flex justify-center border-t border-cyan-500/15 mt-20 relative overflow-hidden bg-black/40">
        <div className="w-full max-w-[1300px] p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left mb-12">
            <div className="space-y-4">
              <h4 className="font-black text-xl font-[var(--font-display)]">Krishi Sakhi</h4>
              <p className="text-sm text-text-muted leading-relaxed">Empowering farmers worldwide with AI-powered intelligence and local wisdom.</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_10px_rgba(6,182,212,0.2)]">v2.0 Cyber HUD</span>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-cyan-400 font-[var(--font-display)]">Resources</h4>
              <ul className="text-sm text-text-muted space-y-3">
                <li className="hover:text-cyan-300 cursor-pointer transition-colors flex items-center gap-2"><ArrowUpRight size={12} className="text-cyan-400" /> Crop Calendar</li>
                <li className="hover:text-cyan-300 cursor-pointer transition-colors flex items-center gap-2"><ArrowUpRight size={12} className="text-cyan-400" /> Market Rates</li>
                <li className="hover:text-cyan-300 cursor-pointer transition-colors flex items-center gap-2"><ArrowUpRight size={12} className="text-cyan-400" /> Government Schemes</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-cyan-400 font-[var(--font-display)]">Support</h4>
              <ul className="text-sm text-text-muted space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors">Contact Expert</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Feedback</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 space-y-6">
            {/* Marquee ticker */}
            <div className="marquee-wrap text-[9px] font-black uppercase tracking-[0.3em] text-text-muted/20 py-2 border-y border-white/5">
              <div className="marquee-track gap-16 px-8">
                {[
                  '🌱 Crop Recommendation', '🔬 Disease Detection', '🌦 Weather Advisory',
                  '💰 Market Intelligence', '🪲 Pest Forecasting', '🌿 Carbon Ledger',
                  '🧪 Fertilizer Guide', '📈 Yield Prediction', '🎵 Acoustic Monitor',
                  '🗺 Polyculture Solver', '🌱 Crop Recommendation', '🔬 Disease Detection',
                  '🌦 Weather Advisory', '💰 Market Intelligence', '🪲 Pest Forecasting',
                  '🌿 Carbon Ledger', '🧪 Fertilizer Guide', '📈 Yield Prediction',
                  '🎵 Acoustic Monitor', '🗺 Polyculture Solver',
                ].map((item, i) => (
                  <span key={i} className="whitespace-nowrap pr-16">{item}</span>
                ))}
              </div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-xs text-text-muted/30 font-black uppercase tracking-[0.4em] text-center"
            >
              © 2026 Krishi Sakhi AI • Empowering Agriculture Worldwide
            </motion.p>
          </div>
        </div>
      </footer>
    </div>
  );
};


function App() {
  return (
    <FarmerProvider>
      <AppContent />
    </FarmerProvider>
  );
}

export default App;
