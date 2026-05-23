import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, AlertTriangle, CheckCircle2, Loader2, X, Camera, Info } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const DISEASE_GUIDE = {
  'Leaf Blast': { 
    severity: 'High', 
    treatment: 'Apply Tricyclazole @0.6g/L of water. Drain excess water from fields.',
    prevention: 'Use resistant varieties. Avoid excess Nitrogen.'
  },
  'Brown Plant Hopper': { 
    severity: 'High', 
    treatment: 'Apply Buprofezin 25 SC @ 1ml/L. Avoid flood irrigation temporarily.',
    prevention: 'Maintain field hygiene. Encourage natural predators.'
  },
  'Healthy': {
    severity: 'None',
    treatment: 'No treatment required.',
    prevention: 'Continue current agronomic practices.'
  },
  'Neck Rot': {
    severity: 'High',
    treatment: 'Apply Tricyclazole @0.6g/L. Ensure seeds are treated before sowing.',
    prevention: 'Avoid excess nitrogen and maintain proper spacing.'
  },
  'Sheath Blight': {
    severity: 'Medium',
    treatment: 'Spray Hexaconazole 5% EC @ 2ml/L or Validamycin 3L @ 2ml/L.',
    prevention: 'Remove weeds and maintain field sanitation. Avoid high plant density.'
  },
  'Tungro Virus': {
    severity: 'Extreme',
    treatment: 'Control green leafhoppers with Clothianidin 50 WDG @ 0.4g/L. Rogue out infected plants.',
    prevention: 'Use resistant varieties. Maintain a fallow period between crops.'
  },
};

const DiseaseDetector = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.');
      return;
    }
    setError(null);
    setResult(null);
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const analyzeImage = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', image);

      const response = await fetch(`${BACKEND_URL}/ml/disease-detect`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed on server.');
      const data = await response.json();
      setResult(data);
    } catch {

      setResult({
        prediction: 'Leaf Blast',
        confidence: 0.87,
        all_predictions: [
          { label: 'Leaf Blast', score: 0.87 },
          { label: 'Neck Rot', score: 0.09 },
          { label: 'Healthy', score: 0.04 },
        ],
        mode: 'demo'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  };

  const diseaseInfo = result ? (DISEASE_GUIDE[result.prediction] || DISEASE_GUIDE['Leaf Blast']) : null;
  const isHealthy = result?.prediction === 'Healthy';

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-4">
          <Leaf size={14} /> CNN Vision Model
        </div>
        <h2 className="text-4xl font-black tracking-tighter mb-2">Plant Disease Detector</h2>
        <p className="text-text-muted">Upload a leaf photo for instant AI-powered disease diagnosis</p>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`relative border-2 border-dashed rounded-[40px] transition-all duration-500 cursor-pointer group overflow-hidden ${
                isDragging ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-primary/40 hover:bg-white/5'
              }`}
            >
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />

              {imagePreview ? (
                <div className="relative p-8">
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={(e) => { e.stopPropagation(); reset(); }} 
                    className="absolute top-10 right-10 z-10 p-3 bg-error shadow-xl rounded-full text-white hover:bg-error/80 transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                  <motion.img 
                    layoutId="leaf-image"
                    src={imagePreview} 
                    alt="Leaf preview" 
                    className="w-full max-h-[400px] object-contain rounded-3xl shadow-2xl" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
                  <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-sm text-white font-black px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">{image?.name}</p>
                </div>
              ) : (
                <div className="p-20 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-8 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500 relative z-10">
                    <Camera size={40} className="text-text-muted group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-2xl font-black mb-3 tracking-tight relative z-10">Drop leaf image here</p>
                  <p className="text-text-muted text-sm relative z-10 font-medium">or click to browse  •  JPG, PNG, WebP up to 10MB</p>
                </div>
              )}
            </motion.div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-error text-sm font-bold text-center mt-4 flex items-center justify-center gap-2">
                <AlertTriangle size={16} /> {error}
              </motion.p>
            )}

            <motion.button
              onClick={analyzeImage}
              disabled={!image || isAnalyzing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary w-full py-5 text-lg font-black mt-6 disabled:opacity-30 disabled:grayscale"
            >
              {isAnalyzing ? (
                <><Loader2 size={22} className="animate-spin" /> Analyzing Leaf Tissue...</>
              ) : (
                <><Leaf size={22} /> Analyze Disease</>
              )}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {result.mode === 'demo' && (
              <div className="text-center text-xs text-warning font-bold bg-warning/10 border border-warning/20 py-2 px-4 rounded-xl">
                ⚠ Demo Mode — Backend offline. Showing simulated result.
              </div>
            )}

            <div className={`glass rounded-[40px] p-10 border-l-8 overflow-hidden relative group ${isHealthy ? 'border-l-success' : 'border-l-warning'}`}>
              <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity">
                {isHealthy ? <CheckCircle2 size={256} /> : <AlertTriangle size={256} />}
              </div>

              <div className="flex items-center gap-8 mb-10 relative z-10">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className={`w-24 h-24 rounded-[32px] flex items-center justify-center shadow-2xl ${isHealthy ? 'bg-success text-black' : 'bg-warning text-black'}`}
                >
                  {isHealthy ? <CheckCircle2 size={48} strokeWidth={3} /> : <AlertTriangle size={48} strokeWidth={3} />}
                </motion.div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-2">Expert Diagnosis</p>
                  <h3 className="text-5xl font-black tracking-tighter text-white">{result.prediction}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <p className="text-sm font-black text-text-muted">AI Confidence: <span className="text-white">{(result.confidence * 100).toFixed(1)}%</span></p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                {result.all_predictions?.map((pred, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className={i === 0 ? 'text-white' : 'text-text-muted'}>{pred.label}</span>
                      <span className="text-text-muted">{(pred.score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pred.score * 100}%` }}
                        transition={{ duration: 1.2, delay: i * 0.1, ease: "circOut" }}
                        className={`h-full rounded-full relative ${i === 0 ? (isHealthy ? 'bg-success' : 'bg-warning') : 'bg-white/10'}`}
                      >
                        {i === 0 && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {diseaseInfo && (
              <div className="glass-card space-y-4">
                <h4 className="font-black flex items-center gap-2"><Info size={18} className="text-primary" /> Treatment Protocol</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-error/10 border border-error/15 p-4 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-error mb-2">Immediate Action</p>
                    <p className="text-sm leading-relaxed">{diseaseInfo.treatment}</p>
                  </div>
                  <div className="bg-success/10 border border-success/15 p-4 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-success mb-2">Prevention</p>
                    <p className="text-sm leading-relaxed">{diseaseInfo.prevention}</p>
                  </div>
                </div>
              </div>
            )}

            <button onClick={reset} className="btn btn-secondary w-full py-4 font-black">
              <Camera size={18} /> Analyze Another Leaf
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiseaseDetector;
