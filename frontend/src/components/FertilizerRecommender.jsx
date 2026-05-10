import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Beaker, Droplet, Thermometer, Wind, ArrowRight, Activity, AlertCircle } from 'lucide-react';

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
          <p className="text-text-muted text-sm">
            Input soil properties and crop type to receive precision fertilizer recommendations.
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-bold flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={12} className="text-[#ec4899]" /> Soil Type
            </label>
            <select
              name="soil_type"
              value={formData.soil_type}
              onChange={handleInputChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#ec4899]/50 transition-colors"
            >
              {['Sandy', 'Loamy', 'Black', 'Red', 'Clayey'].map(type => (
                <option key={type} value={type} className="bg-[#111111]">{type}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={12} className="text-[#ec4899]" /> Crop Type
            </label>
            <select
              name="crop_type"
              value={formData.crop_type}
              onChange={handleInputChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#ec4899]/50 transition-colors"
            >
              {['Maize', 'Sugarcane', 'Cotton', 'Tobacco', 'Paddy', 'Barley', 'Wheat', 'Millets', 'Oil seeds', 'Pulses', 'Ground Nuts'].map(type => (
                <option key={type} value={type} className="bg-[#111111]">{type}</option>
              ))}
            </select>
          </div>

          {numFields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <field.icon size={12} className="text-[#ec4899]" />
                {field.label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[#ec4899]/50 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
                  {field.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handlePredict}
          disabled={isLoading}
          className="w-full btn bg-[#ec4899] hover:bg-[#ec4899]/90 text-white py-4 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.3)] disabled:opacity-50 border-none"
        >
          {isLoading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <Activity size={20} />
            </motion.div>
          ) : (
            <>
              Run Gradient Boosting Model <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>

      {/* Results Column */}
      <div className="flex-1 lg:max-w-md">
        <div className="h-full bg-black/20 rounded-3xl border border-white/5 p-6 flex flex-col">
          <h4 className="text-sm font-black uppercase tracking-widest text-text-muted mb-6 flex items-center gap-2">
            <Beaker size={16} /> Target Fertilizer
          </h4>

          {prediction ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-[#ec4899]/10 rounded-full mx-auto flex items-center justify-center mb-4 border border-[#ec4899]/20">
                  <Beaker size={40} className="text-[#ec4899]" />
                </div>
                <p className="text-sm text-text-muted uppercase tracking-widest font-bold mb-1">Recommended Blend</p>
                <h2 className="text-5xl font-black text-[#ec4899]">{prediction.prediction}</h2>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 mb-6 mt-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-text-muted">Model Confidence</span>
                  <span className="text-sm font-black text-success">{(prediction.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${prediction.confidence * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-success rounded-full"
                  />
                </div>
                <p className="text-xs text-text-muted mt-3 text-center">
                  Powered by {prediction.model} algorithm.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <Beaker size={64} className="mb-4 text-white/20" />
              <p className="font-bold text-lg mb-2">Awaiting Parameters</p>
              <p className="text-sm text-text-muted max-w-[200px]">
                Enter NPK values and crop data to determine the optimal fertilizer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FertilizerRecommender;
