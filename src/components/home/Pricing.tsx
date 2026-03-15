import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';

export const Pricing = () => {
  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tighter mb-8 leading-[0.95]">
              Simple Pricing. <br />
              <span className="text-muted-foreground">Unlimited Potential.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed font-medium">
              Choose the plan that fits your volume. From individual agents to global brokerages, we have the intelligence you need.
            </p>
            <Link 
              to="/pricing"
              className="inline-flex items-center gap-3 text-foreground font-bold uppercase tracking-widest text-xs group"
            >
              View All Plans
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-[3rem] border border-primary/20 relative"
          >
            <div className="absolute -top-6 right-12 bg-primary text-primary-foreground px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-primary/20">
              Most Popular
            </div>
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-2">Professional</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-foreground tracking-tighter">$49</span>
                <span className="text-muted-foreground font-medium">/month</span>
              </div>
            </div>
            <ul className="space-y-6 mb-12">
              {[
                "Unlimited AI Generations",
                "Advanced Market Analysis",
                "Priority Neural Processing",
                "Multi-platform Optimization",
                "24/7 Priority Support"
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-4 text-muted-foreground font-medium">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Check className="w-3 h-3" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            <Link 
              to="/pricing"
              className="w-full bg-foreground text-background py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-[0.98]"
            >
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
