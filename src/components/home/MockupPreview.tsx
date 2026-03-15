import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Globe } from 'lucide-react';

export const MockupPreview = () => {
  return (
    <div className="relative group">
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="glass rounded-[2.5rem] p-1 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] dark:shadow-[0_32px_64px_-16px_rgba(255,255,255,0.05)]"
      >
        <div className="bg-card rounded-[2.25rem] overflow-hidden">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" 
              alt="Luxury Property" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">AI Generated</span>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1 tracking-tight">Modern Minimalist Villa</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-3 h-3" />
                  <span className="text-xs font-medium">Beverly Hills, California</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Estimate</p>
                <p className="text-lg font-bold text-foreground">$4.2M - $4.5M</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-2 w-full bg-foreground/10 rounded-full" />
                <div className="h-2 w-1/2 bg-foreground/10 rounded-full" />
              </div>
              <div className="h-2 w-3/4 bg-foreground/10 rounded-full" />
            </div>

            <div className="flex gap-3">
              {['3 Beds', '4 Baths', '3,200 sqft'].map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-lg bg-foreground/5 border border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Floating accents */}
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-10 -left-10 glass p-4 rounded-2xl shadow-xl z-20 hidden lg:block"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Optimization</p>
            <p className="text-sm font-bold text-foreground">+42% Conversion</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
