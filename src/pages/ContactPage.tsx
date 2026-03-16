import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Mail, Globe } from 'lucide-react';

export const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <Helmet>
        <title>Contact Support – listing pilot</title>
      </Helmet>
      <div className="max-w-3xl mx-auto">
        <Link 
          to="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-[10px] font-bold uppercase tracking-widest mb-12 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tighter mb-4">Contact Us</h1>
          <div className="w-20 h-1.5 bg-primary rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <p className="text-muted-foreground leading-relaxed font-medium">
              Have questions about listing pilot? Our team is here to help you transform your property marketing.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email</div>
                  <div className="text-foreground font-bold">support@listingpilot.ai</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center text-primary">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Support</div>
                  <div className="text-foreground font-bold">Available 24/7</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem] border border-border/50 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Name</label>
              <input type="text" className="w-full bg-foreground/5 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email</label>
              <input type="email" className="w-full bg-foreground/5 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Message</label>
              <textarea className="w-full bg-foreground/5 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors h-32" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/10 hover:opacity-90 transition-all">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
