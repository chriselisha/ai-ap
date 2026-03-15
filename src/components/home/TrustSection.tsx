import React from 'react';

export const TrustSection = () => {
  return (
    <section className="py-20 border-y border-border/50 bg-foreground/[0.01]">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] text-center mb-12">Trusted by Industry Leaders</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          {['Sotheby\'s', 'RE/MAX', 'Zillow', 'Compass', 'Coldwell Banker'].map((brand) => (
            <span key={brand} className="text-2xl font-black tracking-tighter text-foreground">{brand}</span>
          ))}
        </div>
      </div>
    </section>
  );
};
