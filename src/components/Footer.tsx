import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Instagram, Globe, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-20 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <Building2 className="text-primary-foreground w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-foreground tracking-tighter">ListingPilot AI</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed font-medium">
              The world's most advanced AI platform for real estate listing generation and optimization. Helping agents, brokers, and hosts sell and rent faster through market-aware intelligence.
            </p>
          </div>
          
          <div>
            <h4 className="text-foreground font-bold mb-8 uppercase tracking-widest text-[10px]">Product</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li><Link to="/app?tool=generate" className="hover:text-foreground transition-colors">Generate Listing</Link></li>
              <li><Link to="/app?tool=optimize" className="hover:text-foreground transition-colors">Optimize Listing</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing Plans</Link></li>
              <li><button className="hover:text-foreground transition-colors opacity-50 cursor-not-allowed">API Access (Beta)</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-foreground font-bold mb-8 uppercase tracking-widest text-[10px]">Legal & Support</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact Support</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">© 2026 ListingPilot AI. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Instagram className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            <Globe className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            <Mail className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};
