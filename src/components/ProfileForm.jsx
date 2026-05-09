import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFarmer } from '../context/FarmerContext';
import { User, MapPin, Sprout, Droplets, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

const ProfileForm = () => {
  const { updateProfile } = useFarmer();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    landSize: '',
    crop: 'Paddy',
    soilType: 'Alluvial',
    irrigation: 'Drip'
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (step === 1) {
      if (!formData.name.trim() || !formData.location.trim()) {
        setErrorMsg('Please fill in all personal details.');
        return;
      }
      setStep(2);
    } else {
      if (!formData.landSize.trim()) {
        setErrorMsg('Please specify your land size.');
        return;
      }
      updateProfile(formData);
    }
  };

  const steps = [
    { id: 1, title: 'Personal Info', description: 'Tell us who you are' },
    { id: 2, title: 'Farm Details', description: 'Tell us about your land' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-12 max-w-3xl mx-auto mt-10 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <header className="text-center mb-12">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-bold mb-4"
          >
            <Sparkles size={16} /> Welcome to Krishi Sakhi
          </motion.div>
          <h2 className="text-5xl font-black mb-4 gradient-text">Start Your Journey</h2>
          <p className="text-text-muted text-lg max-w-md mx-auto">Help us personalize your digital farming companion for the best results.</p>
        </header>

        {/* Progress Bar */}
        <div className="flex justify-between mb-12 relative max-w-sm mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2" />
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: step === 1 ? '50%' : '100%' }}
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-500" 
          />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                step >= s.id ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'bg-background border-white/10 text-text-muted'
              }`}>
                {step > s.id ? <CheckCircle size={20} /> : s.id}
              </div>
              <span className={`text-xs font-bold mt-2 uppercase tracking-widest ${step >= s.id ? 'text-primary' : 'text-text-muted'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-text-muted">Farmer's Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      required
                      className="pl-12 py-4 bg-white/5 border-white/10 text-lg focus:bg-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-text-muted">Regional Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="District, Taluk"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      required
                      className="pl-12 py-4 bg-white/5 border-white/10 text-lg focus:bg-white/10"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-text-muted">Land Size (Acres)</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="number" 
                      placeholder="e.g. 2.5"
                      step="0.1"
                      min="0.1"
                      value={formData.landSize}
                      onChange={e => setFormData({...formData, landSize: e.target.value})}
                      required
                      className="pl-12 py-4 bg-white/5 border-white/10 text-lg focus:bg-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-text-muted">Primary Crop</label>
                  <div className="relative group">
                    <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                    <select 
                      value={formData.crop}
                      onChange={e => setFormData({...formData, crop: e.target.value})}
                      className="pl-12 py-4 bg-white/5 border-white/10 text-lg focus:bg-white/10 appearance-none"
                    >
                      <option value="Paddy">Paddy Rice</option>
                      <option value="Coconut">Coconut Palm</option>
                      <option value="Rubber">Natural Rubber</option>
                      <option value="Vegetables">Mixed Vegetables</option>
                      <option value="Banana">Banana Plantation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-text-muted">Irrigation System</label>
                  <div className="relative group">
                    <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                    <select 
                      value={formData.irrigation}
                      onChange={e => setFormData({...formData, irrigation: e.target.value})}
                      className="pl-12 py-4 bg-white/5 border-white/10 text-lg focus:bg-white/10 appearance-none"
                    >
                      <option value="Drip">Drip Irrigation</option>
                      <option value="Sprinkler">Overhead Sprinkler</option>
                      <option value="Manual">Manual Watering</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-error text-center font-bold text-sm bg-error/10 py-3 rounded-xl border border-error/20"
            >
              {errorMsg}
            </motion.div>
          )}

          <div className="pt-8">
            <button type="submit" className="btn btn-primary w-full py-5 text-xl group shadow-[0_20px_50px_rgba(16,185,129,0.3)]">
              {step === 1 ? 'Next Step' : 'Launch My Farm'} 
              <ArrowRight size={24} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </button>
            {step === 2 && (
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="w-full mt-4 text-text-muted hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
              >
                Go Back
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ProfileForm;
