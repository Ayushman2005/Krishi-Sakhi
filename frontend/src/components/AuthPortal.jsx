import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFarmer } from '../context/FarmerContext';
import {
  User, ShieldCheck, MapPin, ArrowRight, Sparkles,
  Lock, KeyRound, AlertCircle, Sprout, CheckCircle2,
  Droplets, Layers, Eye, EyeOff, Terminal, Compass, RefreshCw
} from 'lucide-react';

const CROPS = [
  { value: 'Paddy', label: 'Paddy / Rice', emoji: '🌾' },
  { value: 'Wheat', label: 'Wheat', emoji: '🌿' },
  { value: 'Cotton', label: 'Cotton', emoji: '☁️' },
  { value: 'Vegetables', label: 'Vegetables', emoji: '🥦' },
  { value: 'Sugarcane', label: 'Sugarcane', emoji: '🎋' },
  { value: 'Mustard', label: 'Mustard / Oilseeds', emoji: '🌼' },
  { value: 'Pulses', label: 'Pulses / Dal', emoji: '🌱' },
];

const SOIL_TYPES = ['Alluvial Soil', 'Black Soil', 'Red Soil', 'Clay Soil', 'Sandy Loam'];
const IRRIGATION_TYPES = ['Canal / Flood', 'Borewell / Tube well', 'Drip Irrigation', 'Sprinkler', 'Rainfed'];

const AuthPortal = () => {
  const { profile, loginAsFarmer, loginAsAdmin, adminCredentials } = useFarmer();
  const [activeTab, setActiveTab] = useState('farmer'); // 'farmer' | 'admin'

  // Farmer form state
  const [farmerForm, setFarmerForm] = useState(() => ({
    name: profile?.name || '',
    location: profile?.location || '',
    landSize: profile?.landSize || '2.5',
    crop: profile?.crop || 'Paddy',
    soilType: profile?.soilType || 'Alluvial Soil',
    irrigation: profile?.irrigation || 'Borewell / Tube well',
    lat: profile?.lat || null,
    lon: profile?.lon || null,
  }));

  // Admin credentials state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [farmerError, setFarmerError] = useState('');

  // Location search state
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);
  const locationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationSearch = (query) => {
    setFarmerForm(prev => ({ ...prev, location: query }));
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in&accept-language=en`;
        const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Location search failed", err);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 400);
  };

  const handleSelectLocation = (item) => {
    setFarmerForm(prev => ({
      ...prev,
      location: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));
    setShowSuggestions(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFarmerSubmit = async (e) => {
    e.preventDefault();
    if (!farmerForm.name.trim()) {
      setFarmerError('Please enter your name.');
      return;
    }
    if (!farmerForm.location.trim()) {
      setFarmerError('Please select or enter your district/location.');
      return;
    }
    setFarmerError('');
    setIsSubmitting(true);
    try {
      await loginAsFarmer(farmerForm);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');
    setIsSubmitting(true);
    try {
      const result = await loginAsAdmin(adminUsername, adminPassword);
      if (!result.success) {
        setAdminError(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
      <div className="w-full max-w-2xl">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest mb-3">
            <Sprout size={16} /> Krishi Sakhi AI
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-display">
            Welcome to <span className="gradient-text">Krishi Sakhi</span>
          </h1>
          <p className="text-text-muted mt-2 text-sm sm:text-base max-w-md mx-auto">
            Choose your portal to access simple crop guidance or full system model management.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#030712]/90 backdrop-blur-2xl p-1.5 rounded-3xl border border-cyan-500/20 mb-8 max-w-md mx-auto shadow-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('farmer')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'farmer'
                ? 'bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                : 'text-text-muted hover:text-white'
            }`}
          >
            <User size={18} /> Farmer Portal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'admin'
                ? 'bg-linear-to-r from-cyan-500 via-indigo-600 to-violet-600 text-white shadow-lg shadow-cyan-500/30'
                : 'text-text-muted hover:text-white'
            }`}
          >
            <ShieldCheck size={18} /> Admin Access
          </button>
        </div>

        {/* Main Card */}
        <div className="glass-card p-6 sm:p-10 rounded-[32px] border border-cyan-500/20 relative overflow-hidden shadow-2xl">
          {/* Subtle top indicator */}
          <div className={`absolute top-0 inset-x-0 h-1 bg-linear-to-r ${
            activeTab === 'farmer' ? 'from-emerald-400 via-teal-400 to-cyan-400' : 'from-cyan-400 via-indigo-500 to-violet-500'
          }`} />

          <AnimatePresence mode="wait">
            {activeTab === 'farmer' ? (
              <motion.div
                key="farmer-panel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
                    🌾 Farmer Details & Farm Setup
                  </h2>
                  <p className="text-text-muted text-xs sm:text-sm mt-1">
                    Enter your farm details for daily weather, disease checks, and market rates. You can update these anytime.
                  </p>
                </div>

                {profile && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Saved Farm Profile Found</p>
                      <p className="text-white font-bold text-sm">{profile.name} • {profile.crop} ({profile.location?.split(',')[0]})</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => loginAsFarmer(profile)}
                      className="btn btn-primary py-2 px-4 text-xs font-black rounded-xl"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {farmerError && (
                  <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-3 text-rose-400 text-xs font-bold">
                    <AlertCircle size={16} />
                    <span>{farmerError}</span>
                  </div>
                )}

                <form onSubmit={handleFarmerSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-text-muted mb-2">
                        Farmer / Farm Name *
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Kumar"
                          value={farmerForm.name}
                          onChange={(e) => setFarmerForm({ ...farmerForm, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400/60 focus:bg-white/10 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div ref={locationRef} className="relative">
                      <label className="block text-[11px] font-black uppercase tracking-wider text-text-muted mb-2">
                        Location / District *
                      </label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sambalpur, Odisha"
                          value={farmerForm.location}
                          onChange={(e) => handleLocationSearch(e.target.value)}
                          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400/60 focus:bg-white/10 transition-all font-medium"
                        />
                        {isSearchingLocation && (
                          <RefreshCw size={14} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-cyan-400" />
                        )}
                      </div>

                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-[#0a101d] border border-cyan-500/30 rounded-2xl overflow-hidden z-50 shadow-2xl max-h-48 overflow-y-auto">
                          {suggestions.map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectLocation(item)}
                              className="w-full text-left px-4 py-2.5 text-xs text-text-muted hover:bg-cyan-500/20 hover:text-white transition-colors border-b border-white/5 last:border-0"
                            >
                              <p className="font-bold text-white">{item.display_name.split(',')[0]}</p>
                              <p className="text-[10px] text-text-muted truncate">{item.display_name}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-text-muted mb-2">
                        Primary Crop
                      </label>
                      <select
                        value={farmerForm.crop}
                        onChange={(e) => setFarmerForm({ ...farmerForm, crop: e.target.value })}
                        className="w-full bg-[#0a101d] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400/60 transition-all font-medium"
                      >
                        {CROPS.map(c => (
                          <option key={c.value} value={c.value} className="bg-[#0a101d]">{c.emoji} {c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-text-muted mb-2">
                        Land Size (Acres)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="500"
                        value={farmerForm.landSize}
                        onChange={(e) => setFarmerForm({ ...farmerForm, landSize: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400/60 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-text-muted mb-2">
                        Soil Type
                      </label>
                      <select
                        value={farmerForm.soilType}
                        onChange={(e) => setFarmerForm({ ...farmerForm, soilType: e.target.value })}
                        className="w-full bg-[#0a101d] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400/60 transition-all font-medium"
                      >
                        {SOIL_TYPES.map(s => (
                          <option key={s} value={s} className="bg-[#0a101d]">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn btn-primary py-4 rounded-2xl text-base font-black flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 mt-4"
                  >
                    Enter Farm Dashboard <ArrowRight size={18} />
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="admin-panel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/25 rounded-full text-[10px] font-black uppercase tracking-widest text-violet-300 mb-2">
                    <ShieldCheck size={12} /> Fixed Root Credentials
                  </div>
                  <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
                    🛡️ System Administrator Login
                  </h2>
                  <p className="text-text-muted text-xs sm:text-sm mt-1">
                    Direct access to all 10 ML models, Ollama inference engine, API diagnostics, and telemetry logs. Admin credentials are fixed and cannot be modified.
                  </p>
                </div>

                {adminError && (
                  <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-3 text-rose-400 text-xs font-bold">
                    <AlertCircle size={16} />
                    <span>{adminError}</span>
                  </div>
                )}

                <form onSubmit={handleAdminSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-text-muted mb-2">
                      Admin Username
                    </label>
                    <div className="relative">
                      <Terminal size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400" />
                      <input
                        type="text"
                        required
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="admin"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-violet-400/60 focus:bg-white/10 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-text-muted mb-2">
                      Admin Password
                    </label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-12 py-3.5 text-sm text-white focus:outline-none focus:border-violet-400/60 focus:bg-white/10 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>



                  <button
                    type="submit"
                    className="w-full btn bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white py-4 rounded-2xl text-base font-black flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 mt-4"
                  >
                    Authenticate & Launch Admin Node <ArrowRight size={18} />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPortal;
