import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Droplets, Thermometer, FlaskConical, Wind, ArrowRight, BarChart3, AlertCircle } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8000';

const CropRecommender = () => {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async () => {
    // Basic validation
    for (const key in formData) {
      if (formData[key] === '') {
        setError('Please fill out all parameters.');
        return;
      }
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/ml/crop-recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nitrogen: parseFloat(formData.nitrogen),
          phosphorus: parseFloat(formData.phosphorus),
          potassium: parseFloat(formData.potassium),
          temperature: parseFloat(formData.temperature),
          humidity: parseFloat(formData.humidity),
          ph: parseFloat(formData.ph),
          rainfall: parseFloat(formData.rainfall),
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

  const inputFields = [
    { name: 'nitrogen', label: 'Nitrogen (N)', icon: FlaskConical, placeholder: 'e.g., 90', unit: 'kg/ha' },
    { name: 'phosphorus', label: 'Phosphorus (P)', icon: FlaskConical, placeholder: 'e.g., 42', unit: 'kg/ha' },
    { name: 'potassium', label: 'Potassium (K)', icon: FlaskConical, placeholder: 'e.g., 43', unit: 'kg/ha' },
    { name: 'temperature', label: 'Temperature', icon: Thermometer, placeholder: 'e.g., 25.6', unit: '°C' },
    { name: 'humidity', label: 'Humidity', icon: Wind, placeholder: 'e.g., 82', unit: '%' },
    { name: 'ph', label: 'Soil pH', icon: AlertCircle, placeholder: 'e.g., 6.5', unit: 'pH' },
    { name: 'rainfall', label: 'Rainfall', icon: Droplets, placeholder: 'e.g., 202', unit: 'mm' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Input Form Column */}
      <div className="flex-1 space-y-6">
        <div>
          <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
            <Sprout className="text-[#f59e0b]" /> Soil Parameters
          </h3>
          <p className="text-text-muted text-sm">
            Enter your field's soil chemistry and climate data to predict the most suitable crop.
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-bold flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inputFields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <field.icon size={12} className="text-[#f59e0b]" />
                {field.label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[#f59e0b]/50 transition-colors"
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
          className="w-full btn bg-[#f59e0b] hover:bg-[#f59e0b]/90 text-black py-4 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50"
        >
          {isLoading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <Sprout size={20} />
            </motion.div>
          ) : (
            <>
              Run Random Forest Model <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>

      {/* Results Column */}
      <div className="flex-1 lg:max-w-md">
        <div className="h-full bg-black/20 rounded-3xl border border-white/5 p-6 flex flex-col">
          <h4 className="text-sm font-black uppercase tracking-widest text-text-muted mb-6 flex items-center gap-2">
            <BarChart3 size={16} /> AI Output
          </h4>

          {prediction ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-[#f59e0b]/10 rounded-full mx-auto flex items-center justify-center mb-4 border border-[#f59e0b]/20">
                  <Sprout size={40} className="text-[#f59e0b]" />
                </div>
                <p className="text-sm text-text-muted uppercase tracking-widest font-bold mb-1">Recommended Crop</p>
                <h2 className="text-5xl font-black text-[#f59e0b]">{prediction.prediction}</h2>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 mb-6">
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
                  Based on {prediction.model} algorithm.
                </p>
              </div>

              {prediction.alternatives && prediction.alternatives.length > 0 && (
                <div className="mt-auto">
                  <p className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3">Suitable Alternatives</p>
                  <div className="flex flex-wrap gap-2">
                    {prediction.alternatives.map((alt, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm font-bold">
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <Sprout size={64} className="mb-4 text-white/20" />
              <p className="font-bold text-lg mb-2">Awaiting Data</p>
              <p className="text-sm text-text-muted max-w-[200px]">
                Submit your soil profile to get AI-powered crop recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropRecommender;
