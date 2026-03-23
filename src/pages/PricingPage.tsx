import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Check, Building2, Globe, Layout, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getDodoCheckoutUrl, STARTER_PRODUCT_ID, PRO_PRODUCT_ID, ANNUAL_PRODUCT_ID } from '../services/payments';

export const PricingPage = () => {
  const navigate = useNavigate();
  const { user, openLoginModal } = useAuth();

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$9",
      period: "/month",
      desc: "Perfect for trying out our AI capabilities.",
      features: [
        "30 listing generations per month",
        "Basic optimize listing uses",
        "Basic pricing estimates",
        "Standard support",
        "Standard output quality"
      ],
      popular: false,
      productId: STARTER_PRODUCT_ID
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19",
      period: "/month",
      desc: "Ideal for solo agents and active hosts.",
      features: [
        "Unlimited listing generations",
        "Full listing optimization",
        "Smarter pricing estimates",
        "Priority support",
        "Advanced output quality",
        "Market-aware intelligence"
      ],
      popular: true,
      productId: PRO_PRODUCT_ID
    },
    {
      id: "annual",
      name: "Annual",
      price: "$199",
      period: "/year",
      desc: "Built for large teams and agencies.",
      features: [
        "Multi-user/team usage",
        "Unlimited usage",
        "Client workflow support",
        "Dedicated account manager",
        "Custom output templates",
        "API Access (Coming Soon)"
      ],
      popular: false,
      productId: ANNUAL_PRODUCT_ID
    }
  ];

  const handleSubscribe = (productId: string) => {
    if (!user) {
      openLoginModal();
      return;
    }
    const url = getDodoCheckoutUrl(productId, user.email || '');
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <Helmet>
        <title>listing pilot Pricing – Plans for Agents, Hosts and Agencies</title>
      </Helmet>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 rounded-full glass text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            Pricing Plans
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-8 tracking-tighter">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">Choose the plan that fits your property marketing needs. Scale as you grow.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {plans.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-12 rounded-[3rem] border ${p.popular ? 'bg-card border-primary/20 shadow-2xl shadow-primary/5 scale-105 z-10' : 'bg-card/50 border-border'} flex flex-col relative overflow-hidden group`}
            >
              {p.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded-bl-3xl">
                  Most Popular
                </div>
              )}
              <h3 className="text-3xl font-bold text-foreground mb-4 tracking-tight">{p.name}</h3>
              <p className="text-muted-foreground text-sm mb-10 font-medium leading-relaxed">{p.desc}</p>
              <div className="flex items-baseline gap-2 mb-12">
                <span className="text-6xl font-bold text-foreground tracking-tighter">{p.price}</span>
                <span className="text-muted-foreground font-medium">{p.period}</span>
              </div>
              
              <div className="space-y-6 mb-12 flex-grow">
                {p.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <div className="w-full mt-auto">
                <button 
                  onClick={() => handleSubscribe(p.productId)}
                  className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${p.popular ? 'bg-foreground text-background hover:scale-[1.02] active:scale-[0.98]' : 'bg-muted text-foreground hover:bg-muted/80'}`}
                >
                  Subscribe
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass p-16 rounded-[4rem] border border-border/50 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-foreground/[0.02] -z-10" />
          <h2 className="text-4xl font-bold text-foreground mb-8 tracking-tight">Who is listing pilot for?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <Building2 />, title: "Real Estate Agents", desc: "Close deals faster with high-conversion listings." },
              { icon: <Globe />, title: "Airbnb Hosts", desc: "Stand out in a crowded market and increase bookings." },
              { icon: <Layout />, title: "Property Marketers", desc: "Scale your content production with AI efficiency." },
              { icon: <Zap />, title: "Agencies", desc: "Manage multiple clients with unified AI workflows." }
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center mx-auto text-primary">
                  {item.icon}
                </div>
                <h4 className="font-bold text-foreground">{item.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
