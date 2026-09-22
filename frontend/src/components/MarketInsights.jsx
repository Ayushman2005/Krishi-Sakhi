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

  const normalizeMarketData = (data) => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      for (const key of ['agricultural_commodities', 'commodities', 'market_data', 'rates', 'crops', 'data', 'items']) {
        if (Array.isArray(data[key])) return data[key];
      }
      const foundArray = Object.values(data).find(Array.isArray);
      if (foundArray) return foundArray;
    }
    return [];
  };

  const fetchMarketRates = async (overrideLocation) => {
    setIsRefreshing(true);
    try {
      const location = overrideLocation || profile?.location || 'Global';
      const response = await fetch(`${BACKEND_URL}/ml/market-rates?location=${encodeURIComponent(location)}`);
      const data = await response.json();
      setMarketData(normalizeMarketData(data));
    } catch (err) {
      console.error("Failed to fetch market rates", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchMarketRatesEffect = async () => {
      setIsRefreshing(true);
      try {
        const location = profile?.location || 'Global';
        const response = await fetch(`${BACKEND_URL}/ml/market-rates?location=${encodeURIComponent(location)}`);
        const data = await response.json();
        if (isMounted) setMarketData(normalizeMarketData(data));
      } catch (err) {
        console.error("Failed to fetch market rates", err);
      } finally {
        if (isMounted) setIsRefreshing(false);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 mb-6">
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-semibold uppercase tracking-wider mb-2">
            <LineChart size={12} /> Pan-India Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Live <span className="text-emerald-400">Market Rates</span></h2>
          <p className="text-text-muted mt-1 text-xs sm:text-sm">Check accurate commodity prices for any district in India.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
          <div className="relative group min-w-[220px]">
            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search District (e.g. Nashik, Ludhiana)" 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = e.target.value.trim();
                  if (val) {
                    fetchMarketRates(val);
                  }
                }
              }}
            />
          </div>
          <button 
            onClick={handleRefresh}
            className="btn btn-secondary h-9 px-4 text-xs font-semibold rounded-xl flex items-center gap-2"
          >
            <RefreshCcw size={14} className={isRefreshing ? 'animate-spin text-emerald-400' : ''} />
            {isRefreshing ? 'Syncing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketData.length > 0 ? marketData.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-2xl flex flex-col p-5 border border-white/10 hover:border-white/20 transition-all justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                  <Landmark size={13} className="text-emerald-400" /> {item.crop}
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${item.up ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                  {item.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {item.trend}
                </div>
              </div>

              <div className="my-4">
                <div className="flex items-baseline gap-1.5">
                  <IndianRupee size={20} className={item.up ? 'text-emerald-400' : 'text-rose-400'} />
                  <span className="text-3xl font-bold tracking-tight text-white font-mono">{item.price}</span>
                  <span className="text-text-muted text-xs font-medium ml-1">/ {item.unit}</span>
                </div>
              </div>
            </div>

            <div className="pt-3.5 mt-2 border-t border-white/5 flex items-center justify-between text-xs text-text-muted font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-400" /> {item.location}
              </div>
              <button 
                onClick={() => getForecast(item.crop)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-emerald-500/15 text-emerald-400 rounded-lg transition-colors text-xs font-semibold"
              >
                <Sparkles size={12} /> AI Forecast
              </button>
            </div>
          </div>
        )) : isRefreshing ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-text-muted">
            <Loader2 size={32} className="animate-spin mb-3 text-emerald-400" />
            <p className="font-medium text-xs">Syncing with Mandi APMCs...</p>
          </div>
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-text-muted text-center">
            <p className="font-medium text-xs mb-3">No commodity rates received for this mandi.</p>
            <button
              onClick={() => fetchMarketRates()}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold text-xs transition-all"
            >
              Retry Sync
            </button>
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
