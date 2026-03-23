import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { STARTER_PRODUCT_ID, PRO_PRODUCT_ID, ANNUAL_PRODUCT_ID } from '../services/payments';

export const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { user, activateSubscription } = useAuth();
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    const activatePlan = async () => {
      if (!user || isActivated || isActivating) return;

      const planId = searchParams.get('plan');
      if (!planId) return;

      setIsActivating(true);
      setActivationError(null);

      try {
        let planType: 'Starter' | 'Pro' | 'Annual' | null = null;
        
        if (planId === STARTER_PRODUCT_ID) planType = 'Starter';
        else if (planId === PRO_PRODUCT_ID) planType = 'Pro';
        else if (planId === ANNUAL_PRODUCT_ID) planType = 'Annual';

        if (planType) {
          await activateSubscription(planType);
          setIsActivated(true);
        } else {
          setActivationError("Invalid plan ID detected.");
        }
      } catch (error) {
        console.error("Failed to activate subscription:", error);
        setActivationError("Failed to activate your subscription. Please contact support.");
      } finally {
        setIsActivating(false);
      }
    };

    activatePlan();
  }, [user, searchParams, isActivated, isActivating, activateSubscription]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 pt-20">
      <Helmet>
        <title>Payment Successful | listing pilot</title>
      </Helmet>
      
      <div className="max-w-md w-full glass p-12 rounded-[3rem] border border-border/50 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-foreground/[0.02] -z-10" />
        
        {isActivating ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Activating Subscription...</h2>
            <p className="text-muted-foreground text-sm">Please wait while we set up your account.</p>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Payment Successful!</h1>
            
            {activationError ? (
              <p className="text-destructive font-medium mb-10 leading-relaxed">
                {activationError}
              </p>
            ) : (
              <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
                {isActivated 
                  ? "Your subscription is now active. You can start generating premium listings."
                  : "Thank you for your purchase! If your subscription doesn't activate automatically, please contact support."}
              </p>
            )}
            
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
          </>
        )}
      </div>
    </div>
  );
};
