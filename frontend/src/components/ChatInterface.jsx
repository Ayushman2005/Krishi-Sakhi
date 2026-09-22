import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Mic, Sparkles, Command } from 'lucide-react';
import { useFarmer } from '../context/FarmerContext';
import { getAIResponse } from '../utils/KnowledgeEngine';

const ChatInterface = () => {
  const { profile, activities } = useFarmer();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am Krishi Sakhi, your AI farming companion. How can I assist you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser (Try Chrome/Edge).");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInput(''); 
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await getAIResponse(input, profile, activities);

    setIsTyping(false);
    setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'ai' }]);
  };

  return (
    <>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, x: 100 }}
          animate={{ scale: 1, x: 0 }}
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 md:bottom-8 right-6 md:right-8 w-16 h-16 bg-gradient-to-tr from-cyan-500 via-cyan-600 to-indigo-600 rounded-[24px] shadow-[0_20px_40px_rgba(6,182,212,0.5)] flex items-center justify-center text-white z-50 cursor-pointer group border border-cyan-300/30"
        >
          <div className="absolute inset-0 bg-white/20 rounded-[24px] scale-0 group-hover:scale-100 transition-transform duration-300" />
          <MessageCircle size={30} className="relative z-10 group-hover:scale-110 transition-transform text-white" />
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center border-2 border-[#02040a] shadow-lg shadow-cyan-400/50"
          >
            <Sparkles size={10} className="text-black" />
          </motion.div>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 w-full sm:w-[380px] h-screen bg-[#030712]/95 backdrop-blur-3xl flex flex-col z-[100] overflow-hidden shadow-[-30px_0_100px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] border-l border-cyan-500/25 rounded-l-[40px] rounded-r-none"
            style={{ borderRadius: "40px 0 0 40px" }}
          >
            <div className="p-8 pt-10 border-b border-cyan-500/15 flex justify-between items-start bg-gradient-to-b from-cyan-500/15 via-cyan-500/5 to-transparent relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 via-violet-500 to-cyan-300 p-[2px] shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                  >
                    <div className="w-full h-full bg-[#030712] rounded-full flex items-center justify-center">
                      <Sprout size={32} className="text-cyan-400" />
                    </div>
                  </motion.div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-cyan-400 border-2 border-[#02040a] rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-2 tracking-tighter font-display">
                    Krishi Sakhi
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Sparkles size={18} className="text-cyan-300" />
                    </motion.span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <p className="text-[10px] text-emerald-400 font-black tracking-[0.2em] uppercase font-display">Farm AI Assistant</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-cyan-500/15 hover:rotate-90 transition-all border border-cyan-500/20 group"
              >
                <X size={20} className="text-text-muted group-hover:text-cyan-300" />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id} 
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-2 mt-auto mb-2 border border-cyan-500/40 flex-shrink-0">
                      <Sprout size={14} className="text-cyan-400" />
                    </div>
                  )}
                  <div className={`max-w-[75%] p-4 rounded-[24px] ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-cyan-500 to-indigo-600 text-white rounded-br-sm shadow-[0_10px_25px_rgba(6,182,212,0.35)]' 
                      : 'bg-white/5 text-text rounded-bl-sm border border-cyan-500/20 backdrop-blur-md shadow-lg'
                  }`}>
                    <p className="text-[14px] leading-relaxed font-medium">{msg.text}</p>
                    <p className={`text-[9px] mt-2 font-bold opacity-60 font-[var(--font-mono)] ${msg.sender === 'user' ? 'text-right text-cyan-200' : 'text-left text-cyan-400/80'}`}>
                      {formatTime(new Date())}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-cyan-950/30 border border-cyan-500/20 p-4 rounded-2xl flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        className="w-2 h-2 bg-cyan-400 rounded-full"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-6 bg-[#030712]/90 backdrop-blur-2xl border-t border-cyan-500/15 relative z-10 pb-8">
              <form onSubmit={handleSend} className="flex gap-3 items-center">
                <div className="relative flex-1 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-violet-500/30 rounded-[24px] opacity-0 group-focus-within:opacity-100 transition-opacity blur-md" />
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about crops, diseases, weather, fertilizer, mandi prices..."
                    className="relative w-full bg-[#071126]/90 border border-cyan-500/25 rounded-[24px] pl-6 pr-12 py-4 text-white focus:outline-none focus:border-cyan-400 transition-all text-[15px] shadow-inner"
                  />
                  <button 
                    type="button" 
                    onClick={toggleListening}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all p-2 rounded-full ${
                      isListening ? 'text-rose-400 bg-rose-500/10 animate-pulse' : 'text-text-muted hover:text-cyan-400 hover:bg-cyan-500/10'
                    }`}
                  >
                    <Mic size={20} />
                  </button>
                </div>
                <button 
                  type="submit" 
                  disabled={!input.trim()}
                  className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-[20px] flex items-center justify-center text-white disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(6,182,212,0.4)] flex-shrink-0"
                >
                  <Send size={20} className="ml-1" />
                </button>
              </form>
              <div className="mt-4 flex items-center gap-4 text-[10px] font-bold text-cyan-400/50 uppercase tracking-widest justify-center font-[var(--font-mono)]">
                <span className="flex items-center gap-1"><Command size={10} /> Powered by Krishi Sakhi Cyber-Neural Engine</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Sprout = ({ size, color = "currentColor", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 20h10" /><path d="M10 20V8a2 2 0 0 0-2-2 5 5 0 0 1-5-5" /><path d="M14 20V12a2 2 0 0 1 2-2 5 5 0 0 0 5-5" />
  </svg>
);

export default ChatInterface;
