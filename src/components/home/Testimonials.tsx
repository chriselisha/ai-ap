import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Luxury Agent",
      content: "listing pilot AI has completely transformed my workflow. I save hours every week and my clients are blown away by the quality of the descriptions.",
      rating: 5
    },
    {
      name: "Marcus Chen",
      role: "Broker/Owner",
      content: "The market intelligence feature is a game-changer. It helps us position properties perfectly for the current market conditions.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Airbnb Superhost",
      content: "My bookings increased by 30% after using the optimization tool. The AI knows exactly what travelers are looking for.",
      rating: 5
    }
  ];

  return (
    <section className="py-32 bg-foreground/[0.01]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tighter mb-6">
            Loved by <span className="text-muted-foreground">Professionals</span>
          </h2>
          <div className="w-20 h-1.5 bg-primary rounded-full mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[2.5rem] glass border border-border/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-lg text-foreground font-medium leading-relaxed mb-8 italic">"{t.content}"</p>
              </div>
              <div>
                <p className="font-bold text-foreground">{t.name}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
