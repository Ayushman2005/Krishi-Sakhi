import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FarmerProvider, useFarmer } from './context/FarmerContext';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import MLHub from './components/MLHub';
import { Sprout, Settings, Bell, ShieldCheck, ArrowUpRight, LayoutDashboard, Cpu, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'ml', label: 'AI Models', icon: Cpu },
];

const AppContent = () => {
  const { profile, clearProfile } = useFarmer();
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="flex-1 flex flex-col min-h-screen">

      {/* Navbar */}
      <nav className="glass border-none rounded-none w-full flex justify-center items-center z-50 sticky top-0 backdrop-blur-3xl bg-background/60 border-b border-white/5">
        <div className="w-full max-w-[1300px] px-8 py-5 flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setActivePage('dashboard')}
            >
              <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center text-white shadow-[0_8px_24px_rgba(16,185,129,0.4)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Sprout size={24} className="relative z-10" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tighter">Krishi Sakhi <span className="text-primary">AI</span></span>
                <div className="flex items-center gap-1">
                  <ShieldCheck size={9} className="text-primary" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Verified Assistant</span>
                </div>
              </div>
            </motion.div>

            {/* Nav Links — show only when profile exists */}
            {profile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="hidden md:flex items-center gap-1 ml-6 bg-white/5 rounded-2xl p-1 border border-white/5"
              >
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                      activePage === item.id
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-text-muted hover:text-white hover:bg-white/5'
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
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="text-right">
                  <p className="text-sm font-black leading-none">{profile.name}</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{profile.crop} · {profile.landSize || '—'} ac</p>
                </div>
                <div className="w-9 h-9 bg-primary/20 rounded-full border-2 border-primary/50 flex items-center justify-center text-primary font-black text-sm group-hover:bg-primary group-hover:text-white transition-all">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <button className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5" aria-label="Notifications">
                <Bell size={18} className="text-text-muted" />
              </button>
              <button className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5" aria-label="Settings">
                <Settings size={18} className="text-text-muted" />
              </button>
              {clearProfile && (
                <button
                  onClick={clearProfile}
                  className="p-2.5 bg-error/10 rounded-xl hover:bg-error/20 transition-colors border border-error/10"
                  title="Reset Profile"
                  aria-label="Log out"
                >
                  <LogOut size={18} className="text-error" />
                </button>
              )}
            </motion.div>
          ) : (
            <div className="flex gap-3 items-center">
              <span className="px-4 py-1.5 bg-white/5 rounded-full text-xs font-bold text-text-muted uppercase tracking-widest border border-white/5">v2.0 Beta</span>
            </div>
          )}
        </div>
      </nav>

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
          ) : (
            <motion.div key="ml" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <MLHub />
              <ChatInterface />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

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
            <p className="text-xs text-text-muted/30 font-black uppercase tracking-[0.4em] text-center">
              © 2026 Krishi Sakhi AI • Built for SIH 2026 • Empowering the Roots of India
            </p>
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
