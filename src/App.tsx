/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Sparkles, 
  Search, 
  ArrowRight, 
  Check, 
  Copy, 
  Upload, 
  X, 
  ChevronDown, 
  Globe, 
  Zap, 
  BarChart3, 
  Instagram, 
  Hash, 
  DollarSign, 
  Star,
  Menu,
  LayoutDashboard,
  Layout,
  FileText,
  MousePointerClick,
  Sun,
  Moon,
  Bed,
  Bath,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COUNTRIES, PROPERTY_TYPES } from './constants';
import { generateListing, optimizeListing } from './services/gemini';
import { 
  GenerateListingInput, 
  GenerateListingOutput, 
  OptimizeListingInput, 
  OptimizeListingOutput 
} from './types';

// --- Components ---

const ThemeToggle = ({ theme, toggleTheme }: { theme: 'dark' | 'light', toggleTheme: () => void }) => {
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-foreground/5 transition-colors text-foreground"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

const Navbar = ({ onNavClick, theme, toggleTheme }: { onNavClick: (section: string) => void, theme: 'dark' | 'light', toggleTheme: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavClick('hero')}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
            <Building2 className="text-primary-foreground w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-foreground">ListingPilot <span className="text-muted-foreground font-medium">AI</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          {['Generate', 'Optimize', 'Features', 'Pricing'].map((item) => (
            <button 
              key={item} 
              onClick={() => onNavClick(item.toLowerCase())}
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all group-hover:w-full" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button className="bg-primary hover:opacity-90 text-primary-foreground px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Try Free
          </button>
        </div>
      </div>
    </nav>
  );
};

const MockupPreview = () => {
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
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Market Score</p>
            <p className="text-sm font-bold text-foreground">98/100</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -top-10 -right-10 glass p-4 rounded-2xl shadow-xl z-20 hidden lg:block"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Speed</p>
            <p className="text-sm font-bold text-foreground">0.8s</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Hero = ({ onStart }: { onStart: (tool: 'generate' | 'optimize') => void }) => {
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
              onClick={() => onStart('generate')}
              className="group bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95"
            >
              Start Generating
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onStart('optimize')}
              className="glass hover:bg-foreground/5 text-foreground px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
            >
              Optimize URL
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <MockupPreview />
        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { icon: <Zap className="w-6 h-6" />, title: "AI Listing Generator", desc: "Create professional descriptions and titles from basic property data in seconds." },
    { icon: <Search className="w-6 h-6" />, title: "Listing Optimizer", desc: "Paste any Zillow or Airbnb URL and let AI improve your copy for higher conversion." },
    { icon: <BarChart3 className="w-6 h-6" />, title: "Smart Pricing Estimates", desc: "Get AI-powered price and rent estimates based on current market trends." },
    { icon: <Globe className="w-6 h-6" />, title: "Global Market Support", desc: "Automatic currency and market detection for USA, UAE, UK, India, and more." },
    { icon: <Instagram className="w-6 h-6" />, title: "Social Media Ready", desc: "Generate Instagram captions and hashtags tailored to real estate audiences." },
    { icon: <Sparkles className="w-6 h-6" />, title: "SEO Optimization", desc: "Rank higher on search engines and property portals with keyword-rich content." }
  ];

  return (
    <section id="features" className="py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full glass text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            Capabilities
          </motion.div>
          <h2 className="text-5xl font-bold text-foreground mb-6 tracking-tight">Built for Real Estate Professionals</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium">Everything you need to dominate the real estate market with the power of artificial intelligence.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-10 rounded-3xl bg-card border border-border hover:border-foreground/20 transition-all group relative overflow-hidden shadow-sm hover:shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 blur-3xl rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
              <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-8 group-hover:bg-foreground/10 transition-colors">
                <div className="text-foreground">{f.icon}</div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrustSection = () => {
  return (
    <section className="py-20 border-y border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-12">Trusted by agents from top platforms</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale">
          {['Zillow', 'Airbnb', 'Realtor.com', 'Redfin', 'Compass'].map((logo) => (
            <span key={logo} className="text-2xl font-black tracking-tighter text-foreground">{logo}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const plans = [
    { name: "Starter", price: "Free", desc: "Perfect for trying out our AI tools.", features: ["5 Listings / Month", "Basic AI Generation", "Standard Support", "Community Access"] },
    { name: "Pro", price: "Coming Soon", desc: "For professional agents and brokers.", features: ["Unlimited Listings", "Advanced Optimization", "Priority Support", "Custom Branding", "Market Analytics"], popular: true },
    { name: "Agency", price: "Contact Us", desc: "Custom solutions for large teams.", features: ["Team Collaboration", "API Access", "Dedicated Account Manager", "White-label Reports", "Bulk Processing"] }
  ];

  return (
    <section id="pricing" className="py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full glass text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            Investment
          </motion.div>
          <h2 className="text-5xl font-bold text-foreground mb-6 tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium">Choose the plan that fits your business needs. No hidden fees.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-10 rounded-[2.5rem] border ${p.popular ? 'bg-card border-foreground/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] dark:shadow-[0_32px_64px_-16px_rgba(255,255,255,0.05)] scale-105 z-10' : 'bg-card/50 border-border'} flex flex-col relative overflow-hidden group`}
            >
              {p.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-bl-2xl">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">{p.name}</h3>
              <p className="text-muted-foreground text-sm mb-8 font-medium">{p.desc}</p>
              <div className="text-5xl font-bold text-foreground mb-10 tracking-tighter">{p.price}</div>
              
              <div className="space-y-5 mb-10 flex-grow">
                {p.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                    <div className="w-5 h-5 rounded-full bg-foreground/5 flex items-center justify-center">
                      <Check className="w-3 h-3 text-foreground" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <button className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 ${p.popular ? 'bg-primary text-primary-foreground shadow-xl' : 'glass text-foreground hover:bg-foreground/5'}`}>
                {p.name === "Agency" ? "Contact Sales" : "Get Started"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    { name: "Sarah Jenkins", role: "Real Estate Agent, Miami", text: "ListingPilot AI has cut my listing creation time by 80%. The descriptions are more professional than what I could write myself." },
    { name: "Ahmed Al-Maktoum", role: "Airbnb Superhost, Dubai", text: "The optimization tool is a game changer. My booking rate increased by 25% after updating my titles and descriptions." },
    { name: "David Chen", role: "Property Marketer, Sydney", text: "I love the currency detection and smart pricing. It makes managing international portfolios so much easier." }
  ];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full glass text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            Success Stories
          </motion.div>
          <h2 className="text-5xl font-bold text-foreground mb-6 tracking-tight">Trusted by Professionals Globally</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[2rem] bg-card border border-border italic text-muted-foreground relative group hover:shadow-2xl transition-all"
            >
              <Star className="w-12 h-12 text-foreground/5 absolute top-8 right-8 transition-transform group-hover:scale-125" />
              <p className="mb-10 leading-relaxed text-lg font-medium relative z-10">"{t.text}"</p>
              <div className="flex items-center gap-4 not-italic">
                <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center font-bold text-foreground border border-border">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-foreground font-bold text-base tracking-tight">{t.name}</div>
                  <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <Building2 className="text-primary-foreground w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-foreground">ListingPilot AI</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              The world's most advanced AI platform for real estate listing generation and optimization. Helping agents and hosts sell and rent faster.
            </p>
          </div>
          
          <div>
            <h4 className="text-foreground font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><button className="hover:text-foreground transition-colors">Generate Listing</button></li>
              <li><button className="hover:text-foreground transition-colors">Optimize Listing</button></li>
              <li><button className="hover:text-foreground transition-colors">Pricing</button></li>
              <li><button className="hover:text-foreground transition-colors">API Access</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-foreground font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><button className="hover:text-foreground transition-colors">About Us</button></li>
              <li><button className="hover:text-foreground transition-colors">Contact</button></li>
              <li><button className="hover:text-foreground transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-foreground transition-colors">Terms of Service</button></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">© 2026 ListingPilot AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Instagram className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            <Globe className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const SearchableSelect = ({ 
  options, 
  value, 
  onChange, 
  label, 
  placeholder = "Search..." 
}: { 
  options: { name: string, code: string }[], 
  value: string, 
  onChange: (val: string) => void,
  label: string,
  placeholder?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground flex items-center justify-between focus:outline-none focus:border-primary transition-colors"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value || "Select a country"}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => {
                      onChange(opt.name);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-foreground/5 transition-colors ${value === opt.name ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}
                  >
                    {opt.name}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground italic">No countries found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Tool Components ---

const GenerateTool = () => {
  const [formData, setFormData] = useState<GenerateListingInput>({
    country: 'United States',
    state: '',
    area: '',
    propertyType: 'Apartment',
    purpose: 'Sale',
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    amenities: '',
    notes: '',
    images: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateListingOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const output = await generateListing(formData);
      setResult(output);
    } catch (err) {
      setError("Failed to generate listing. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const selectedCountry = COUNTRIES.find(c => c.name === formData.country);
  const currencySymbol = selectedCountry?.symbol || '$';
  const currencyCode = selectedCountry?.currency || 'USD';

  return (
    <div className="space-y-12">
      <div className="glass border border-border/50 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-foreground/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Globe className="w-5 h-5 text-muted-foreground" />
                Location Details
              </h3>
              <div className="space-y-4">
                <SearchableSelect 
                  label="Country"
                  options={COUNTRIES}
                  value={formData.country}
                  onChange={(val) => setFormData({ ...formData, country: val })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">State / Province</label>
                    <input 
                      type="text"
                      placeholder="e.g. Florida"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Area / City</label>
                    <input 
                      type="text"
                      placeholder="e.g. Miami"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                Property Specs
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Type</label>
                    <select 
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-all appearance-none"
                    >
                      {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Purpose</label>
                    <div className="flex p-1 bg-background/50 border border-border rounded-xl h-[46px]">
                      {(['Sale', 'Rent'] as const).map(p => (
                        <button
                          key={p}
                          onClick={() => setFormData({ ...formData, purpose: p })}
                          className={`flex-1 rounded-lg text-xs font-bold transition-all ${formData.purpose === p ? 'bg-foreground text-background shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                      <Bed className="w-3 h-3" /> Beds
                    </label>
                    <input 
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                      <Bath className="w-3 h-3" /> Baths
                    </label>
                    <input 
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                      <Maximize2 className="w-3 h-3" /> Sq Ft
                    </label>
                    <input 
                      type="number"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: parseInt(e.target.value) })}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-muted-foreground" />
                Amenities & Features
              </h3>
              <textarea 
                placeholder="e.g. Infinity pool, Private gym, Rooftop garden, Smart home system..."
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                className="w-full bg-background/50 border border-border rounded-2xl px-6 py-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all h-32 resize-none"
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Upload className="w-5 h-5 text-muted-foreground" />
                Property Media
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {formData.images.map((img, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={i} 
                    className="relative aspect-square rounded-xl overflow-hidden border border-border group"
                  >
                    <img src={img} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <button 
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-md rounded-full text-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-border/50 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary group"
                >
                  <div className="p-2 rounded-full bg-foreground/5 group-hover:bg-primary/10 transition-colors">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest">Add Photo</span>
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                multiple 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              AI Customization
            </h3>
            <textarea 
              placeholder="Any specific tone or unique selling points you want the AI to highlight? (e.g. 'Focus on the sunset views', 'Mention the historical significance')"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-background/50 border border-border rounded-2xl px-6 py-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all h-24 resize-none"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full group relative overflow-hidden bg-foreground text-background py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-2xl shadow-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                <span className="uppercase tracking-widest text-sm">Crafting Listing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span className="uppercase tracking-widest text-sm">Generate Premium Listing</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Generation Complete</span>
                </div>
                <h3 className="text-4xl font-bold text-foreground tracking-tight">Optimized Results</h3>
              </div>
              <div className="flex gap-8">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Market Context</div>
                  <div className="text-sm font-bold text-foreground">{formData.country} ({currencyCode})</div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">AI Confidence</div>
                  <div className="text-sm font-bold text-primary">{Math.round(result.confidenceScore * 100)}%</div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <ResultCard 
                  title="SEO Optimized Title" 
                  content={result.title} 
                  onCopy={() => copyToClipboard(result.title)} 
                  icon={<Layout className="w-4 h-4" />}
                />
                <ResultCard 
                  title="Luxury Property Description" 
                  content={result.description} 
                  onCopy={() => copyToClipboard(result.description)} 
                  isLong 
                  icon={<FileText className="w-4 h-4" />}
                />
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass p-8 rounded-[2rem] border border-border/50 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <DollarSign className="w-12 h-12" />
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-4">
                      Estimated Sale
                    </div>
                    <div className="text-3xl font-bold text-foreground tracking-tight">{result.estimatedSalePrice}</div>
                    <div className="mt-2 text-[10px] text-muted-foreground font-medium">Based on current {formData.area} market data</div>
                  </div>
                  <div className="glass p-8 rounded-[2rem] border border-border/50 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <DollarSign className="w-12 h-12" />
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-4">
                      Estimated Rent
                    </div>
                    <div className="text-3xl font-bold text-foreground tracking-tight">{result.estimatedMonthlyRent}</div>
                    <div className="mt-2 text-[10px] text-muted-foreground font-medium">Projected monthly yield</div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <ResultCard 
                  title="Social Media Hook" 
                  content={result.instagramCaption} 
                  onCopy={() => copyToClipboard(result.instagramCaption)} 
                  icon={<Instagram className="w-4 h-4" />} 
                />
                
                <div className="glass p-8 rounded-[2rem] border border-border/50">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                      <Hash className="w-4 h-4" />
                      Smart Hashtags
                    </div>
                    <button 
                      onClick={() => copyToClipboard(result.hashtags.join(' '))} 
                      className="p-2 rounded-lg hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((tag, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-foreground/5 border border-border/50 text-[10px] font-bold text-muted-foreground hover:text-foreground hover:border-border transition-all cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="glass p-8 rounded-[2rem] border border-border/50">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Analyzed Assets</div>
                    <div className="grid grid-cols-3 gap-3">
                      {formData.images.map((img, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border/50">
                          <img src={img} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="glass p-8 rounded-[2rem] border border-border/50 bg-foreground/5 flex items-center justify-between group cursor-pointer hover:bg-foreground/10 transition-all">
                  <div>
                    <h4 className="text-foreground font-bold text-sm mb-1">AI Photo Enhancement</h4>
                    <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Coming Soon</p>
                  </div>
                  <div className="p-3 rounded-full bg-foreground/5 group-hover:scale-110 transition-transform">
                    <Sparkles className="text-foreground w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OptimizeTool = () => {
  const [formData, setFormData] = useState<OptimizeListingInput>({
    url: '',
    platform: 'Other',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizeListingOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectPlatform = (url: string): 'Zillow' | 'Airbnb' | 'Other' => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('zillow')) return 'Zillow';
    if (lowerUrl.includes('airbnb')) return 'Airbnb';
    return 'Other';
  };

  const handleUrlChange = (url: string) => {
    const platform = detectPlatform(url);
    setFormData(prev => ({ ...prev, url, platform }));
  };

  const handleOptimize = async () => {
    if (!formData.url) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setError("Analysis is taking longer than expected. Please try again.");
      }
    }, 30000);

    try {
      const output = await optimizeListing(formData);
      setResult(output);
    } catch (err) {
      setError("Failed to analyze listing. Please check the URL and try again.");
      console.error(err);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="glass border border-border/50 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-foreground/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-10">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              Listing Source
            </h3>
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Globe className="w-5 h-5" />
                </div>
                <input 
                  type="text"
                  placeholder="Paste Zillow, Airbnb, or any property URL..."
                  value={formData.url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-2xl pl-14 pr-6 py-5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Platform</label>
                  <div className="relative">
                    <select 
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-4 text-sm text-foreground focus:outline-none focus:border-primary transition-all appearance-none"
                    >
                      <option value="Zillow">Zillow</option>
                      <option value="Airbnb">Airbnb</option>
                      <option value="Other">Other Platform</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Focus Areas (Optional)</label>
                  <input 
                    type="text"
                    placeholder="e.g. Highlight the modern kitchen..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-4 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleOptimize}
            disabled={isLoading || !formData.url}
            className="w-full group relative overflow-hidden bg-foreground text-background py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-2xl shadow-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                <span className="uppercase tracking-widest text-sm">Analyzing Listing...</span>
              </>
            ) : (
              <>
                <BarChart3 className="w-5 h-5" />
                <span className="uppercase tracking-widest text-sm">Analyze & Optimize Listing</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Analysis Complete</span>
                </div>
                <h3 className="text-4xl font-bold text-foreground tracking-tight">Optimization Report</h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="space-y-1 text-right">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Listing Score</div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-foreground/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.listingScore}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full ${result.listingScore > 70 ? 'bg-primary' : 'bg-muted-foreground'}`} 
                      />
                    </div>
                    <span className={`text-xl font-bold ${result.listingScore > 70 ? 'text-primary' : 'text-muted-foreground'}`}>{result.listingScore}/100</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="glass p-8 rounded-[2rem] border border-border/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Search className="w-24 h-24" />
                  </div>
                  <div className="relative z-10">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Original Listing Context</div>
                    <div className="grid md:grid-cols-2 gap-8">
                      {result.detectedImage && (
                        <div className="aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-xl">
                          <img src={result.detectedImage} alt="Detected" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="space-y-4">
                        <h4 className="text-xl font-bold text-foreground leading-tight">{result.originalTitle}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4 italic">"{result.originalDescription}"</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <ResultCard 
                  title="Improved SEO Title" 
                  content={result.improvedTitle} 
                  onCopy={() => navigator.clipboard.writeText(result.improvedTitle)} 
                  icon={<Layout className="w-4 h-4" />}
                />
                <ResultCard 
                  title="High-Conversion Description" 
                  content={result.improvedDescription} 
                  onCopy={() => navigator.clipboard.writeText(result.improvedDescription)} 
                  isLong 
                  icon={<FileText className="w-4 h-4" />}
                />
              </div>

              <div className="space-y-8">
                <div className="glass p-8 rounded-[2rem] border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-6">
                    <Check className="w-4 h-4" />
                    Key Improvements
                  </div>
                  <div className="space-y-4">
                    {result.suggestedImprovements.map((imp, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex gap-4 p-4 rounded-xl bg-foreground/5 border border-border/50 group hover:border-border transition-all"
                      >
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">{imp}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="glass p-8 rounded-[2rem] border border-border/50 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <DollarSign className="w-12 h-12" />
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Pricing Strategy</div>
                  <p className="text-lg font-bold text-foreground leading-tight">{result.pricingSuggestion}</p>
                </div>

                <div className="glass p-8 rounded-[2rem] border border-border/50">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">SEO Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {result.seoKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-foreground/5 border border-border/50 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-all cursor-default">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-foreground/5 border border-border/50 text-center">
                  <p className="text-muted-foreground text-[9px] font-medium leading-relaxed uppercase tracking-wider">Analysis based on available public metadata and AI visual recognition.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResultCard = ({ title, content, onCopy, isLong, icon }: { title: string, content: string, onCopy: () => void, isLong?: boolean, icon?: React.ReactNode }) => {
  return (
    <div className="glass p-8 rounded-[2rem] border border-border/50 group relative hover:border-border transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
          {icon}
          {title}
        </div>
        <button 
          onClick={onCopy}
          className="p-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover:opacity-100 shadow-sm"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
      <div className={`text-foreground leading-relaxed ${isLong ? 'text-sm' : 'text-2xl font-bold tracking-tight'}`}>
        {content}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'generate' | 'optimize'>('generate');
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return (saved as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  const scrollIntoView = (id: string) => {
    if (view === 'app') {
      setView('landing');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const startApp = (tool: 'generate' | 'optimize') => {
    setActiveTab(tool);
    setView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'app') {
    return (
      <div className={`min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-primary selection:text-primary-foreground antialiased font-sans`}>
        <Navbar 
          onNavClick={(section) => {
            if (section === 'generate' || section === 'optimize') {
              startApp(section);
            } else {
              scrollIntoView(section);
            }
          }} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />
        
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block px-4 py-2 rounded-full glass text-[10px] font-bold uppercase tracking-widest mb-6"
              >
                AI Dashboard
              </motion.div>
              <h1 className="text-5xl font-bold text-foreground mb-6 tracking-tighter">Listing Pilot</h1>
              <p className="text-muted-foreground max-w-xl mx-auto mb-12 font-medium">Transform your property marketing with our advanced AI tools.</p>
              
              <div className="inline-flex p-1.5 bg-card border border-border rounded-2xl shadow-inner relative z-10">
                {(['generate', 'optimize'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-10 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all relative z-10 ${activeTab === tab ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {tab} Listing
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'generate' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'generate' ? <GenerateTool /> : <OptimizeTool />}
            </motion.div>
            
            <div className="mt-24 text-center">
              <button 
                onClick={() => setView('landing')}
                className="text-muted-foreground hover:text-foreground text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto group"
              >
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Back to Landing
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-primary selection:text-primary-foreground antialiased font-sans`}>
      <Navbar 
        onNavClick={(section) => {
          if (section === 'generate' || section === 'optimize') {
            startApp(section);
          } else {
            scrollIntoView(section);
          }
        }} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      <main>
        <Hero onStart={startApp} />
        <TrustSection />
        <Features />
        <Pricing />
        <Testimonials />
        
        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-foreground/[0.02] -z-10" />
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter">Ready to transform your property marketing?</h2>
              <p className="text-muted-foreground text-xl mb-12 font-medium">Join thousands of agents and hosts who are already using ListingPilot AI to close more deals.</p>
              <button 
                onClick={() => startApp('generate')}
                className="bg-primary hover:opacity-90 text-primary-foreground px-12 py-6 rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-primary/20 transform hover:scale-105 active:scale-95 uppercase tracking-widest text-xs"
              >
                Get Started for Free
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
