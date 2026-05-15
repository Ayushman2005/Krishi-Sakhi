import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Droplets, Thermometer, FlaskConical, Wind, ArrowRight, BarChart3, AlertCircle } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
          {inputFields.map((field, idx) => (
            <motion.div 
              key={field.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="space-y-1.5 group"
            >
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5 group-focus-within:text-[#f59e0b] transition-colors">
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/10 focus:outline-none focus:border-[#f59e0b]/50 focus:bg-white/10 transition-all"
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
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(245,158,11,0.2)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn bg-[#f59e0b] hover:bg-[#f59e0b]/90 text-black py-5 flex justify-center items-center gap-3 shadow-[0_10px_20px_rgba(245,158,11,0.2)] disabled:opacity-50 text-lg font-black rounded-2xl"
        >
          {isLoading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <FlaskConical size={24} />
            </motion.div>
          ) : (
            <>
              Run AI Diagnostics <ArrowRight size={20} />
            </>
          )}
        </motion.button>
      </div>

      {/* Results Column */}
      <div className="flex-1 lg:max-w-md">
        <div className="h-full glass rounded-3xl p-8 flex flex-col relative overflow-hidden group">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#f59e0b]/5 rounded-full blur-[80px] group-hover:bg-[#f59e0b]/10 transition-colors" />
          
          <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-8 flex items-center gap-2 relative z-10">
            <BarChart3 size={16} className="text-[#f59e0b]" /> Analysis Output
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
                  className="w-28 h-28 bg-[#f59e0b]/10 rounded-[40px] mx-auto flex items-center justify-center mb-6 border border-[#f59e0b]/20 shadow-2xl relative"
                >
                  <div className="absolute inset-0 bg-[#f59e0b]/20 blur-2xl rounded-full" />
                  <Sprout size={48} className="text-[#f59e0b] relative z-10" />
                </motion.div>
                <p className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-black mb-2">Optimal Selection</p>
                <h2 className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl">{prediction.prediction}</h2>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white/10 shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-text-muted">Confidence Level</span>
                  <span className="text-lg font-black text-success">{(prediction.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${prediction.confidence * 100}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-[#f59e0b] to-success rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
                <p className="text-[9px] text-text-muted mt-4 text-center font-bold uppercase tracking-widest opacity-60">
                  Engineered with {prediction.model}
                </p>
              </div>

              {prediction.alternatives && prediction.alternatives.length > 0 && (
                <div className="mt-auto">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-text-muted mb-4">Backup Recommendations</p>
                  <div className="flex flex-wrap gap-2">
                    {prediction.alternatives.map((alt, idx) => (
                      <motion.span 
                        key={idx} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-black hover:bg-white/10 hover:border-[#f59e0b]/30 transition-all cursor-default"
                      >
                        {alt}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 animate-pulse">
                <Sprout size={32} className="text-text-muted opacity-30" />
              </div>
              <p className="font-black text-2xl mb-3 tracking-tight">System Ready</p>
              <p className="text-sm text-text-muted max-w-[240px] leading-relaxed">
                Feed the neural network your soil metrics to generate a predictive profile.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default CropRecommender;
