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

      {/* Global Navbar */}
      <motion.div 
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center p-3 md:p-5 pointer-events-none"
      >
        <nav className="w-full max-w-6xl backdrop-blur-md bg-[#0e1311]/85 border border-white/10 rounded-2xl px-4 md:px-5 py-2.5 flex items-center justify-between pointer-events-auto shadow-lg shadow-black/20 relative">

          {/* Left Brand / Nav */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2.5 cursor-pointer pl-1"
              onClick={() => setActivePage('dashboard')}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                authRole === 'admin' 
                  ? 'bg-violet-500/15 text-violet-400 border border-violet-500/30' 
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}>
                {authRole === 'admin' ? <ShieldCheck size={18} /> : <Sprout size={18} />}
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-bold tracking-tight text-white">
                  {t('app_name')}
                </span>
                {authRole === 'admin' && (
                  <span className="block text-[9px] font-semibold uppercase tracking-wider text-violet-400">Admin</span>
                )}
              </div>
            </motion.div>

            {/* Farmer Desktop Navigation */}
            {authRole === 'farmer' && (
              <div className="hidden md:flex items-center gap-1 ml-4 bg-white/5 rounded-xl p-1 border border-white/5">
                {FARMER_NAV_ITEMS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activePage === item.id ? 'text-white' : 'text-text-muted hover:text-white'
                    }`}
                  >
                    {activePage === item.id && (
                      <motion.div
                        layoutId="desktop-active-nav"
                        className="absolute inset-0 bg-emerald-500 rounded-lg shadow-sm -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                    <item.icon size={15} />
                    {t(item.label)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 pr-1">
            {/* Admin Status Badge (Visible only to Admin) */}
            {authRole === 'admin' && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 font-semibold text-xs font-mono">
                <ShieldCheck size={13} />
                <span>Admin</span>
              </div>
            )}

            {/* Notification Bell (Farmer mode) */}
            {authRole === 'farmer' && (
              <div className="relative flex items-center" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-xl transition-all border ${
                    showNotifications ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-text-muted hover:bg-white/10 border-transparent hover:text-white'
                  }`}
                  aria-label="Notifications"
                >
                  <Bell size={15} />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-80 p-4 rounded-2xl shadow-xl z-[100] border border-white/10 bg-[#0e1311]/95 backdrop-blur-xl"
                    >
                      <h3 className="text-xs font-semibold mb-3 px-1 flex items-center justify-between text-white">
                        Farm Alerts
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-md font-medium">2 New</span>
                      </h3>
                      <div className="space-y-2">
                        <div className="p-2.5 bg-white/5 hover:bg-white/10 transition-colors rounded-xl cursor-pointer border border-white/5">
                          <p className="text-xs font-semibold text-rose-400 mb-0.5">Weather Advisory</p>
                          <p className="text-[11px] text-text-muted leading-relaxed">Rain expected in your district tomorrow. Avoid pesticide spraying.</p>
                        </div>
                        <div className="p-2.5 bg-white/5 hover:bg-white/10 transition-colors rounded-xl cursor-pointer border border-white/5">
                          <p className="text-xs font-semibold text-emerald-400 mb-0.5">Mandi Update</p>
                          <p className="text-[11px] text-text-muted leading-relaxed">Paddy rates increased by 1.8% today in nearby mandis.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Language Picker */}
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 bg-white/5 text-text-muted hover:bg-white/10 border border-white/5 rounded-xl hover:text-white transition-all"
              title={t('language')}
            >
              <Languages size={15} />
            </button>

            {/* Profile Pill (Farmer Mode) */}
            {authRole === 'farmer' && profile && (
              <button 
                onClick={() => setShowSettings(true)}
                className="hidden lg:flex items-center gap-2.5 px-3 py-1 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-all text-left"
              >
                <div>
                  <p className="text-xs font-semibold leading-none text-white">{profile.name}</p>
                  <p className="text-[9px] text-emerald-400 font-medium uppercase tracking-wider">{profile.crop}</p>
                </div>
                <div className="w-6 h-6 bg-emerald-500/20 border border-emerald-500/40 rounded-lg flex items-center justify-center text-emerald-300 font-bold text-xs">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              </button>
            )}

            {/* Logout / Exit */}
            <button
              onClick={logout}
              className="p-2 bg-rose-500/10 rounded-xl hover:bg-rose-500/20 transition-colors border border-rose-500/20 text-rose-400"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </nav>
      </motion.div>

      {/* Mobile Bottom Navigation (Farmer Mode) */}
      <AnimatePresence>
        {authRole === 'farmer' && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="md:hidden fixed bottom-4 left-4 right-4 z-50 pointer-events-none flex justify-center"
          >
            <div className="w-full max-w-md flex justify-between items-center p-1.5 pointer-events-auto rounded-2xl shadow-xl border border-white/10 bg-[#0e1311]/95 backdrop-blur-xl relative">
              {FARMER_NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-colors duration-200 z-10 ${
                    activePage === item.id ? 'text-emerald-400' : 'text-text-muted hover:text-white'
                  }`}
                >
                  {activePage === item.id && (
                    <motion.div
                      layoutId="mobile-active-nav"
                      className="absolute inset-0 bg-emerald-500/15 border border-emerald-500/30 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <item.icon size={18} />
                  <span className="text-[9px] font-semibold">{t(item.label)}</span>
                </button>
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
              initial={{ scale: 0.98, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className="p-6 sm:p-7 max-w-xl w-full relative z-10 shadow-2xl border border-white/10 bg-[#0e1311]/95 backdrop-blur-xl rounded-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold flex items-center gap-2.5 text-white">
                  <Settings className="text-emerald-400" size={20} /> {t('preferences')}
                </h2>
                <button onClick={() => setShowSettings(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-text-muted hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {savedToast && (
                <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 text-emerald-400 text-xs font-medium">
                  <CheckCircle2 size={15} />
                  <span>Farm details updated successfully!</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Language Picker */}
                <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Languages className="text-emerald-400" size={15} />
                    <h3 className="font-semibold text-xs text-slate-300">{t('language')}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => i18n.changeLanguage(lang.code)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                          i18n.language === lang.code
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : 'bg-white/5 border-white/10 text-text-muted hover:text-white'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Edit Farmer Details Form */}
                {profile && (
                  <form onSubmit={handleSaveProfile} className="p-3.5 bg-white/5 rounded-xl border border-white/5 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="text-emerald-400" size={15} />
                        <h3 className="font-semibold text-xs text-white">Edit Farm Details</h3>
                      </div>
                      <span className="text-[10px] text-text-muted">Editable anytime</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-text-muted mb-1 font-medium">Farmer Name</label>
                        <input
                          type="text"
                          required
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full bg-[#090c0b] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-text-muted mb-1 font-medium">Location / District</label>
                        <input
                          type="text"
                          required
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="w-full bg-[#090c0b] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-text-muted mb-1 font-medium">Primary Crop</label>
                        <select
                          value={editForm.crop}
                          onChange={(e) => setEditForm({ ...editForm, crop: e.target.value })}
                          className="w-full bg-[#090c0b] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                        >
                          {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-text-muted mb-1 font-medium">Land Size (Acres)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          value={editForm.landSize}
                          onChange={(e) => setEditForm({ ...editForm, landSize: e.target.value })}
                          className="w-full bg-[#090c0b] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-text-muted mb-1 font-medium">Soil Type</label>
                        <select
                          value={editForm.soilType}
                          onChange={(e) => setEditForm({ ...editForm, soilType: e.target.value })}
                          className="w-full bg-[#090c0b] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                        >
                          {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-text-muted mb-1 font-medium">Irrigation Source</label>
                        <select
                          value={editForm.irrigation}
                          onChange={(e) => setEditForm({ ...editForm, irrigation: e.target.value })}
                          className="w-full bg-[#090c0b] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                        >
                          {IRRIGATION_TYPES.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full btn btn-primary py-2 rounded-xl text-xs font-semibold mt-1"
                    >
                      Save Farm Details
                    </button>
                  </form>
                )}

                {/* Reset Action */}
                <div className="pt-1">
                  <button 
                    onClick={() => { clearProfile(); setShowSettings(false); }}
                    className="w-full btn py-2.5 justify-center bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold rounded-xl"
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
      <footer className="mt-auto border-t border-white/5 py-6 bg-transparent">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs text-text-muted/50 font-normal">
            © 2026 Krishi Sakhi • Empowering Agriculture Across India
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
