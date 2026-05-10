import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, TrendingUp, TrendingDown, RefreshCcw, Landmark, MapPin, IndianRupee, Sparkles, X } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8000';

const MARKET_DATA = [
  { id: 1, crop: 'Paddy (Grade A)', price: 2350, unit: 'per Quintal', trend: '+2.4%', up: true, location: 'Palakkad Mandi' },
  { id: 2, crop: 'Coconut (Raw)', price: 34, unit: 'per Nut', trend: '-1.2%', up: false, location: 'Kozhikode Market' },
  { id: 3, crop: 'Rubber (RSS-4)', price: 168, unit: 'per Kg', trend: '+5.1%', up: true, location: 'Kottayam Board' },
  { id: 4, crop: 'Cardamom', price: 1850, unit: 'per Kg', trend: '+0.8%', up: true, location: 'Idukki Spices Board' },
  { id: 5, crop: 'Banana (Nendran)', price: 55, unit: 'per Kg', trend: '-4.3%', up: false, location: 'Thrissur Market' },
  { id: 6, crop: 'Black Pepper', price: 540, unit: 'per Kg', trend: '+1.5%', up: true, location: 'Wayanad Traders' },
];

const MarketInsights = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
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
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-[10px] font-black uppercase tracking-widest mb-4">
            <LineChart size={12} /> Real-Time Economics
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Live <span className="text-secondary">Market Rates</span></h2>
          <p className="text-text-muted mt-2">Track real-time commodity prices across major Kerala mandis.</p>
        </div>
        
        <button 
          onClick={handleRefresh}
          className="btn btn-secondary flex items-center gap-2"
        >
          <RefreshCcw size={16} className={isRefreshing ? 'animate-spin text-secondary' : ''} />
          {isRefreshing ? 'Syncing...' : 'Live Sync'}
        </button>
      </div>

      {/* Grid of Market Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MARKET_DATA.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card flex flex-col group relative overflow-hidden"
          >
            {/* Background glowing orb for up/down trend */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40 ${item.up ? 'bg-success' : 'bg-error'}`} />

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Landmark size={14} className="text-secondary" /> {item.crop}
              </div>
              <div className={`flex items-center gap-1 text-sm font-black px-2 py-1 rounded-md ${item.up ? 'text-success bg-success/10' : 'text-error bg-error/10'}`}>
                {item.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {item.trend}
              </div>
            </div>

            <div className="relative z-10 flex-grow flex flex-col justify-center">
              <div className="flex items-baseline gap-1">
                <IndianRupee size={24} className={item.up ? 'text-success' : 'text-error'} strokeWidth={3} />
                <span className="text-5xl font-black tracking-tighter">{item.price}</span>
              </div>
              <span className="text-text-muted font-bold mt-1 text-sm">{item.unit}</span>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-text-muted relative z-10">
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-secondary" /> {item.location}
              </div>
              <button 
                onClick={() => getForecast(item.crop)}
                className="flex items-center gap-1.5 px-3 py-1 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-full transition-colors font-bold"
              >
                <Sparkles size={12} /> AI Forecast
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Forecast Modal */}
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
                  {/* Recommendation Banner */}
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

                  {/* Graph visualization (Simulated using CSS widths) */}
                  <div className="space-y-3">
                    {forecastData.forecast_7_days.map((day, i) => {
                      // Normalize width for basic bar chart look
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

      {/* Revenue Estimator Banner */}
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
