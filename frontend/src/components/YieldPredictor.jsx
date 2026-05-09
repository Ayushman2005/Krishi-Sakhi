import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Sprout, Loader2, BarChart3, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useFarmer } from '../context/FarmerContext';

const BACKEND_URL = 'http://localhost:8000';

const CROP_BENCHMARKS = {
  Paddy: { unit: 'quintals/acre', avg: 20, good: 25, excellent: 30 },
  Coconut: { unit: 'nuts/tree/yr', avg: 60, good: 80, excellent: 100 },
  Rubber: { unit: 'kg/acre/yr', avg: 350, good: 500, excellent: 650 },
  Vegetables: { unit: 'quintals/acre', avg: 80, good: 120, excellent: 160 },
  Banana: { unit: 'bunches/acre', avg: 700, good: 900, excellent: 1100 },
};

const InputField = ({ label, name, type = 'number', value, onChange, unit, min, max, step, options }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{label} {unit && <span className="text-primary/60">({unit})</span>}</label>
    {options ? (
      <select name={name} value={value} onChange={onChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 transition-all">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input type={type} name={name} value={value} onChange={onChange} min={min} max={max} step={step} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 transition-all" />
    )}
  </div>
);

const YieldPredictor = () => {
  const { profile } = useFarmer();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    crop: profile?.crop || 'Paddy',
    land_size: profile?.landSize || 2,
    rainfall_mm: 1500,
    temperature_avg: 28,
    soil_ph: 6.5,
    nitrogen_kg_ha: 90,
    phosphorus_kg_ha: 45,
    potassium_kg_ha: 45,
    irrigation_type: profile?.irrigation || 'Drip',
    growth_stage: 'Tillering',
  });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePredict = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}/ml/yield-predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, land_size: parseFloat(formData.land_size) }),
      });
      if (!response.ok) throw new Error('Prediction failed.');
      setResult(await response.json());
    } catch {
      // Demo fallback
      const bench = CROP_BENCHMARKS[formData.crop] || CROP_BENCHMARKS.Paddy;
      const rainfall_factor = Math.min(formData.rainfall_mm / 1500, 1.2);
      const nutrient_score = (parseFloat(formData.nitrogen_kg_ha) + parseFloat(formData.phosphorus_kg_ha) + parseFloat(formData.potassium_kg_ha)) / (90 + 45 + 45);
      const raw = bench.avg * rainfall_factor * Math.min(nutrient_score, 1.3);
      const estimated = +(raw * parseFloat(formData.land_size)).toFixed(1);
      const potential = +(bench.good * parseFloat(formData.land_size)).toFixed(1);

      setResult({
        estimated_yield: estimated,
        potential_yield: potential,
        unit: bench.unit,
        efficiency: +((estimated / potential) * 100).toFixed(1),
        recommendations: [
          nutrient_score < 0.9 ? 'Increase NPK application to reach optimal ratios.' : 'Nutrient levels are well balanced.',
          formData.rainfall_mm < 1200 ? 'Supplement with irrigation during dry spells.' : 'Rainfall levels are adequate.',
          'Consider intercropping to maximize land use efficiency.',
        ],
        mode: 'demo',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bench = CROP_BENCHMARKS[formData.crop];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-xs font-black uppercase tracking-widest mb-4">
          <BarChart3 size={14} /> Regression ML Model
        </div>
        <h2 className="text-4xl font-black tracking-tighter mb-2">Crop Yield Predictor</h2>
        <p className="text-text-muted">Enter agronomic parameters to forecast your harvest output</p>
      </div>

      <form onSubmit={handlePredict} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Primary Crop" name="crop" options={Object.keys(CROP_BENCHMARKS)} value={formData.crop} onChange={handleChange} />
          <InputField label="Land Size" name="land_size" unit="acres" value={formData.land_size} onChange={handleChange} min="0.1" step="0.1" />
          <InputField label="Annual Rainfall" name="rainfall_mm" unit="mm" value={formData.rainfall_mm} onChange={handleChange} min="0" />
          <InputField label="Avg. Temperature" name="temperature_avg" unit="°C" value={formData.temperature_avg} onChange={handleChange} min="15" max="45" />
          <InputField label="Soil pH" name="soil_ph" unit="pH" value={formData.soil_ph} onChange={handleChange} min="4.5" max="9" step="0.1" />
          <InputField label="Nitrogen" name="nitrogen_kg_ha" unit="kg/ha" value={formData.nitrogen_kg_ha} onChange={handleChange} min="0" />
          <InputField label="Phosphorus" name="phosphorus_kg_ha" unit="kg/ha" value={formData.phosphorus_kg_ha} onChange={handleChange} min="0" />
          <InputField label="Potassium" name="potassium_kg_ha" unit="kg/ha" value={formData.potassium_kg_ha} onChange={handleChange} min="0" />
          <InputField label="Irrigation System" name="irrigation_type" options={['Drip', 'Sprinkler', 'Manual', 'Flood']} value={formData.irrigation_type} onChange={handleChange} />
          <InputField label="Growth Stage" name="growth_stage" options={['Sowing', 'Seedling', 'Tillering', 'Panicle Init', 'Flowering', 'Maturity']} value={formData.growth_stage} onChange={handleChange} />
        </div>

        <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="btn btn-primary w-full py-5 text-lg font-black disabled:opacity-40 disabled:grayscale"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
        >
          {isLoading ? <><Loader2 size={22} className="animate-spin" /> Running Model...</> : <><TrendingUp size={22} /> Predict My Yield</>}
        </motion.button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {result.mode === 'demo' && (
              <p className="text-center text-xs text-warning font-bold bg-warning/10 border border-warning/20 py-2 px-4 rounded-xl">
                ⚠ Demo Mode — Showing heuristic estimate. Backend offline.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Estimated Yield', value: `${result.estimated_yield}`, sub: result.unit, color: 'from-primary to-primary-dark', icon: Sprout },
                { label: 'Potential Yield', value: `${result.potential_yield}`, sub: result.unit, color: 'from-accent to-purple-800', icon: TrendingUp },
                { label: 'Efficiency', value: `${result.efficiency}%`, sub: 'of potential', color: result.efficiency >= 80 ? 'from-success to-emerald-700' : 'from-warning to-amber-700', icon: BarChart3 },
              ].map((card, i) => (
                <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
                  className={`bg-gradient-to-br ${card.color} p-6 rounded-3xl text-white shadow-2xl`}
                >
                  <card.icon size={24} className="mb-4 opacity-60" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{card.label}</p>
                  <p className="text-3xl font-black">{card.value}</p>
                  <p className="text-xs opacity-60 font-bold">{card.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Efficiency Gauge Bar */}
            <div className="glass-card">
              <div className="flex justify-between items-center mb-3">
                <span className="font-black">Field Efficiency vs. Benchmark</span>
                <span className="text-xs font-bold text-text-muted">Regional avg: {bench?.avg} {bench?.unit}</span>
              </div>
              <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(result.efficiency, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${result.efficiency >= 80 ? 'bg-success' : result.efficiency >= 60 ? 'bg-primary' : 'bg-warning'}`}
                />
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass-card space-y-4">
              <h4 className="font-black flex items-center gap-2"><CheckCircle2 size={18} className="text-primary" /> AI Recommendations</h4>
              {result.recommendations?.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black text-[10px] mt-0.5 shrink-0">{i + 1}</div>
                  <p className="text-text-muted leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default YieldPredictor;
