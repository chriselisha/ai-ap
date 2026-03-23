import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ArrowRight } from 'lucide-react';

export const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 pt-20">
      <Helmet>
        <title>Payment Successful | listing pilot</title>
      </Helmet>
      
      <div className="max-w-md w-full glass p-12 rounded-[3rem] border border-border/50 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-foreground/[0.02] -z-10" />
        
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Payment Successful!</h1>
        <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
          Your subscription is now active. You can start generating premium listings.
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/app"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-95 bg-foreground text-background shadow-xl shadow-foreground/10"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link 
            to="/"
            className="inline-block w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all hover:bg-muted/50 text-muted-foreground"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
