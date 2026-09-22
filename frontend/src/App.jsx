import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FarmerProvider, useFarmer } from './context/FarmerContext';
import AuthPortal from './components/AuthPortal';
import Dashboard from './components/Dashboard';
import FarmerTools from './components/FarmerTools';
import AdminPanel from './components/AdminPanel';
import MarketInsights from './components/MarketInsights';
import SchemesLocator from './components/SchemesLocator';
import ChatInterface from './components/ChatInterface';
import EnhancedBackground from './components/EnhancedBackground';

import { 
  Sprout, Settings, Bell, ShieldCheck, LayoutDashboard, 
  Cpu, LogOut, TrendingUp, X, User, Landmark, Languages,
  MapPin, CheckCircle2, ChevronRight, RefreshCw, Layers
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FARMER_NAV_ITEMS = [
  { id: 'dashboard', label: 'my_farm', icon: LayoutDashboard },
  { id: 'tools', label: 'farming_tools', icon: Sprout },
  { id: 'market', label: 'market_rates', icon: TrendingUp },
  { id: 'schemes', label: 'schemes', icon: Landmark },
];

const CROPS = ['Paddy', 'Wheat', 'Cotton', 'Vegetables', 'Sugarcane', 'Mustard', 'Pulses', 'Coconut', 'Rubber', 'Banana'];
const SOIL_TYPES = ['Alluvial Soil', 'Black Soil', 'Red Soil', 'Clay Soil', 'Sandy Loam', 'Laterite'];
const IRRIGATION_TYPES = ['Canal / Flood', 'Borewell / Tube well', 'Drip Irrigation', 'Sprinkler', 'Rainfed'];

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
];

const AppContent = () => {
  const { t, i18n } = useTranslation();
  const { profile, authRole, setAuthRole, logout, updateProfile, clearProfile } = useFarmer();
  const [activePage, setActivePage] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [savedToast, setSavedToast] = useState(false);
  const notificationRef = useRef(null);

  // Profile edit state inside settings modal
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    crop: 'Paddy',
    landSize: '2.5',
    soilType: 'Alluvial Soil',
    irrigation: 'Borewell / Tube well'
  });

  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        location: profile.location || '',
        crop: profile.crop || 'Paddy',
        landSize: profile.landSize || '2.5',
        soilType: profile.soilType || 'Alluvial Soil',
        irrigation: profile.irrigation || 'Borewell / Tube well'
      });
    }
  }, [profile]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getGlowColor = () => {
    if (authRole === 'admin') return 'rgba(139, 92, 246, 0.15)';
    switch (activePage) {
      case 'dashboard': return 'rgba(16, 185, 129, 0.12)';
      case 'tools': return 'rgba(6, 182, 212, 0.12)';
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
  }, [activePage, authRole]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(editForm);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  // If not logged in, render the Auth Portal
  if (!authRole) {
    return (
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        <EnhancedBackground />
        <AuthPortal />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
      <EnhancedBackground />

      {/* Ambient Interactive Cursor Glow */}
      <motion.div
        className="pointer-events-none fixed -left-32 -top-32 w-72 h-72 rounded-full filter blur-[90px] z-0 hidden lg:block transition-colors duration-500"
        style={{ backgroundColor: getGlowColor() }}
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: 'spring', damping: 40, stiffness: 200, mass: 0.1 }}
      />

      {/* Global Navbar */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center p-3 md:p-6 pointer-events-none"
      >
        <nav className="w-full max-w-7xl backdrop-blur-3xl bg-[#030712]/80 border border-cyan-500/20 rounded-[2rem] px-4 md:px-6 py-3 flex items-center justify-between pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.15)] relative overflow-visible">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          {/* Left Brand / Nav */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 cursor-pointer pl-2"
              onClick={() => setActivePage('dashboard')}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white relative overflow-hidden group shadow-lg ${
                authRole === 'admin' 
                  ? 'bg-gradient-to-br from-violet-500 via-indigo-600 to-cyan-500 shadow-violet-500/30' 
                  : 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-emerald-500/30'
              }`}>
                {authRole === 'admin' ? <ShieldCheck size={20} /> : <Sprout size={20} />}
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-black tracking-tight leading-none text-white font-display">
                  {t('app_name')}
                </span>
                {authRole === 'admin' && (
                  <span className="block text-[9px] font-black uppercase tracking-widest text-violet-400">Admin Studio</span>
                )}
              </div>
            </motion.div>

            {/* Farmer Desktop Navigation */}
            {authRole === 'farmer' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="hidden md:flex items-center gap-1 ml-6 bg-white/5 rounded-full p-1 border border-white/5 relative"
              >
                {FARMER_NAV_ITEMS.map(item => (
                  <motion.button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors duration-300 z-10 ${
                      activePage === item.id ? 'text-white' : 'text-text-muted hover:text-white'
                    }`}
                  >
                    {activePage === item.id && (
                      <motion.div
                        layoutId="desktop-active-nav"
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.55)] -z-10"
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

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 pr-1">
            {/* Admin Status Badge (Visible only to Admin) */}
            {authRole === 'admin' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 font-bold text-xs font-mono">
                <ShieldCheck size={14} />
                <span>Admin Root</span>
              </div>
            )}

            {/* Notification Bell (Farmer mode) */}
            {authRole === 'farmer' && (
              <div className="relative flex items-center" ref={notificationRef}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2.5 rounded-full transition-all border ${
                    showNotifications ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/50' : 'bg-white/5 text-text-muted hover:bg-white/10 border-transparent hover:text-white'
                  }`}
                  aria-label="Notifications"
                >
                  <Bell size={16} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-4 w-80 glass p-4 rounded-3xl shadow-2xl z-[100] border border-cyan-500/30 bg-[#030712]/95"
                    >
                      <h3 className="text-xs font-black mb-3 px-2 flex items-center justify-between font-display">
                        Farm Alerts
                        <span className="text-[9px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">2 New</span>
                      </h3>
                      <div className="space-y-2">
                        <div className="p-3 bg-white/5 hover:bg-cyan-500/10 transition-colors rounded-2xl cursor-pointer border border-transparent hover:border-cyan-500/20">
                          <p className="text-xs font-bold text-rose-400 mb-1">Weather Advisory</p>
                          <p className="text-[11px] text-text-muted leading-tight">Rain expected in your district tomorrow. Avoid pesticide spraying.</p>
                        </div>
                        <div className="p-3 bg-white/5 hover:bg-cyan-500/10 transition-colors rounded-2xl cursor-pointer border border-transparent hover:border-cyan-500/20">
                          <p className="text-xs font-bold text-emerald-400 mb-1">Mandi Update</p>
                          <p className="text-[11px] text-text-muted leading-tight">Paddy rates increased by 1.8% today in nearby mandis.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Language Picker */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              className="p-2.5 bg-white/5 text-text-muted hover:bg-white/10 border border-transparent rounded-full hover:text-cyan-400 transition-all"
              title={t('language')}
            >
              <Languages size={16} />
            </motion.button>

            {/* Profile Pill (Farmer Mode) */}
            {authRole === 'farmer' && profile && (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSettings(true)}
                className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 hover:border-emerald-400/40 transition-all text-left"
              >
                <div>
                  <p className="text-xs font-black leading-none text-white">{profile.name}</p>
                  <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">{profile.crop}</p>
                </div>
                <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center text-white font-black text-xs">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              </motion.button>
            )}

            {/* Logout / Exit */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="p-2.5 bg-rose-500/10 rounded-full hover:bg-rose-500/20 transition-colors border border-rose-500/20 text-rose-400"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </motion.button>
          </div>
        </nav>
      </motion.div>

      {/* Mobile Bottom Navigation (Farmer Mode) */}
      <AnimatePresence>
        {authRole === 'farmer' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="md:hidden fixed bottom-6 left-6 right-6 z-50 pointer-events-none flex justify-center"
          >
            <div className="w-full max-w-md flex justify-between items-center p-2 pointer-events-auto rounded-[2rem] shadow-2xl border border-cyan-500/20 bg-[#030712]/90 backdrop-blur-3xl relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
              {FARMER_NAV_ITEMS.map(item => (
                <motion.button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-[1.25rem] transition-colors duration-300 z-10 ${
                    activePage === item.id ? 'text-emerald-400' : 'text-text-muted hover:text-white'
                  }`}
                >
                  {activePage === item.id && (
                    <motion.div
                      layoutId="mobile-active-nav"
                      className="absolute inset-0 bg-emerald-500/20 border border-emerald-400/40 rounded-[1.25rem] -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <item.icon size={20} className={activePage === item.id ? 'scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' : ''} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{t(item.label)}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 relative pt-24 md:pt-28 pb-16">
        {authRole === 'admin' ? (
          <AdminPanel />
        ) : (
          <AnimatePresence mode="wait">
            {activePage === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard />
              </motion.div>
            ) : activePage === 'tools' ? (
              <motion.div
                key="tools"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <FarmerTools />
              </motion.div>
            ) : activePage === 'market' ? (
              <motion.div
                key="market"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <MarketInsights />
              </motion.div>
            ) : (
              <motion.div
                key="schemes"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <SchemesLocator />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Persistent Fixed AI Assistant in Farmer Mode */}
      {authRole === 'farmer' && <ChatInterface />}

      {/* Settings / Edit Farmer Details Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass p-6 sm:p-8 max-w-xl w-full relative z-10 shadow-2xl border-cyan-500/30 bg-[#030712]/95 rounded-[32px] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black flex items-center gap-3 font-display text-white">
                  <Settings className="text-cyan-400" size={24} /> {t('preferences')}
                </h2>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {savedToast && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 size={16} />
                  <span>Farm details updated successfully!</span>
                </div>
              )}

              <div className="space-y-6">
                {/* Language Picker */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Languages className="text-cyan-400" size={16} />
                    <h3 className="font-black text-xs uppercase tracking-wider text-cyan-300">{t('language')}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => i18n.changeLanguage(lang.code)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          i18n.language === lang.code
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-400 text-white'
                            : 'bg-white/5 border-white/10 text-text-muted hover:text-white'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Edit Farmer Details Form (User details can be modified anytime) */}
                {profile && (
                  <form onSubmit={handleSaveProfile} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="text-emerald-400" size={16} />
                        <h3 className="font-black text-xs uppercase tracking-wider text-white">Edit Farm Details</h3>
                      </div>
                      <span className="text-[10px] text-text-muted uppercase">Editable Anytime</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-text-muted mb-1 font-bold">Farmer Name</label>
                        <input
                          type="text"
                          required
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full bg-[#030712] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-text-muted mb-1 font-bold">Location / District</label>
                        <input
                          type="text"
                          required
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="w-full bg-[#030712] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-text-muted mb-1 font-bold">Primary Crop</label>
                        <select
                          value={editForm.crop}
                          onChange={(e) => setEditForm({ ...editForm, crop: e.target.value })}
                          className="w-full bg-[#030712] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
                        >
                          {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-text-muted mb-1 font-bold">Land Size (Acres)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          value={editForm.landSize}
                          onChange={(e) => setEditForm({ ...editForm, landSize: e.target.value })}
                          className="w-full bg-[#030712] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-text-muted mb-1 font-bold">Soil Type</label>
                        <select
                          value={editForm.soilType}
                          onChange={(e) => setEditForm({ ...editForm, soilType: e.target.value })}
                          className="w-full bg-[#030712] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
                        >
                          {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-text-muted mb-1 font-bold">Irrigation Source</label>
                        <select
                          value={editForm.irrigation}
                          onChange={(e) => setEditForm({ ...editForm, irrigation: e.target.value })}
                          className="w-full bg-[#030712] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
                        >
                          {IRRIGATION_TYPES.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full btn btn-primary py-2.5 rounded-xl text-xs font-black uppercase tracking-wider"
                    >
                      Save Farm Details
                    </button>
                  </form>
                )}

                {/* Reset Action */}
                <div className="pt-2">
                  <button 
                    onClick={() => { clearProfile(); setShowSettings(false); }}
                    className="w-full btn py-3 justify-center bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-black uppercase tracking-wider rounded-2xl"
                  >
                    <LogOut size={14} /> Clear Farm Profile & Reset
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-8 bg-[#02040a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <p className="text-xs text-text-muted/40 font-black uppercase tracking-[0.3em]">
            © 2026 Krishi Sakhi AI • Empowering Agriculture Across India
          </p>
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
