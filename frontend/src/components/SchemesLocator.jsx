import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, MapPin, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useFarmer } from '../context/FarmerContext';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const SchemesLocator = () => {
  const { profile } = useFarmer();
  const [schemes, setSchemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          state: profile?.location?.includes(',') ? profile.location.split(',')[1].trim() : 'Global',
          crop: profile?.crop || 'General',
          land_size_acres: 2.0 // Assuming a default or get from profile if available
        });
        
        const response = await fetch(`${BACKEND_URL}/schemes?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch schemes');
        const data = await response.json();
        setSchemes(data.schemes || []);
      } catch {
        setError("Failed to load government schemes at this moment.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchemes();
  }, [profile]);

  return (
    <div className="main-container relative px-4 md:px-8 max-w-6xl mx-auto py-12">
      <header className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 bg-yellow-500/10 rounded-full border border-yellow-500/20 text-yellow-500 text-sm font-black uppercase tracking-widest mb-6"
        >
          <Landmark size={16} />
          Government Support
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-black tracking-tighter mb-4"
        >
          Schemes & <span className="text-yellow-500">Subsidies</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-muted text-lg max-w-2xl mx-auto"
        >
          Explore personalized government initiatives based on your farm profile and location.
        </motion.p>
      </header>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 text-error rounded-2xl text-center mb-8">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted">
          <Loader2 size={40} className="animate-spin mb-4 text-yellow-500" />
          <p className="font-bold">Locating tailored schemes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {schemes.map((scheme, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 20px 40px -15px rgba(234,179,8,0.2)' }}
                className="glass-card border-white/5 hover:border-yellow-500/30 transition-all flex flex-col h-full relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                  <Landmark size={80} className="text-yellow-500" />
                </div>
                
                <h3 className="text-xl font-black mb-4 pr-10">{scheme.name}</h3>
                
                <div className="space-y-4 flex-1">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-1.5 mb-1"><CheckCircle2 size={12} className="text-success" /> Key Benefit</h4>
                    <p className="text-sm font-medium">{scheme.benefit}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-1.5 mb-1"><MapPin size={12} className="text-blue-400" /> Eligibility</h4>
                    <p className="text-sm text-text-muted">{scheme.eligibility}</p>
                  </div>
                </div>

                <button className="mt-6 w-full py-3 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-xl font-black transition-colors flex items-center justify-center gap-2">
                  Apply Now <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SchemesLocator;
