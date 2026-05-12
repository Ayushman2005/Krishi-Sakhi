import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FarmerProvider, useFarmer } from './context/FarmerContext';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import MLHub from './components/MLHub';
import MarketInsights from './components/MarketInsights';
import EnhancedBackground from './components/EnhancedBackground';
import { Sprout, Settings, Bell, ShieldCheck, ArrowUpRight, LayoutDashboard, Cpu, LogOut, TrendingUp, X, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'ml', label: 'AI Models', icon: Cpu },
  { id: 'market', label: 'Market Rates', icon: TrendingUp },
];

const AppContent = () => {
  const { profile, clearProfile } = useFarmer();
  const [activePage, setActivePage] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
      <EnhancedBackground />

      {/* Floating Navbar */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full flex justify-center z-50 sticky top-6 px-4 pointer-events-none"
      >
        <nav className="glass w-full max-w-6xl flex justify-between items-center px-4 py-3 pointer-events-auto rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-white/10 bg-[#020617]/70 backdrop-blur-2xl">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3 cursor-pointer pl-2"
              onClick={() => setActivePage('dashboard')}
            >
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Sprout size={20} className="relative z-10" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-black tracking-tight leading-none">Krishi Sakhi</span>
              </div>
            </motion.div>

            {/* Nav Links — show only when profile exists */}
            {profile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="hidden md:flex items-center gap-1 ml-6 bg-white/5 rounded-full p-1 border border-white/5"
              >
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                      activePage === item.id
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-text-muted hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right side */}
          {profile ? (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3 pr-1">
              
              <div className="relative flex items-center" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2.5 rounded-full transition-colors border ${showNotifications ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/5 text-text-muted hover:bg-white/10 border-white/5 hover:text-white'}`} 
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {/* Notification dot */}
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-error rounded-full border-2 border-background animate-pulse"></span>
                </button>
                
                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-4 w-80 glass p-4 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] z-[100] border border-white/10 bg-[#020617]/95 origin-top-right"
                    >
                      <h3 className="text-sm font-black mb-3 px-2 flex items-center justify-between">
                        Notifications
                        <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">2 New</span>
                      </h3>
                      <div className="space-y-2">
                        <div className="p-3 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl cursor-pointer">
                          <p className="text-xs font-bold text-error mb-1">Weather Alert</p>
                          <p className="text-[11px] text-text-muted leading-tight">Heavy unseasonal rain expected tomorrow in your district. Delay fertilizer application.</p>
                        </div>
                        <div className="p-3 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl cursor-pointer">
                          <p className="text-xs font-bold text-primary mb-1">Market Pulse</p>
                          <p className="text-[11px] text-text-muted leading-tight">Paddy rates have increased by 2.4% today in local mandis.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => setShowSettings(true)}
                className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full border border-white/5 hover:bg-white/10 transition-colors mr-2 text-left"
              >
                <div>
                  <p className="text-xs font-black leading-none">{profile.name}</p>
                  <p className="text-[9px] text-primary font-bold uppercase tracking-widest">{profile.crop}</p>
                </div>
                <div className="w-7 h-7 bg-primary/20 rounded-full border border-primary/50 flex items-center justify-center text-primary font-black text-xs">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              </button>

              {clearProfile && (
                <button
                  onClick={clearProfile}
                  className="p-2.5 bg-error/10 rounded-full hover:bg-error/20 transition-colors border border-error/10 ml-1"
                  title="Reset Profile"
                  aria-label="Log out"
                >
                  <LogOut size={16} className="text-error" />
                </button>
              )}
            </motion.div>
          ) : (
            <div className="flex gap-3 items-center pr-2">
              <span className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em] border border-white/10 flex items-center gap-2">
                <ShieldCheck size={12} /> v2.0 Beta
              </span>
            </div>
          )}
        </nav>
      </motion.div>

      {/* Mobile Nav Tabs */}
      {profile && (
        <div className="md:hidden flex w-full bg-background/80 border-b border-white/5 px-4">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold border-b-2 transition-all ${
                activePage === item.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted'
              }`}
            >
              <item.icon size={15} />{item.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {!profile ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <ProfileForm />
            </motion.div>
          ) : activePage === 'dashboard' ? (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Dashboard />
              <ChatInterface />
            </motion.div>
          ) : activePage === 'market' ? (
            <motion.div key="market" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <MarketInsights />
              <ChatInterface />
            </motion.div>
          ) : (
            <motion.div key="ml" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <MLHub />
              <ChatInterface />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Settings Modal */}
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
              className="glass p-8 md:p-12 max-w-lg w-full relative z-10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-white/10 bg-[#020617]/95"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black flex items-center gap-3">
                  <Settings className="text-primary" size={28} /> Preferences
                </h2>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-5">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary font-black text-2xl border-2 border-primary/30">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-xl">{profile.name}</h3>
                    <p className="text-sm text-text-muted">{profile.location || 'Location Not Set'}</p>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">{profile.crop} Farmer</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Account Management</p>
                  <button className="w-full btn btn-secondary py-4 justify-start bg-white/5 border-transparent hover:bg-white/10">
                    <User size={16} /> Edit Farm Details
                  </button>
                  <button className="w-full btn btn-secondary py-4 justify-start bg-white/5 border-transparent hover:bg-white/10">
                    <ShieldCheck size={16} /> Privacy & Data
                  </button>
                  <button 
                    onClick={() => { clearProfile(); setShowSettings(false); }}
                    className="w-full btn py-4 justify-start bg-error/10 text-error hover:bg-error/20 border border-error/10"
                  >
                    <LogOut size={16} /> Factory Reset (Clear Data)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="w-full flex justify-center border-t border-white/5 mt-20 relative overflow-hidden bg-black/20">
        <div className="w-full max-w-[1300px] p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left mb-12">
            <div className="space-y-4">
              <h4 className="font-black text-xl">Krishi Sakhi</h4>
              <p className="text-sm text-text-muted leading-relaxed">Empowering Kerala's farmers with AI-powered intelligence and local wisdom.</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">v2.0</span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 text-text-muted text-[10px] font-black uppercase tracking-widest rounded-full">SIH 2026</span>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-primary">Resources</h4>
              <ul className="text-sm text-text-muted space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"><ArrowUpRight size={12} /> Crop Calendar</li>
                <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"><ArrowUpRight size={12} /> Market Rates</li>
                <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"><ArrowUpRight size={12} /> Government Schemes</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-primary">Support</h4>
              <ul className="text-sm text-text-muted space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors">Contact Expert</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Feedback</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-xs text-text-muted/30 font-black uppercase tracking-[0.4em] text-center"
            >
              © 2026 Krishi Sakhi AI • Built for SIH 2026 • Empowering the Roots of India
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
