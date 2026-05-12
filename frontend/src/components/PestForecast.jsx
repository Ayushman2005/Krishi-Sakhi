import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Thermometer, Droplet, CloudRain, AlertTriangle, Loader2 } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8000';

const PestForecast = () => {
  const [formData, setFormData] = useState({
    crop: 'Paddy',
    temperature: '',
    humidity: '',
    rainfall: '',
    growth_stage: 'Vegetative',
  });

  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!formData.temperature || !formData.humidity || !formData.rainfall) {
      setError("Please fill all numeric fields.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/ml/pest-forecast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: formData.crop,
          temperature: parseFloat(formData.temperature),
          humidity: parseFloat(formData.humidity),
          rainfall: parseFloat(formData.rainfall),
          growth_stage: formData.growth_stage,
        }),
      });

      if (!response.ok) throw new Error('Failed to forecast pests');
      setForecast(await response.json());
    } catch (err) {
      setError("An error occurred during forecasting.");
    } finally {
      setIsLoading(false);
    }
  };

  const riskColors = {
    High: 'text-error bg-error/10 border-error/20',
    Medium: 'text-warning bg-warning/10 border-warning/20',
    Low: 'text-success bg-success/10 border-success/20',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Input Form */}
      <div className="flex-1 space-y-6">
        <div>
          <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
            <Bug className="text-[#ef4444]" /> Outbreak Predictor
          </h3>
          <p className="text-text-muted text-sm">
            Input weather parameters to predict pest infestations before they happen.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-bold flex items-center gap-2">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted uppercase">Crop Type</label>
            <select name="crop" value={formData.crop} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
              {['Paddy', 'Cotton', 'Wheat', 'Sugarcane'].map(c => <option key={c} value={c} className="bg-background">{c}</option>)}
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted uppercase">Growth Stage</label>
            <select name="growth_stage" value={formData.growth_stage} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
              {['Seedling', 'Vegetative', 'Flowering', 'Maturity'].map(c => <option key={c} value={c} className="bg-background">{c}</option>)}
            </select>
          </div>

          {[
            { name: 'temperature', label: 'Temperature', icon: Thermometer, placeholder: '28' },
            { name: 'humidity', label: 'Humidity', icon: Droplet, placeholder: '80' },
            { name: 'rainfall', label: 'Rainfall (mm)', icon: CloudRain, placeholder: '25' },
          ].map(field => (
             <div key={field.name} className="space-y-1.5">
               <label className="text-xs font-bold text-text-muted uppercase flex items-center gap-1"><field.icon size={12}/> {field.label}</label>
               <input type="number" name={field.name} value={formData[field.name]} onChange={handleInputChange} placeholder={field.placeholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
             </div>
          ))}

          <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} className="md:col-span-2 btn bg-[#ef4444] text-white py-4 font-black rounded-xl border-none flex justify-center mt-2">
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Run Forecast"}
          </motion.button>
        </form>
      </div>

      {/* Results Box */}
      <div className="flex-1 lg:max-w-md">
        <div className="h-full glass rounded-3xl p-8 relative overflow-hidden">
          <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-6 flex items-center gap-2">
            <Bug size={16} className="text-[#ef4444]" /> Forecast Results
          </h4>

          {forecast ? (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {forecast.forecasts.map((f, i) => (
                  <div key={i} className={`p-4 rounded-2xl border ${riskColors[f.risk] || riskColors.Low}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-black text-lg">{f.pest}</h5>
                      <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-black/20">{f.risk} Risk</span>
                    </div>
                    <p className="text-xs opacity-80 mb-2">Expected Timeframe: <strong>{f.timeframe}</strong></p>
                    <p className="text-sm font-bold opacity-90">{f.action}</p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-[200px] opacity-50">
              <Bug size={48} className="mb-4" />
              <p className="font-bold">Awaiting Parameters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PestForecast;
