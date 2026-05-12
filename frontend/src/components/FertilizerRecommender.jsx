import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Beaker, Droplet, Thermometer, Wind, ArrowRight, Activity, AlertCircle, UploadCloud, Loader2 } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8000';

const FertilizerRecommender = () => {
  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    moisture: '',
    soil_type: 'Loamy',
    crop_type: 'Wheat',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOCRUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formDataObj = new FormData();
    formDataObj.append('file', file);
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/ml/soil-report-ocr`, {
        method: 'POST',
        body: formDataObj,
      });
      if (!response.ok) throw new Error('OCR Failed');
      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        nitrogen: data.nitrogen_kg_ha ?? prev.nitrogen,
        phosphorus: data.phosphorus_kg_ha ?? prev.phosphorus,
        potassium: data.potassium_kg_ha ?? prev.potassium,
      }));
    } catch(err) {
      setError("OCR failed to read the document. Please enter manually.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredict = async () => {
    // Basic validation for numbers
    const numFields = ['temperature', 'humidity', 'moisture', 'nitrogen', 'phosphorus', 'potassium'];
    for (const key of numFields) {
      if (formData[key] === '') {
        setError('Please fill out all numeric parameters.');
        return;
      }
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/ml/fertilizer-recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temperature: parseFloat(formData.temperature),
          humidity: parseFloat(formData.humidity),
          moisture: parseFloat(formData.moisture),
          soil_type: formData.soil_type,
          crop_type: formData.crop_type,
          nitrogen: parseFloat(formData.nitrogen),
          phosphorus: parseFloat(formData.phosphorus),
          potassium: parseFloat(formData.potassium),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendation');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error(err);
      setError('An error occurred while running the ML model.');
    } finally {
      setIsLoading(false);
    }
  };

  const numFields = [
    { name: 'nitrogen', label: 'Nitrogen (N)', icon: Beaker, placeholder: 'e.g., 37', unit: '' },
    { name: 'phosphorus', label: 'Phosphorus (P)', icon: Beaker, placeholder: 'e.g., 0', unit: '' },
    { name: 'potassium', label: 'Potassium (K)', icon: Beaker, placeholder: 'e.g., 0', unit: '' },
    { name: 'temperature', label: 'Temperature', icon: Thermometer, placeholder: 'e.g., 26.0', unit: '°C' },
    { name: 'humidity', label: 'Humidity', icon: Wind, placeholder: 'e.g., 52', unit: '%' },
    { name: 'moisture', label: 'Soil Moisture', icon: Droplet, placeholder: 'e.g., 38', unit: '%' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Input Form Column */}
      <div className="flex-1 space-y-6">
        <div>
          <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
            <Activity className="text-[#ec4899]" /> Soil & Crop Profile
          </h3>
          <p className="text-text-muted text-sm mb-4">
            Input soil properties and crop type to receive precision fertilizer recommendations.
          </p>
          <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#ec4899]/10 hover:bg-[#ec4899]/20 text-[#ec4899] rounded-full text-sm font-black transition-colors border border-[#ec4899]/20 cursor-pointer">
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
            Auto-fill with Soil Report
            <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleOCRUpload} disabled={isLoading} />
          </label>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-bold flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1.5 group"
          >
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5 group-focus-within:text-[#ec4899] transition-colors">
              <Activity size={12} /> Soil Type
            </label>
            <select
              name="soil_type"
              value={formData.soil_type}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ec4899]/50 transition-all appearance-none cursor-pointer"
            >
              {['Sandy', 'Loamy', 'Black', 'Red', 'Clayey'].map(type => (
                <option key={type} value={type} className="bg-[#111111]">{type}</option>
              ))}
            </select>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-1.5 group"
          >
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5 group-focus-within:text-[#ec4899] transition-colors">
              <Activity size={12} /> Crop Type
            </label>
            <select
              name="crop_type"
              value={formData.crop_type}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ec4899]/50 transition-all appearance-none cursor-pointer"
            >
              {['Maize', 'Sugarcane', 'Cotton', 'Tobacco', 'Paddy', 'Barley', 'Wheat', 'Millets', 'Oil seeds', 'Pulses', 'Ground Nuts'].map(type => (
                <option key={type} value={type} className="bg-[#111111]">{type}</option>
              ))}
            </select>
          </motion.div>

          {numFields.map((field, idx) => (
            <motion.div 
              key={field.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              className="space-y-1.5 group"
            >
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5 group-focus-within:text-[#ec4899] transition-colors">
                <field.icon size={12} />
                {field.label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/10 focus:outline-none focus:border-[#ec4899]/50 focus:bg-white/10 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-muted uppercase tracking-widest opacity-50">
                  {field.unit}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          onClick={handlePredict}
          disabled={isLoading}
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(236,72,153,0.2)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn bg-[#ec4899] hover:bg-[#ec4899]/90 text-white py-5 flex justify-center items-center gap-3 shadow-[0_10px_20px_rgba(236,72,153,0.2)] disabled:opacity-50 text-lg font-black rounded-2xl border-none"
        >
          {isLoading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <Beaker size={24} />
            </motion.div>
          ) : (
            <>
              Optimize Fertilizer Plan <ArrowRight size={20} />
            </>
          )}
        </motion.button>
      </div>

      {/* Results Column */}
      <div className="flex-1 lg:max-w-md">
        <div className="h-full glass rounded-3xl p-8 flex flex-col relative overflow-hidden group">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ec4899]/5 rounded-full blur-[80px] group-hover:bg-[#ec4899]/10 transition-colors" />

          <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-8 flex items-center gap-2 relative z-10">
            <Beaker size={16} className="text-[#ec4899]" /> Optimal Blend Output
          </h4>

          {prediction ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col relative z-10"
            >
              <div className="text-center mb-10">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-28 h-28 bg-[#ec4899]/10 rounded-[40px] mx-auto flex items-center justify-center mb-6 border border-[#ec4899]/20 shadow-2xl relative"
                >
                  <div className="absolute inset-0 bg-[#ec4899]/20 blur-2xl rounded-full" />
                  <Beaker size={48} className="text-[#ec4899] relative z-10" />
                </motion.div>
                <p className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-black mb-2">Target Fertilizer</p>
                <h2 className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl">{prediction.prediction}</h2>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 mb-8 mt-auto border border-white/10 shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-text-muted">Prediction Confidence</span>
                  <span className="text-lg font-black text-success">{(prediction.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${prediction.confidence * 100}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-[#ec4899] to-success rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
                <p className="text-[9px] text-text-muted mt-4 text-center font-bold uppercase tracking-widest opacity-60">
                  Powered by {prediction.model}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 animate-pulse">
                <Beaker size={32} className="text-text-muted opacity-30" />
              </div>
              <p className="font-black text-2xl mb-3 tracking-tight">System Ready</p>
              <p className="text-sm text-text-muted max-w-[240px] leading-relaxed">
                Provide soil nutrients and crop data to calculate the optimal fertilization strategy.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default FertilizerRecommender;
