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
      <div className="w-full max-w-xl">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Sprout size={14} /> Krishi Sakhi AI
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            Welcome to <span className="text-emerald-400">Krishi Sakhi</span>
          </h1>
          <p className="text-text-muted text-xs sm:text-sm max-w-md mx-auto">
            Choose your portal to access crop advisory or system management.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/10 mb-6 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('farmer')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'farmer'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-text-muted hover:text-white'
            }`}
          >
            <User size={15} /> Farmer Portal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-text-muted hover:text-white'
            }`}
          >
            <ShieldCheck size={15} /> Admin Access
          </button>
        </div>

        {/* Main Card */}
        <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'farmer' ? (
              <motion.div
                key="farmer-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    🌾 Farmer Details & Farm Setup
                  </h2>
                  <p className="text-text-muted text-xs mt-1">
                    Enter your farm details for daily weather, disease checks, and market rates.
                  </p>
                </div>

                {profile && (
                  <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Saved Farm Profile</p>
                      <p className="text-white font-medium text-xs">{profile.name} • {profile.crop} ({profile.location?.split(',')[0]})</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => loginAsFarmer(profile)}
                      className="btn btn-primary py-1.5 px-3 text-xs rounded-lg font-semibold"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {farmerError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5 text-rose-400 text-xs font-medium">
                    <AlertCircle size={15} />
                    <span>{farmerError}</span>
                  </div>
                )}

                <form onSubmit={handleFarmerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Farmer / Farm Name *
                      </label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Kumar"
                          value={farmerForm.name}
                          onChange={(e) => setFarmerForm({ ...farmerForm, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div ref={locationRef} className="relative">
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Location / District *
                      </label>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sambalpur, Odisha"
                          value={farmerForm.location}
                          onChange={(e) => handleLocationSearch(e.target.value)}
                          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                        />
                        {isSearchingLocation && (
                          <RefreshCw size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-emerald-400" />
                        )}
                      </div>

                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#0e1311] border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl max-h-48 overflow-y-auto">
                          {suggestions.map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectLocation(item)}
                              className="w-full text-left px-3.5 py-2 text-xs text-text-muted hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 last:border-0"
                            >
                              <p className="font-medium text-white">{item.display_name.split(',')[0]}</p>
                              <p className="text-[10px] text-text-muted truncate">{item.display_name}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Primary Crop
                      </label>
                      <select
                        value={farmerForm.crop}
                        onChange={(e) => setFarmerForm({ ...farmerForm, crop: e.target.value })}
                        className="w-full bg-[#090c0b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                      >
                        {CROPS.map(c => (
                          <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Land Size (Acres)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="500"
                        value={farmerForm.landSize}
                        onChange={(e) => setFarmerForm({ ...farmerForm, landSize: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Soil Type
                      </label>
                      <select
                        value={farmerForm.soilType}
                        onChange={(e) => setFarmerForm({ ...farmerForm, soilType: e.target.value })}
                        className="w-full bg-[#090c0b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                      >
                        {SOIL_TYPES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn btn-primary py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 mt-2"
                  >
                    Enter Farm Dashboard <ArrowRight size={15} />
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="admin-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded-md text-[10px] font-semibold text-violet-300 mb-2">
                    <ShieldCheck size={12} /> Fixed Root Credentials
                  </div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    🛡️ System Administrator Login
                  </h2>
                  <p className="text-text-muted text-xs mt-1">
                    Direct access to ML models, inference engine, and diagnostics.
                  </p>
                </div>

                {adminError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5 text-rose-400 text-xs font-medium">
                    <AlertCircle size={15} />
                    <span>{adminError}</span>
                  </div>
                )}

                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Admin Username
                    </label>
                    <div className="relative">
                      <Terminal size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400" />
                      <input
                        type="text"
                        required
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="admin"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-400 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Admin Password
                    </label>
                    <div className="relative">
                      <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-violet-400 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn bg-violet-600 hover:bg-violet-500 text-white py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 mt-2"
                  >
                    Authenticate & Launch Admin Node <ArrowRight size={15} />
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
