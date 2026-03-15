import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { TrustSection } from '../components/home/TrustSection';
import { Features } from '../components/home/Features';
import { Pricing } from '../components/home/Pricing';
import { Testimonials } from '../components/home/Testimonials';

export const HomePage = () => {
  const navigate = useNavigate();
  return (
    <main>
      <Helmet>
        <title>ListingPilot AI – AI Powered Real Estate Listing Generator</title>
      </Helmet>
      <Hero />
      <TrustSection />
      <Features />
      <Pricing />
      <Testimonials />
      
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-foreground/[0.02] -z-10" />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-foreground tracking-tighter mb-8 leading-[0.95]">
              Ready to <span className="text-muted-foreground">Transform</span> <br />
              Your Real Estate Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Join thousands of top-performing agents who are already using ListingPilot AI to dominate their local markets.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => navigate('/app?tool=generate')}
                className="bg-primary text-primary-foreground px-12 py-6 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-primary/20"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link 
                to="/pricing"
                className="glass text-foreground px-12 py-6 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-foreground/5 hover:scale-105 transition-all"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};
