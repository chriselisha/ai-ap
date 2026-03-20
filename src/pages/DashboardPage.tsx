import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Building2, Bed, Bath, Maximize2, Zap, Upload, X, 
  FileText, Sparkles, Layout, Instagram, Hash, Copy, 
  DollarSign, Search, ChevronDown, BarChart3, ArrowRight, Check, AlertCircle
} from 'lucide-react';
import { 
  GenerateListingInput, GenerateListingOutput, 
  OptimizeListingInput, OptimizeListingOutput 
} from '../types';
import { COUNTRIES, PROPERTY_TYPES } from '../constants';
import { generateListing, optimizeListing } from '../services/gemini';
import { useAuth } from '../contexts/AuthContext';

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

const GenerateTool = () => {
  const { user, profile, openLoginModal, decrementCredits } = useAuth();
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
    if (!user) {
      openLoginModal();
      return;
    }

    if (profile && profile.plan_type !== 'Pro' && profile.credits_remaining <= 0) {
      setError("You have used all your credits. Upgrade your plan to continue generating listings.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const success = await decrementCredits();
      if (!success) {
        setError("Failed to use credit. Please try again.");
        setIsLoading(false);
        return;
      }

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
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Area / Neighborhood</label>
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

          {profile && profile.plan_type !== 'Pro' && profile.credits_remaining <= 0 && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-500 text-sm font-medium flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>You have used all your credits. Upgrade to continue generating listings.</span>
              </div>
              <Link to="/pricing" className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors shrink-0">
                Upgrade
              </Link>
            </div>
          )}

          <button 
            onClick={handleGenerate}
            disabled={isLoading || (profile && profile.plan_type !== 'Pro' && profile.credits_remaining <= 0)}
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
  const { user, profile, openLoginModal, decrementCredits } = useAuth();
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
    
    if (!user) {
      openLoginModal();
      return;
    }

    if (profile && profile.plan_type !== 'Pro' && profile.credits_remaining <= 0) {
      setError("You have used all your credits. Upgrade your plan to continue generating listings.");
      return;
    }

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
      const success = await decrementCredits();
      if (!success) {
        setError("Failed to use credit. Please try again.");
        clearTimeout(timeoutId);
        setIsLoading(false);
        return;
      }

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

          {profile && profile.plan_type !== 'Pro' && profile.credits_remaining <= 0 && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-500 text-sm font-medium flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>You have used all your credits. Upgrade to continue optimizing listings.</span>
              </div>
              <Link to="/pricing" className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors shrink-0">
                Upgrade
              </Link>
            </div>
          )}

          <button 
            onClick={handleOptimize}
            disabled={isLoading || !formData.url || (profile && profile.plan_type !== 'Pro' && profile.credits_remaining <= 0)}
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

export const DashboardPage = () => {
  const [searchParams] = useSearchParams();
  const initialTool = searchParams.get('tool') as 'generate' | 'optimize' || 'generate';
  const [activeTab, setActiveTab] = useState<'generate' | 'optimize'>(initialTool);
  const navigate = useNavigate();

  return (
    <main className="pt-32 pb-20 px-6">
      <Helmet>
        <title>listing pilot Dashboard – Generate & Optimize</title>
      </Helmet>
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
          <Link 
            to="/"
            className="text-muted-foreground hover:text-foreground text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto group"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
};
