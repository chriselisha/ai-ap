import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle } from 'lucide-react';

export const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <Helmet>
        <title>Payment Successful | listing pilot</title>
      </Helmet>
      
      <div className="max-w-md w-full glass p-12 rounded-[3rem] border border-border/50 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-foreground/[0.02] -z-10" />
        
        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Payment successful 🎉</h1>
        <p className="text-muted-foreground font-medium mb-10">
          Your subscription is now active.
        </p>
        
        <Link 
          to="/app"
          className="inline-block w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-95 bg-primary text-primary-foreground shadow-xl shadow-primary/20"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};
