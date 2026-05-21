import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Thermometer, Wind, Droplets, Loader2, Sun, CloudRain, Zap, Eye } from 'lucide-react';
import { useFarmer } from '../context/FarmerContext';

const ICON_MAP = {
  Cloud,
  Thermometer,
  Wind,
  Droplets,
  Loader2,
  Sun,
  CloudRain,
  Zap,
  Eye
};

const getIcon = (iconProp) => {
  if (!iconProp) return <Sun size={26} />;
  if (typeof iconProp === 'string') {
    const Component = ICON_MAP[iconProp] || Sun;
    return <Component size={26} />;
  }
  const Component = iconProp;
  return <Component size={26} />;
};

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const CROP_RISK_MATRIX = {
  Paddy: {
    high_rain: { risk: 'high', action: 'Drain excess water from paddies. Check bund integrity.' },
    drought: { risk: 'medium', action: 'Activate drip/sprinkler. Apply mulch to conserve soil moisture.' },
    high_temp: { risk: 'medium', action: 'Irrigate in early morning. Avoid midday activities.' },
    high_wind: { risk: 'low', action: 'Monitor for lodging risk. Stake tall varieties if needed.' },
    humid: { risk: 'high', action: 'Blast disease risk elevated. Apply preventive fungicide.' },
  },
  Coconut: {
    high_rain: { risk: 'low', action: 'Ensure proper drainage at base of trees.' },
    drought: { risk: 'high', action: 'Deep water every 4-5 days. Mulch with dry leaves.' },
    high_temp: { risk: 'low', action: 'Coconuts are heat-tolerant. No immediate action needed.' },
    high_wind: { risk: 'high', action: 'Secure young plants. Harvest mature nuts to prevent damage.' },
    humid: { risk: 'medium', action: 'Monitor for bud rot. Spray Bordeaux mixture preventively.' },
  },
};

const WeatherCard = ({ icon: Icon, label, value, unit, colorClass }) => (
  <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center gap-4">
    <div className={`p-3 rounded-xl ${colorClass} bg-opacity-20`}>
      <Icon size={22} className={colorClass} />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</p>
      <p className="text-xl font-black">{value}<span className="text-sm font-bold text-text-muted ml-1">{unit}</span></p>
    </div>
  </div>
);

const WeatherAdvisor = () => {
  const { profile } = useFarmer();
  const [weather, setWeather] = useState({
    temperature: 28,
    humidity: 75,
    rainfall_mm: 0,
    wind_speed: 10,
    uv_index: 5,
    forecast: 'Partly Cloudy',
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setWeather(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFetchLiveWeather = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/weather/live`);
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      setWeather(prev => ({
        ...prev,
        temperature: data.temperature,
        humidity: data.humidity,
        rainfall_mm: data.rainfall_mm,
        wind_speed: data.wind_speed,
        forecast: data.description,
      }));
    } catch {
      console.error("Failed to fetch live weather");
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherRisk = (w, crop) => {
    const matrix = CROP_RISK_MATRIX[crop] || CROP_RISK_MATRIX.Paddy;
    const risks = [];
    if (parseFloat(w.rainfall_mm) > 50) risks.push({ ...matrix.high_rain, label: 'Heavy Rainfall Alert', icon: CloudRain });
    if (parseFloat(w.rainfall_mm) === 0 && parseFloat(w.humidity) < 50) risks.push({ ...matrix.drought, label: 'Drought Stress', icon: Sun });
    if (parseFloat(w.temperature) > 35) risks.push({ ...matrix.high_temp, label: 'Heat Stress', icon: Thermometer });
    if (parseFloat(w.wind_speed) > 40) risks.push({ ...matrix.high_wind, label: 'High Wind Warning', icon: Wind });
    if (parseFloat(w.humidity) > 80) risks.push({ ...matrix.humid, label: 'High Humidity', icon: Droplets });
    if (!risks.length) risks.push({ risk: 'low', action: 'Conditions are favorable. Proceed with planned farm activities.', label: 'All Clear', icon: Sun });
    return risks;
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}/ml/weather-advisory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...weather, crop: profile?.crop || 'Paddy', location: profile?.location || 'Global' }),
      });
      if (!response.ok) throw new Error('Server error');
      setResult(await response.json());
    } catch {
      // Offline demo using local risk matrix
      const risks = getWeatherRisk(weather, profile?.crop || 'Paddy');
      const overallRisk = risks.some(r => r.risk === 'high') ? 'high' : risks.some(r => r.risk === 'medium') ? 'medium' : 'low';
      setResult({
        overall_risk: overallRisk,
        alerts: risks,
        best_time_to_spray: parseFloat(weather.wind_speed) < 15 && parseFloat(weather.humidity) < 75 ? 'Early morning (6–9 AM)' : 'Delay spraying — conditions unfavorable.',
        irrigation_needed: parseFloat(weather.rainfall_mm) < 5 && parseFloat(weather.humidity) < 60,
        mode: 'demo',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const riskColors = { high: 'text-error border-error/20 bg-error/5', medium: 'text-warning border-warning/20 bg-warning/5', low: 'text-success border-success/20 bg-success/5' };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full text-blue-400 text-xs font-black uppercase tracking-widest mb-4">
          <Zap size={14} /> Weather NLP Advisor
        </div>
        <h2 className="text-4xl font-black tracking-tighter mb-2">Climate Risk Advisor</h2>
        <p className="text-text-muted mb-4">Input current weather conditions to get AI-generated farm safety advisories</p>
        <button 
          type="button"
          onClick={handleFetchLiveWeather}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full text-white text-sm font-black transition-colors border border-white/10"
        >
          <Cloud size={16} /> Auto-fill via Live API
        </button>
      </div>

      <form onSubmit={handleAnalyze} className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Temperature (°C)', name: 'temperature', min: 10, max: 50 },
            { label: 'Humidity (%)', name: 'humidity', min: 0, max: 100 },
            { label: 'Rainfall (mm)', name: 'rainfall_mm', min: 0, max: 500 },
            { label: 'Wind Speed (km/h)', name: 'wind_speed', min: 0, max: 200 },
            { label: 'UV Index', name: 'uv_index', min: 0, max: 11 },
          ].map(field => (
            <div key={field.name} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{field.label}</label>
              <input type="number" name={field.name} value={weather[field.name]} onChange={handleChange}
                min={field.min} max={field.max}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          ))}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Sky Condition</label>
            <select name="forecast" value={weather.forecast} onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 transition-all"
            >
              {['Sunny', 'Partly Cloudy', 'Overcast', 'Light Rain', 'Heavy Rain', 'Thunderstorm'].map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Live Preview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <WeatherCard icon={Thermometer} label="Temperature" value={weather.temperature} unit="°C" colorClass="text-orange-400" />
          <WeatherCard icon={Droplets} label="Humidity" value={weather.humidity} unit="%" colorClass="text-blue-400" />
          <WeatherCard icon={Wind} label="Wind" value={weather.wind_speed} unit="km/h" colorClass="text-slate-300" />
          <WeatherCard icon={CloudRain} label="Rainfall" value={weather.rainfall_mm} unit="mm" colorClass="text-primary" />
          <WeatherCard icon={Sun} label="UV Index" value={weather.uv_index} unit="" colorClass="text-yellow-400" />
          <WeatherCard icon={Eye} label="Forecast" value={weather.forecast} unit="" colorClass="text-purple-400" />
        </div>

        <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="btn btn-primary w-full py-5 text-lg font-black disabled:opacity-40 disabled:grayscale"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}
        >
          {isLoading ? <><Loader2 size={22} className="animate-spin" /> Generating Advisory...</> : <><Cloud size={22} /> Generate Advisory</>}
        </motion.button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {result.mode === 'demo' && <p className="text-center text-xs text-warning font-bold bg-warning/10 border border-warning/20 py-2 px-4 rounded-xl">⚠ Demo Mode — Showing rule-based advisory. Backend offline.</p>}

            <div className={`p-6 rounded-3xl border ${riskColors[result.overall_risk]}`}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Overall Farm Risk</p>
              <p className="text-4xl font-black capitalize">{result.overall_risk} Risk</p>
            </div>

            <div className="space-y-4">
              {result.alerts?.map((alert, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className={`glass-card border-l-4 ${alert.risk === 'high' ? 'border-l-error' : alert.risk === 'medium' ? 'border-l-warning' : 'border-l-success'} flex gap-6`}
                >
                  <div className={`p-4 rounded-2xl shrink-0 ${alert.risk === 'high' ? 'bg-error/10 text-error' : alert.risk === 'medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                    {getIcon(alert.icon)}
                  </div>
                  <div>
                    <h4 className="font-black text-lg mb-1">{alert.label}</h4>
                    <p className="text-text-muted text-sm leading-relaxed">{alert.action}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Spray Window</p>
                <p className="font-black text-lg">{result.best_time_to_spray}</p>
              </div>
              <div className={`glass-card ${result.irrigation_needed ? 'border-warning/30 bg-warning/5' : ''}`}>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Irrigation Status</p>
                <p className="font-black text-lg">{result.irrigation_needed ? '💧 Irrigation Recommended' : '✅ Sufficient Moisture'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeatherAdvisor;
