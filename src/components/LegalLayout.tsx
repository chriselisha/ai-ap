import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const LegalLayout = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link 
          to="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-[10px] font-bold uppercase tracking-widest mb-12 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tighter mb-4">{title}</h1>
          <div className="w-20 h-1.5 bg-primary rounded-full" />
        </div>

        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed font-medium space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};
