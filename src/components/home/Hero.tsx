import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { MockupPreview } from './MockupPreview';

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden grid-bg">
      {/* Ambient Light Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-foreground/5 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-foreground/5 blur-[120px] rounded-full" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass text-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
            <Sparkles className="w-4 h-4" />
            The New Standard in Real Estate
          </div>
          <h1 className="text-6xl lg:text-8xl font-bold text-foreground leading-[0.95] tracking-tighter mb-8">
            Elevate Your <br />
            <span className="text-muted-foreground">Listings</span> with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-xl leading-relaxed font-medium">
            Transform property data into high-converting experiences. Generate, optimize, and dominate the market with the world's most sophisticated AI for real estate.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={() => navigate('/app?tool=generate')}
              className="group bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95"
            >
              Start Generating
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/app?tool=optimize')}
              className="glass hover:bg-foreground/5 text-foreground px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
            >
              Optimize URL
              <Zap className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          <MockupPreview />
        </motion.div>
      </div>
    </section>
  );
};
