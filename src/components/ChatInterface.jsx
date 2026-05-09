import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Mic, User, Sparkles, Command } from 'lucide-react';
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
  const scrollRef = useRef(null);

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
      {/* Chat Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-20 h-20 bg-primary rounded-[24px] shadow-2xl flex items-center justify-center text-white z-50 cursor-pointer group"
        >
          <div className="absolute inset-0 bg-white/20 rounded-[24px] scale-0 group-hover:scale-100 transition-transform" />
          <MessageCircle size={36} className="relative z-10" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center border-4 border-background"
          >
            <Sparkles size={10} />
          </motion.div>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            className="fixed bottom-8 right-8 w-full max-w-[450px] h-[700px] glass flex flex-col z-50 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-white/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex justify-between items-center bg-gradient-to-r from-primary/20 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 animate-float">
                  <Sprout size={32} color="white" />
                </div>
                <div>
                  <h3 className="text-xl font-black flex items-center gap-2">Krishi Sakhi <Sparkles size={16} className="text-secondary" /></h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <p className="text-xs text-text-muted font-bold tracking-widest uppercase">Online & Ready</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-white/10 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
              {messages.map((msg, idx) => (
                <motion.div 
                  key={msg.id} 
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-5 rounded-3xl ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-primary to-primary-dark text-white rounded-tr-none shadow-lg shadow-primary/10' 
                      : 'bg-white/5 text-text rounded-tl-none border border-white/5 backdrop-blur-md'
                  }`}>
                    <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
                    <p className={`text-[10px] mt-2 font-bold opacity-40 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {format(new Date(), 'HH:mm')}
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
                  <div className="bg-white/5 p-4 rounded-2xl flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border-t border-border">
              <form onSubmit={handleSend} className="flex gap-3 items-center">
                <div className="relative flex-1 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-sm" />
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about crops, weather, or advice..."
                    className="relative w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary/50 transition-all text-[15px]"
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors">
                    <Mic size={22} />
                  </button>
                </div>
                <button 
                  type="submit" 
                  disabled={!input.trim()}
                  className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                >
                  <Send size={24} />
                </button>
              </form>
              <div className="mt-4 flex items-center gap-4 text-[10px] font-bold text-text-muted/50 uppercase tracking-widest justify-center">
                <span className="flex items-center gap-1"><Command size={10} /> Enter to send</span>
                <span className="w-1 h-1 bg-white/10 rounded-full" />
                <span>AI Powered Companion</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Sprout = ({ size, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 20h10" /><path d="M10 20V8a2 2 0 0 0-2-2 5 5 0 0 1-5-5" /><path d="M14 20V12a2 2 0 0 1 2-2 5 5 0 0 0 5-5" />
  </svg>
);

export default ChatInterface;
