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
          land_size_acres: parseFloat(profile?.landSize) || 2.0
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
    <div className="main-container max-w-6xl mx-auto">
      <header className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2.5">
          <Landmark size={14} /> Government Support
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          Schemes & <span className="text-amber-400">Subsidies</span>
        </h1>
        <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto">
          Explore government initiatives based on your farm profile and location.
        </p>
      </header>

      {error && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-center text-xs font-medium mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-text-muted">
          <Loader2 size={32} className="animate-spin mb-3 text-amber-400" />
          <p className="text-xs font-medium">Locating tailored schemes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {schemes.map((scheme, index) => (
              <div
                key={index}
                className="glass-card border border-white/10 hover:border-amber-500/30 transition-all rounded-2xl p-5 flex flex-col h-full justify-between"
              >
                <div>
                  <h3 className="text-base font-semibold text-white mb-3">{scheme.name}</h3>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5 mb-0.5">
                        <CheckCircle2 size={12} className="text-emerald-400" /> Key Benefit
                      </h4>
                      <p className="text-xs font-medium text-slate-200">{scheme.benefit}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5 mb-0.5">
                        <MapPin size={12} className="text-slate-400" /> Eligibility
                      </h4>
                      <p className="text-xs text-text-muted">{scheme.eligibility}</p>
                    </div>
                  </div>
                </div>

                <button className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                  Apply Now <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SchemesLocator;
