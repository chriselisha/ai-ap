import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, BarChart3, Globe } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI Generation",
      description: "Create compelling, market-aware descriptions in seconds using our advanced neural engines."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Smart Optimization",
      description: "Instantly improve existing listings with data-backed suggestions for higher engagement."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Market Intelligence",
      description: "Our AI analyzes local market trends to ensure your listing speaks directly to target buyers."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Reach",
      description: "Multi-language support and regional localization for international property marketing."
    }
  ];

  return (
    <section id="features" className="py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tighter mb-6">
            Engineered for <br />
            <span className="text-muted-foreground">Performance</span>
          </h2>
          <div className="w-20 h-1.5 bg-primary rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-[2rem] glass border border-border/50 hover:border-primary/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
