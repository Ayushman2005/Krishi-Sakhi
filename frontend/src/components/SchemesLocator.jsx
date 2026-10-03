import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  ExternalLink, 
  Search, 
  Filter, 
  X, 
  FileText, 
  ShieldCheck, 
  Sun, 
  Sprout, 
  Warehouse, 
  Apple, 
  Fish, 
  TrendingUp, 
  Users, 
  Wallet, 
  Tractor, 
  Layers, 
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useFarmer } from '../context/FarmerContext';
import { SCHEME_CATEGORIES, ALL_SCHEMES, filterLocalSchemes } from '../data/schemesData';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const CATEGORY_ICONS = {
  all: Layers,
  income: Wallet,
  insurance: ShieldCheck,
  credit: Landmark,
  irrigation: Sun,
  machinery: Tractor,
  organic: Sprout,
  infrastructure: Warehouse,
  horticulture: Apple,
  livestock: Fish,
  marketing: TrendingUp,
  women_youth: Users
};

const CATEGORY_COLORS = {
  all: 'emerald',
  income: 'emerald',
  insurance: 'blue',
  credit: 'amber',
  irrigation: 'yellow',
  machinery: 'purple',
  organic: 'lime',
  infrastructure: 'orange',
  horticulture: 'rose',
  livestock: 'cyan',
  marketing: 'indigo',
  women_youth: 'pink'
};

const INDIAN_STATES = [
  { value: 'All', label: 'All India (Central & Regional)' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Punjab', label: 'Punjab & Haryana' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Telangana', label: 'Telangana & Andhra Pradesh' },
  { value: 'Odisha', label: 'Odisha' },
  { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
  { value: 'Gujarat', label: 'Gujarat & Rajasthan' },
  { value: 'Kerala', label: 'Kerala' }
];

const SchemesLocator = () => {
  const { profile } = useFarmer();
  const [schemes, setSchemes] = useState(ALL_SCHEMES);
  const [categories, setCategories] = useState(SCHEME_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalScheme, setActiveModalScheme] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-detect farmer's state from profile location on first load
  useEffect(() => {
    if (profile?.location) {
      const loc = profile.location.toLowerCase();
      const matched = INDIAN_STATES.find(s => s.value !== 'All' && loc.includes(s.value.toLowerCase()));
      if (matched) {
        setSelectedState(matched.value);
      }
    }
  }, [profile?.location]);

  // Fetch schemes with automatic fallback to comprehensive local dataset
  useEffect(() => {
    let isMounted = true;
    const fetchSchemes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
          category: selectedCategory,
          state: selectedState,
          crop: profile?.crop || 'General',
          search: searchQuery,
          land_size_acres: parseFloat(profile?.landSize) || 2.0
        });

        const response = await fetch(`${BACKEND_URL}/schemes?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch schemes');
        const data = await response.json();
        
        if (isMounted) {
          // If backend returns the comprehensive 30-scheme data with categories, use it
          if (data.schemes && data.schemes.length > 5 && data.schemes[0].category_code) {
            setSchemes(data.schemes);
            if (data.categories && data.categories.length > 0) {
              setCategories(data.categories);
            }
          } else {
            // Otherwise, filter our complete 30-scheme dataset
            const localFiltered = filterLocalSchemes({
              category: selectedCategory,
              state: selectedState,
              search: searchQuery
            });
            setSchemes(localFiltered);
            setCategories(SCHEME_CATEGORIES);
          }
        }
      } catch {
        if (isMounted) {
          // Complete client-side fallback ensures user ALWAYS sees all 30 schemes
          const localFiltered = filterLocalSchemes({
            category: selectedCategory,
            state: selectedState,
            search: searchQuery
          });
          setSchemes(localFiltered);
          setCategories(SCHEME_CATEGORIES);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      fetchSchemes();
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, selectedState, searchQuery, profile]);

  const getCategoryIcon = (code) => {
    const IconComponent = CATEGORY_ICONS[code] || Layers;
    return <IconComponent size={14} />;
  };

  return (
    <div className="main-container max-w-7xl mx-auto px-3 sm:px-6 py-4">
      {/* ── Header ────────────────────────────────────── */}
      <header className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
          <Landmark size={14} /> Comprehensive Government Support
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
          Agricultural Schemes & <span className="text-amber-400">Subsidies</span>
        </h1>
        <p className="text-text-muted text-xs sm:text-sm max-w-2xl mx-auto">
          Explore all types of Indian central and state initiatives — from direct cash transfers and 
          solar pumps to drone grants, organic farming, and concessional 4% Kisan Credit.
        </p>
      </header>

      {/* ── Search & Filter Controls ─────────────────────── */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, crop, solar, drone, loan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/50 transition-all font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* State Filter Dropdown */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium shrink-0">
            <Filter size={14} className="text-amber-400" /> State:
          </div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full md:w-56 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400/50 transition-all font-medium cursor-pointer"
          >
            {INDIAN_STATES.map((st) => (
              <option key={st.value} value={st.value} className="bg-slate-900 text-white">
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Result Counter Pill */}
        <div className="text-xs font-semibold px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl shrink-0">
          {schemes.length} Schemes Available
        </div>
      </div>

      {/* ── Category Filter Tabs ─────────────────────────── */}
      <div className="mb-8 overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex gap-2 min-w-max">
          {(categories.length > 0 ? categories : [
            { code: 'all', label: 'All Schemes', count: 30 },
            { code: 'income', label: 'Income & Pension', count: 4 },
            { code: 'insurance', label: 'Crop Insurance', count: 2 },
            { code: 'credit', label: 'Credit & Loans', count: 2 },
            { code: 'irrigation', label: 'Solar & Irrigation', count: 2 },
            { code: 'machinery', label: 'Machinery & Drones', count: 3 },
            { code: 'organic', label: 'Organic & Soil Health', count: 3 },
            { code: 'infrastructure', label: 'Storage & Post-Harvest', count: 3 },
            { code: 'horticulture', label: 'Horticulture & Honey', count: 2 },
            { code: 'livestock', label: 'Livestock & Fisheries', count: 3 },
            { code: 'marketing', label: 'Marketing & e-NAM', count: 3 },
            { code: 'women_youth', label: 'Women & Youth', count: 3 }
          ]).map((cat) => {
            const isSelected = selectedCategory === cat.code;
            return (
              <button
                key={cat.code}
                onClick={() => setSelectedCategory(cat.code)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {getCategoryIcon(cat.code)}
                <span>{cat.label}</span>
                {cat.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-amber-500/30 text-amber-200' : 'bg-white/10 text-slate-400'
                  }`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Error Banner ─────────────────────────────────── */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-center text-xs font-medium mb-6">
          {error}
        </div>
      )}

      {/* ── Schemes Grid ─────────────────────────────────── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted">
          <Loader2 size={36} className="animate-spin mb-3 text-amber-400" />
          <p className="text-xs font-medium">Filtering schemes across Indian agricultural databases...</p>
        </div>
      ) : schemes.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-white/10">
          <Landmark size={40} className="mx-auto text-slate-500 mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">No Schemes Found</h3>
          <p className="text-xs text-text-muted max-w-md mx-auto mb-4">
            No matching agricultural schemes found for your search or state filter. Try resetting filters or searching for "all".
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedState('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold hover:bg-amber-500/30 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {schemes.map((scheme, index) => (
              <motion.div
                key={scheme.id || index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className="glass-card border border-white/10 hover:border-amber-500/30 transition-all rounded-2xl p-5 flex flex-col justify-between group shadow-sm hover:shadow-lg hover:shadow-black/30"
              >
                <div>
                  {/* Card Header Tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
                      {scheme.category || 'Agricultural'}
                    </span>
                    {scheme.badge && (
                      <span className="text-[10px] font-medium px-2 py-0.5 bg-white/5 text-slate-300 border border-white/10 rounded-lg">
                        {scheme.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Regional Name */}
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug mb-1">
                    {scheme.name}
                  </h3>
                  {scheme.regional_name && (
                    <p className="text-xs text-amber-400/80 font-medium mb-3">
                      {scheme.regional_name}
                    </p>
                  )}

                  {/* Subsidy Highlight Pill */}
                  {scheme.subsidy_amount && (
                    <div className="mb-4 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                      <Sparkles size={13} className="shrink-0 text-emerald-400" />
                      <span>{scheme.subsidy_amount}</span>
                    </div>
                  )}

                  {/* Benefit & Eligibility Breakdown */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" /> Key Benefit
                      </h4>
                      <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed">
                        {scheme.benefit}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                        <MapPin size={13} className="text-amber-400 shrink-0" /> Eligibility
                      </h4>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {scheme.eligibility}
                      </p>
                    </div>

                    {scheme.documents && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                          <FileText size={13} className="text-blue-400 shrink-0" /> Required Documents
                        </h4>
                        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                          {scheme.documents}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-4 border-t border-white/5 flex gap-2">
                  <button
                    onClick={() => setActiveModalScheme(scheme)}
                    className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Info size={14} className="text-amber-400" /> Guidelines
                  </button>

                  {scheme.apply_url && (
                    <a
                      href={scheme.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-4 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      Apply <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── Guidelines & Application Modal ───────────────── */}
      <AnimatePresence>
        {activeModalScheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card max-w-2xl w-full border border-white/15 rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <button
                onClick={() => setActiveModalScheme(null)}
                className="absolute top-5 right-5 p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
                  {activeModalScheme.category}
                </span>
                {activeModalScheme.badge && (
                  <span className="text-[10px] font-medium px-2 py-0.5 bg-white/5 text-slate-300 border border-white/10 rounded-lg">
                    {activeModalScheme.badge}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {activeModalScheme.name}
              </h2>
              {activeModalScheme.regional_name && (
                <p className="text-sm text-amber-400 font-semibold mb-4">
                  {activeModalScheme.regional_name}
                </p>
              )}

              {activeModalScheme.subsidy_amount && (
                <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-emerald-300/80">Subsidy / Financial Grant</div>
                    <div className="text-sm font-bold text-emerald-400">{activeModalScheme.subsidy_amount}</div>
                  </div>
                </div>
              )}

              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" /> Benefit Scope
                  </h4>
                  <p className="text-slate-200 leading-relaxed">{activeModalScheme.benefit}</p>
                </div>

                <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                    <MapPin size={14} className="text-amber-400" /> Who Can Apply (Eligibility)
                  </h4>
                  <p className="text-slate-200 leading-relaxed">{activeModalScheme.eligibility}</p>
                </div>

                {activeModalScheme.documents && (
                  <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
                    <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                      <FileText size={14} className="text-blue-400" /> Mandatory Documents Checklist
                    </h4>
                    <p className="text-slate-200 leading-relaxed">{activeModalScheme.documents}</p>
                  </div>
                )}

                {activeModalScheme.department && (
                  <div className="text-[11px] text-text-muted flex items-center gap-1.5 pt-1">
                    <Landmark size={13} className="text-slate-400" /> Nodal Department: <span className="text-slate-300 font-medium">{activeModalScheme.department}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => setActiveModalScheme(null)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Close
                </button>

                {activeModalScheme.apply_url && (
                  <a
                    href={activeModalScheme.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    Visit Official Portal <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchemesLocator;
