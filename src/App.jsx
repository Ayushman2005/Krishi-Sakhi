import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FarmerProvider, useFarmer } from './context/FarmerContext';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import { Sprout, Settings, Bell, ShieldCheck, ArrowUpRight } from 'lucide-react';

const AppContent = () => {
  const { profile } = useFarmer();

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Dynamic Navbar */}
      <nav className="glass border-none rounded-none w-full flex justify-center items-center z-50 sticky top-0 backdrop-blur-3xl bg-background/50">
        <div className="w-full max-w-[1300px] px-8 py-6 flex justify-between items-center">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-[0_10px_30px_rgba(16,185,129,0.4)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <Sprout size={28} className="relative z-10" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tighter">Krishi Sakhi <span className="text-primary">AI</span></span>
              <div className="flex items-center gap-1">
                <ShieldCheck size={10} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Verified Assistant</span>
              </div>
            </div>
          </motion.div>
          
          {profile ? (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-6"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black">{profile.name}</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{profile.crop} Expert</p>
                </div>
                <div className="w-10 h-10 bg-primary/20 rounded-full border-2 border-primary/50 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-white transition-all">
                  {profile.name.charAt(0)}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                  <Bell size={20} className="text-text-muted" />
                </button>
                <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                  <Settings size={20} className="text-text-muted" />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex gap-4">
               <span className="px-4 py-2 bg-white/5 rounded-full text-xs font-bold text-text-muted uppercase tracking-widest border border-white/5">v1.0 Beta</span>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {!profile ? (
            <motion.div 
              key="setup"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "circOut" }}
              className="flex items-center justify-center min-h-[calc(100vh-100px)] p-6"
            >
              <ProfileForm />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Dashboard />
              <ChatInterface />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Enhanced Footer */}
      <footer className="w-full flex justify-center border-t border-white/5 mt-20 relative overflow-hidden bg-black/20">
        <div className="w-full max-w-[1300px] p-12 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left mb-12">
            <div className="space-y-4">
              <h4 className="font-black text-xl">Krishi Sakhi</h4>
              <p className="text-sm text-text-muted leading-relaxed">Empowering Kerala's farmers with artificial intelligence and local wisdom.</p>
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
          <p className="text-xs text-text-muted/30 font-black uppercase tracking-[0.4em] mt-12">
            © 2026 Krishi Sakhi AI • Empowering the Roots of India
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
