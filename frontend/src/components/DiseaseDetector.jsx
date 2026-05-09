import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Leaf, AlertTriangle, CheckCircle2, Loader2, X, Camera, Info } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8000';

// Disease info reference
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
    } catch (err) {
      // Graceful offline fallback - simulate for demo
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
            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-3xl transition-all duration-300 cursor-pointer group ${
                isDragging ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-white/10 hover:border-primary/40 hover:bg-white/3'
              }`}
            >
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
              
              {imagePreview ? (
                <div className="relative p-4">
                  <button onClick={(e) => { e.stopPropagation(); reset(); }} className="absolute top-6 right-6 z-10 p-2 bg-error/80 rounded-full text-white hover:bg-error transition-colors">
                    <X size={16} />
                  </button>
                  <img src={imagePreview} alt="Leaf preview" className="w-full max-h-72 object-contain rounded-2xl" />
                  <p className="text-center text-sm text-text-muted mt-3 font-bold">{image?.name}</p>
                </div>
              ) : (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors">
                    <Camera size={36} className="text-text-muted group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xl font-black mb-2">Drop leaf image here</p>
                  <p className="text-text-muted text-sm">or click to browse  •  JPG, PNG, WebP up to 10MB</p>
                </div>
              )}
            </div>

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

            {/* Main Result */}
            <div className={`glass-card border-l-4 ${isHealthy ? 'border-l-success glass-card-accent' : 'border-l-warning glass-card-warning'}`}>
              <div className="flex items-center gap-6 mb-6">
                <div className={`p-4 rounded-3xl ${isHealthy ? 'bg-success/20' : 'bg-warning/20'}`}>
                  {isHealthy ? <CheckCircle2 size={40} className="text-success" /> : <AlertTriangle size={40} className="text-warning" />}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-1">Diagnosis</p>
                  <h3 className="text-3xl font-black">{result.prediction}</h3>
                  <p className="text-sm font-bold text-text-muted">Confidence: <span className="text-white">{(result.confidence * 100).toFixed(1)}%</span></p>
                </div>
              </div>
              
              {/* Confidence Bars */}
              <div className="space-y-3">
                {result.all_predictions?.map((pred, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>{pred.label}</span><span className="text-text-muted">{(pred.score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pred.score * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`h-full rounded-full ${i === 0 ? 'bg-primary' : 'bg-white/20'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Treatment Guide */}
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
