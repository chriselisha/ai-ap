import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createDodoCheckout, STARTER_PRODUCT_ID, PRO_PRODUCT_ID, ANNUAL_PRODUCT_ID } from '../../services/payments';

export const Pricing = () => {
  const { user, openLoginModal } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$9",
      period: "/month",
      features: [
        "30 listing generations per month",
        "Basic optimize listing uses",
        "Basic pricing estimates",
        "Standard support"
      ],
      popular: false,
      productId: STARTER_PRODUCT_ID
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19",
      period: "/month",
      features: [
        "Unlimited listing generations",
        "Full listing optimization",
        "Smarter pricing estimates",
        "Priority support",
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
      features: [
        "Multi-user/team usage",
        "Unlimited usage",
        "Client workflow support",
        "Dedicated account manager",
        "Custom output templates"
      ],
      popular: false,
      productId: ANNUAL_PRODUCT_ID
    }
  ];

  const handleSubscribe = async (planId: string, productId: string) => {
    if (!user) {
      openLoginModal();
      return;
    }

    setLoadingPlan(planId);
    setError(null);

    try {
      const paymentLink = await createDodoCheckout(
        productId,
        user.email || '',
        user.displayName || 'Customer'
      );
      window.location.href = paymentLink;
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to start checkout process. Please try again.");
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tighter mb-6 leading-[0.95]">
            Simple Pricing. <br />
            <span className="text-muted-foreground">Unlimited Potential.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            Choose the plan that fits your volume. From individual agents to global brokerages, we have the intelligence you need.
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-center text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass p-10 rounded-[3rem] border relative flex flex-col ${plan.popular ? 'border-primary/30 shadow-2xl shadow-primary/10 scale-105 z-10 bg-card/80' : 'border-border/50 bg-card/30'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 right-8 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-primary/20">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-foreground tracking-tighter">{plan.price}</span>
                  <span className="text-muted-foreground font-medium">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-5 mb-10 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleSubscribe(plan.id, plan.productId)}
                disabled={loadingPlan === plan.id}
                className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${plan.popular ? 'bg-foreground text-background hover:scale-[1.02] active:scale-[0.98]' : 'bg-muted text-foreground hover:bg-muted/80'} ${loadingPlan === plan.id ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loadingPlan === plan.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
