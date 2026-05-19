import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFarmer } from '../context/FarmerContext';
import {
  User, MapPin, ArrowRight, ArrowLeft, Sparkles,
  CheckCircle2, Droplets, Layers, Maximize2, Sprout,
  AlertCircle, Leaf, Cloud, Zap, TreePine, Loader2
} from 'lucide-react';

// ── Crop option cards ─────────────────────────────────────
const CROPS = [
  { value: 'Paddy',      label: 'Paddy Rice',        emoji: '🌾', desc: 'Kharif & Rabi' },
  { value: 'Coconut',    label: 'Coconut',            emoji: '🥥', desc: 'Perennial crop' },
  { value: 'Rubber',     label: 'Natural Rubber',     emoji: '🌳', desc: 'Latex tapping' },
  { value: 'Vegetables', label: 'Mixed Vegetables',   emoji: '🥦', desc: 'Seasonal variety' },
  { value: 'Banana',     label: 'Banana',             emoji: '🍌', desc: 'Plantation crop' },
];

// ── Irrigation pill selectors ─────────────────────────────
const IRRIGATION = [
  { value: 'Drip',      label: 'Drip',      icon: Droplets, desc: '92% efficient' },
  { value: 'Sprinkler', label: 'Sprinkler', icon: Cloud,    desc: 'Even coverage' },
  { value: 'Manual',    label: 'Manual',    icon: Zap,      desc: 'Traditional' },
  { value: 'Flood',     label: 'Flood',     icon: Layers,   desc: 'Paddy fields' },
];

// ── Soil type options ─────────────────────────────────────
const SOIL_TYPES = [
  { value: 'Alluvial', label: 'Alluvial', icon: Layers },
  { value: 'Laterite', label: 'Laterite', icon: TreePine },
  { value: 'Sandy',    label: 'Sandy',    icon: Maximize2 },
  { value: 'Clay',     label: 'Clay',     icon: Leaf },
];

// ── Step progress indicator ───────────────────────────────
const STEPS = [
  { id: 1, label: 'Identity',  sub: 'Who are you?' },
  { id: 2, label: 'Your Farm', sub: 'Tell us about your land' },
];

// ── Floating input field ──────────────────────────────────
const Field = ({ label, icon: Icon, children }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">
      {Icon && <Icon size={12} className="text-primary" />}{label}
    </label>
    {children}
  </div>
);

// ── Branded Global stat card (left panel) ─────────────────
const StatPill = ({ label, value, color }) => (
  <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/5">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">{label}</p>
      <p className="text-sm font-black">{value}</p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────
const ProfileForm = () => {
  const { updateProfile } = useFarmer();
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '', location: '', landSize: '',
    crop: 'Paddy', soilType: 'Alluvial', irrigation: 'Drip',
    lat: null, lon: null, locationDisplay: '',
  });

  // Location Autocomplete State
  const [locationQuery, setLocationQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);
  const locationRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchLocation = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsSearchingLocation(true);
    try {
      // Use addressdetails=1 to get structured parts; featureType (note capitalisation) for cities
      // We search broadly so small towns like Shōranūr are found, then filter by type client-side
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=7&addressdetails=1&accept-language=en`;
      const response = await fetch(url, {
        headers: { 'Accept-Language': 'en' }
      });
      if (response.ok) {
        const data = await response.json();
        // Prefer populated places / towns / villages over administrative areas
        const sorted = data.sort((a, b) => {
          const preferred = ['city', 'town', 'village', 'suburb', 'hamlet'];
          const aScore = preferred.includes(a.type) ? 0 : 1;
          const bScore = preferred.includes(b.type) ? 0 : 1;
          return aScore - bScore;
        });
        setSuggestions(sorted);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Location search failed", error);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const handleLocationChange = (e) => {
    const val = e.target.value;
    setLocationQuery(val);
    set('location', val); // Keep it synced if they just type
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => searchLocation(val), 500);
  };

  const selectLocation = (loc) => {
    // Use the structured address to build an accurate display name
    const addr = loc.address || {};
    const cityName = addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || loc.display_name.split(',')[0];
    const state = addr.state || '';
    const country = addr.country || '';
    const displayName = [cityName, state, country].filter(Boolean).join(', ');
    
    setLocationQuery(displayName);
    // Store the clean city name as `location` (used for display + fallback weather search)
    // Store lat/lon for precise weather API calls
    setFormData(prev => ({
      ...prev,
      location: displayName,
      locationDisplay: displayName,
      lat: parseFloat(loc.lat),
      lon: parseFloat(loc.lon),
    }));
    setShowSuggestions(false);
  };

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleNext = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.name.trim() || !formData.location.trim()) {
      setErrorMsg('Please fill in your name and district.');
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.landSize || parseFloat(formData.landSize) <= 0) {
      setErrorMsg('Please enter a valid land size.');
      return;
    }
    updateProfile(formData);
  };

  return (
    // Full-screen split layout
    <div className="min-h-[calc(100vh-80px)] w-full flex items-stretch">

      {/* ── LEFT: Brand panel ─────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-12 relative overflow-hidden"
           style={{ background: 'linear-gradient(160deg, #033d2e 0%, #022c22 60%, #01190f 100%)' }}>

        {/* Animated orbs */}
        <div className="orb-animate absolute top-16 left-16 w-64 h-64 rounded-full opacity-30"
             style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)' }} />
        <div className="orb-animate-r absolute bottom-24 right-8 w-48 h-48 rounded-full opacity-20"
             style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 border-r border-white/5" />

        {/* Top */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30">
              <Sprout size={24} className="text-white" />
            </div>
            <div>
              <p className="font-black text-lg tracking-tight">Krishi Sakhi</p>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest">AI Farming Assistant</p>
            </div>
          </div>

          <h2 className="text-4xl font-black tracking-tighter leading-tight mb-4">
            Your Smart<br />
            <span className="gradient-text">Farm Companion</span><br />
            Starts Here.
          </h2>
          <p className="text-text-muted text-sm leading-relaxed">
            Set up your digital farm profile in under 2 minutes. Our AI will personalize every advisory, alert, and insight just for you.
          </p>
        </div>

        {/* Mid: stats */}
        <div className="relative z-10 space-y-3">
          <StatPill label="Farmers Onboarded" value="12,400+" color="bg-primary" />
          <StatPill label="Advisories Sent" value="3.2M" color="bg-accent" />
          <StatPill label="Global Reach" value="Worldwide" color="bg-secondary" />
        </div>

        {/* Bottom: step display */}
        <div className="relative z-10">
          <div className="space-y-4">
            {STEPS.map((s) => (
              <div key={s.id} className={`flex items-center gap-4 transition-all ${step === s.id ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 transition-all ${
                  step > s.id ? 'bg-primary text-white' : step === s.id ? 'bg-primary text-white shadow-lg shadow-primary/40' : 'bg-white/10 text-text-muted'
                }`}>
                  {step > s.id ? <CheckCircle2 size={16} /> : s.id}
                </div>
                <div>
                  <p className="font-black text-sm">{s.label}</p>
                  <p className="text-[10px] text-text-muted">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="mt-6 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div animate={{ width: step === 1 ? '50%' : '100%' }} transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
          </div>
          <p className="text-[10px] text-text-muted font-bold mt-2 uppercase tracking-widest">Step {step} of 2</p>
        </div>
      </div>

      {/* ── RIGHT: Form panel ─────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-16 relative overflow-hidden">

        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)' }} />

        <div className="w-full max-w-2xl">

          {/* Mobile step indicator */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-2 text-sm font-bold ${step >= s.id ? 'text-primary' : 'text-text-muted'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${step >= s.id ? 'bg-primary text-white' : 'bg-white/10'}`}>
                    {step > s.id ? '✓' : s.id}
                  </div>
                  {s.label}
                </div>
                {i < STEPS.length - 1 && <div className="flex-1 h-px bg-white/10" />}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                onSubmit={handleNext}
                className="space-y-8"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-4">
                    <Sparkles size={12} /> Step 1 of 2 — Identity
                  </div>
                  <h1 className="text-5xl font-black tracking-tighter mb-2">
                    Welcome, <span className="gradient-text">Farmer</span>
                  </h1>
                  <p className="text-text-muted text-base">Let's start with the basics. This takes under 60 seconds.</p>
                </div>

                <div className="space-y-5">
                  <Field label="Your Full Name" icon={User}>
                    <div className="relative group">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. Rajan Kumar"
                        value={formData.name}
                        onChange={e => set('name', e.target.value)}
                        style={{ paddingLeft: '2.75rem' }}
                        autoFocus
                      />
                    </div>
                  </Field>

                  <Field label="City & Country (Global Autocomplete)" icon={MapPin}>
                    <div className="relative group" ref={locationRef}>
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search any city globally..."
                        value={locationQuery}
                        onChange={handleLocationChange}
                        onFocus={() => locationQuery.length >= 3 && setShowSuggestions(true)}
                        style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                        autoComplete="off"
                      />
                      {isSearchingLocation && (
                        <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-spin pointer-events-none" />
                      )}
                      
                      {/* Dropdown Suggestions */}
                      <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute left-0 right-0 top-full mt-2 bg-background border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl backdrop-blur-3xl"
                          >
                            {suggestions.map((loc) => (
                              <div 
                                key={loc.place_id}
                                onClick={() => selectLocation(loc)}
                                className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0 flex items-start gap-3"
                              >
                                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                                <div>
                                  <span className="text-sm font-bold leading-tight block">
                                    {(() => {
                                      const addr = loc.address || {};
                                      const city = addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || loc.display_name.split(',')[0];
                                      const state = addr.state || '';
                                      const country = addr.country || '';
                                      return [city, state, country].filter(Boolean).join(', ');
                                    })()}
                                  </span>
                                  <span className="text-[10px] text-text-muted capitalize">{loc.type}</span>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <p className="text-[11px] text-text-muted/60 mt-1.5 ml-1">Powered by OpenStreetMap API for 100% accurate global locations.</p>
                  </Field>
                </div>

                {/* Name preview card */}
                {formData.name && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary font-black text-xl border-2 border-primary/30">
                      {formData.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black">{formData.name}</p>
                      <p className="text-sm text-text-muted">{formData.location || 'Global'}</p>
                    </div>
                    <CheckCircle2 size={22} className="text-primary ml-auto" />
                  </motion.div>
                )}

                {errorMsg && (
                  <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-error text-sm font-bold bg-error/10 border border-error/20 px-4 py-3 rounded-xl"
                  >
                    <AlertCircle size={16} /> {errorMsg}
                  </motion.p>
                )}

                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="btn btn-primary w-full py-5 text-lg font-black group"
                  style={{ borderRadius: '18px', boxShadow: '0 20px 50px -12px rgba(16,185,129,0.45)' }}
                >
                  Continue to Farm Details
                  <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
                </motion.button>
              </motion.form>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full text-accent text-xs font-black uppercase tracking-widest mb-4">
                    <Sprout size={12} /> Step 2 of 2 — Farm Details
                  </div>
                  <h1 className="text-5xl font-black tracking-tighter mb-2">
                    About Your <span className="gradient-text">Farm</span>
                  </h1>
                  <p className="text-text-muted text-base">This powers your personalized AI advisories and yield predictions.</p>
                </div>

                {/* Land Size */}
                <Field label="Land Size" icon={Maximize2}>
                  <div className="relative group">
                    <Maximize2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                      type="number" placeholder="e.g. 2.5" min="0.1" step="0.1"
                      value={formData.landSize} onChange={e => set('landSize', e.target.value)}
                      style={{ paddingLeft: '2.75rem', paddingRight: '5rem' }}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-text-muted pointer-events-none">acres</span>
                  </div>
                </Field>

                {/* Primary Crop — card grid */}
                <Field label="Primary Crop">
                  <div className="grid grid-cols-5 gap-2 mt-1">
                    {CROPS.map(crop => (
                      <motion.button
                        key={crop.value} type="button"
                        onClick={() => set('crop', crop.value)}
                        whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 text-center ${
                          formData.crop === crop.value
                            ? 'border-primary bg-primary/15 shadow-lg shadow-primary/20'
                            : 'border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/6'
                        }`}
                      >
                        <span className="text-2xl leading-none">{crop.emoji}</span>
                        <span className="text-[10px] font-black leading-tight">{crop.label}</span>
                        <span className="text-[8px] text-text-muted leading-none hidden sm:block">{crop.desc}</span>
                      </motion.button>
                    ))}
                  </div>
                </Field>

                {/* Irrigation — pill selector */}
                <Field label="Irrigation System" icon={Droplets}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {IRRIGATION.map(irr => (
                      <button
                        key={irr.value} type="button"
                        onClick={() => set('irrigation', irr.value)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
                          formData.irrigation === irr.value
                            ? 'border-primary bg-primary/15 text-white shadow-md shadow-primary/20'
                            : 'border-white/8 bg-white/3 text-text-muted hover:border-white/20'
                        }`}
                      >
                        <irr.icon size={20} className={formData.irrigation === irr.value ? 'text-primary' : ''} />
                        <span className="text-xs font-black">{irr.label}</span>
                        <span className="text-[9px] opacity-60">{irr.desc}</span>
                      </button>
                    ))}
                  </div>
                </Field>

                {/* Soil Type — pill selector */}
                <Field label="Soil Type" icon={Layers}>
                  <div className="flex flex-wrap gap-2">
                    {SOIL_TYPES.map(soil => (
                      <button
                        key={soil.value} type="button"
                        onClick={() => set('soilType', soil.value)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-bold ${
                          formData.soilType === soil.value
                            ? 'border-primary bg-primary/15 text-white'
                            : 'border-white/10 bg-white/5 text-text-muted hover:border-white/20'
                        }`}
                      >
                        <soil.icon size={14} className={formData.soilType === soil.value ? 'text-primary' : ''} />
                        {soil.label}
                      </button>
                    ))}
                  </div>
                </Field>

                {errorMsg && (
                  <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-error text-sm font-bold bg-error/10 border border-error/20 px-4 py-3 rounded-xl"
                  >
                    <AlertCircle size={16} /> {errorMsg}
                  </motion.p>
                )}

                <div className="flex gap-3">
                  <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { setStep(1); setErrorMsg(''); }}
                    className="btn btn-secondary px-6 py-5 text-base font-black"
                    style={{ borderRadius: '18px' }}
                  >
                    <ArrowLeft size={18} /> Back
                  </motion.button>

                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="btn btn-primary flex-1 py-5 text-lg font-black group"
                    style={{ borderRadius: '18px', boxShadow: '0 20px 50px -12px rgba(16,185,129,0.45)' }}
                  >
                    <Sparkles size={20} />
                    Launch My Farm AI
                    <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                  </motion.button>
                </div>
              </motion.form>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
