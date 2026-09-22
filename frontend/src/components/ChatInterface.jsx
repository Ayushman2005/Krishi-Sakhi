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
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-7 right-5 md:right-7 h-11 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-full shadow-lg shadow-black/30 flex items-center gap-2 text-white z-50 cursor-pointer border border-emerald-400/20 text-xs font-semibold transition-all"
        >
          <MessageCircle size={16} />
          <span>Ask Krishi Sakhi</span>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 w-full sm:w-[380px] h-screen bg-[#0e1311]/98 backdrop-blur-xl flex flex-col z-[100] overflow-hidden shadow-2xl border-l border-white/10"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0e1311]">
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sprout size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Krishi Sakhi
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <p className="text-[10px] text-emerald-400 font-medium">Farm AI Assistant</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-text-muted hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-hide"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-sm shadow-sm' 
                      : 'bg-white/5 text-slate-200 rounded-bl-sm border border-white/10'
                  }`}>
                    <p className="text-xs leading-relaxed font-normal">{msg.text}</p>
                    <p className={`text-[9px] mt-1 font-mono ${msg.sender === 'user' ? 'text-right text-emerald-200/80' : 'text-left text-text-muted/60'}`}>
                      {formatTime(new Date())}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl flex gap-1.5 items-center">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-3.5 bg-[#0e1311] border-t border-white/10 relative z-10">
              <form onSubmit={handleSend} className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about crops, fertilizer, weather..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-3.5 pr-9 py-2 text-white focus:outline-none focus:border-emerald-500 transition-all text-xs"
                  />
                  <button 
                    type="button" 
                    onClick={toggleListening}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                      isListening ? 'text-rose-400 bg-rose-500/10' : 'text-text-muted hover:text-white'
                    }`}
                  >
                    <Mic size={15} />
                  </button>
                </div>
                <button 
                  type="submit" 
                  disabled={!input.trim()}
                  className="w-8 h-8 bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-colors flex-shrink-0"
                >
                  <Send size={14} />
                </button>
              </form>
              <div className="mt-2 text-[10px] text-text-muted/50 text-center">
                <span>Krishi Sakhi AI Assistant</span>
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
