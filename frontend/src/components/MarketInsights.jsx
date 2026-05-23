import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, TrendingUp, TrendingDown, RefreshCcw, Landmark, MapPin, IndianRupee, Sparkles, X, Loader2 } from 'lucide-react';
import { useFarmer } from '../context/FarmerContext';
import { useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const MarketInsights = () => {
  const { profile } = useFarmer();
  const [marketData, setMarketData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);

  const fetchMarketRates = async () => {
    setIsRefreshing(true);
    try {
      const location = profile?.location || 'Global';
      const response = await fetch(`${BACKEND_URL}/ml/market-rates?location=${encodeURIComponent(location)}`);
      const data = await response.json();
      setMarketData(data);
    } catch (err) {
      console.error("Failed to fetch market rates", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchMarketRatesEffect = async () => {

      try {
        const location = profile?.location || 'Global';
        const response = await fetch(`${BACKEND_URL}/ml/market-rates?location=${encodeURIComponent(location)}`);
        const data = await response.json();
        if (isMounted) setMarketData(data);
      } catch (err) {
        console.error("Failed to fetch market rates", err);
      }
    };
    fetchMarketRatesEffect();
    return () => { isMounted = false; };
  }, [profile?.location]);

  const handleRefresh = () => {
    fetchMarketRates();
  };

  const getForecast = async (crop) => {
    setSelectedCrop(crop);
    setIsLoadingForecast(true);
    try {
      const response = await fetch(`${BACKEND_URL}/ml/market-forecast?crop=${encodeURIComponent(crop)}`);
      const data = await response.json();
      setForecastData(data);
    } catch (err) {
      console.error("Failed to fetch forecast", err);
    } finally {
      setIsLoadingForecast(false);
    }
  };

  return (
    <div className="main-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-[10px] font-black uppercase tracking-widest mb-4">
            <LineChart size={12} /> Pan-India Intelligence
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Live <span className="text-secondary">Market Rates</span></h2>
          <p className="text-text-muted mt-2">Check accurate commodity prices for any district in India.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group min-w-[250px]">
            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-secondary transition-colors" />
            <input 
              type="text" 
              placeholder="Search District (e.g. Nashik, Ludhiana)" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-secondary/50 focus:bg-white/10 transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = e.target.value.trim();
                  if (val) {
                    setIsRefreshing(true);
                    fetch(`${BACKEND_URL}/ml/market-rates?location=${encodeURIComponent(val)}`)
                      .then(res => res.json())
                      .then(data => {
                        setMarketData(data);
                        setIsRefreshing(false);
                      });
                  }
                }
              }}
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="btn btn-secondary h-12 px-6 flex items-center gap-2"
          >
            <RefreshCcw size={16} className={isRefreshing ? 'animate-spin text-secondary' : ''} />
            {isRefreshing ? 'Syncing...' : 'Refresh'}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketData.length > 0 ? marketData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="glass rounded-3xl flex flex-col group relative overflow-hidden p-8 border border-white/5 hover:border-white/20 transition-all duration-300"
          >
            <div className={`absolute -right-20 -top-20 w-48 h-48 rounded-full blur-[100px] opacity-10 transition-all duration-700 group-hover:opacity-30 ${item.up ? 'bg-success' : 'bg-error'}`} />

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="flex items-center gap-3 text-[10px] font-black text-text-muted uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <Landmark size={14} className="text-secondary" /> {item.crop}
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-lg ${item.up ? 'text-success bg-success/10 border border-success/20' : 'text-error bg-error/10 border border-error/20'}`}>
                {item.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {item.trend}
              </div>
            </div>

            <div className="relative z-10 flex-grow flex flex-col justify-center mb-10">
              <div className="flex items-baseline gap-2">
                <IndianRupee size={28} className={item.up ? 'text-success' : 'text-error'} strokeWidth={3} />
                <span className="text-6xl font-black tracking-tighter">{item.price}</span>
                <span className="text-text-muted font-black text-xs uppercase tracking-widest">{item.unit}</span>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-text-muted relative z-10 font-bold">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-secondary" /> {item.location}
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => getForecast(item.crop)}
                className="flex items-center gap-2 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl transition-colors font-black uppercase tracking-widest"
              >
                <Sparkles size={14} /> AI Forecast
              </motion.button>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-text-muted">
            <Loader2 size={48} className="animate-spin mb-4" />
            <p className="font-black uppercase tracking-widest text-sm">Syncing with Global Markets...</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCrop && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-2xl relative overflow-hidden"
            >
              <button onClick={() => setSelectedCrop(null)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <LineChart size={24} className="text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">{selectedCrop} AI Forecast</h3>
                  <p className="text-text-muted text-sm flex items-center gap-2">
                    <TrendingUp size={14} /> Predictive Time-Series Model (7-Day)
                  </p>
                </div>
              </div>

              {isLoadingForecast ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-4">
                  <RefreshCcw size={32} className="text-secondary animate-spin" />
                  <p className="text-text-muted animate-pulse">Running ARIMA Models...</p>
                </div>
              ) : forecastData ? (
                <div className="space-y-6">
                  <div className={`p-4 rounded-2xl flex items-center justify-between border ${
                    forecastData.recommendation === 'Hold' ? 'bg-warning/10 border-warning/20' : 'bg-success/10 border-success/20'
                  }`}>
                    <div>
                      <p className="text-xs uppercase tracking-widest font-bold opacity-70 mb-1">AI Recommendation</p>
                      <p className={`text-xl font-black ${forecastData.recommendation === 'Hold' ? 'text-warning' : 'text-success'}`}>
                        {forecastData.recommendation}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-widest font-bold opacity-70 mb-1">Model Confidence</p>
                      <p className="text-xl font-black">{forecastData.confidence}%</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {forecastData.forecast_7_days.map((day, i) => {

                      const minPrice = Math.min(...forecastData.forecast_7_days.map(d => d.predicted_price));
                      const maxPrice = Math.max(...forecastData.forecast_7_days.map(d => d.predicted_price));
                      const widthPercent = ((day.predicted_price - minPrice * 0.95) / (maxPrice - minPrice * 0.95)) * 100;

                      return (
                        <div key={i} className="flex items-center gap-4">
                          <span className="w-10 text-xs font-bold text-text-muted">{day.day}</span>
                          <div className="flex-1 h-8 bg-white/5 rounded-r-lg flex items-center">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${widthPercent}%` }}
                              transition={{ delay: i * 0.1, duration: 0.8 }}
                              className="h-full bg-gradient-to-r from-secondary/40 to-secondary rounded-r-lg relative"
                            >
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-black">
                                ₹{day.predicted_price.toFixed(0)}
                              </span>
                            </motion.div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card-warning mt-4 p-8 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex-1">
          <h3 className="text-2xl font-black mb-2">Smart Revenue Estimator</h3>
          <p className="text-text-muted text-sm">Enter your expected yield to calculate estimated revenue based on today's live mandi prices. Lock in profits with data-driven selling.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <input type="number" placeholder="Yield Quantity..." className="bg-background/50 border-white/10 max-w-[200px]" />
          <button className="btn bg-secondary text-black hover:bg-secondary/90 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            Calculate
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MarketInsights;
