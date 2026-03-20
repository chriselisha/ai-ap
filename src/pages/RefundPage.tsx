import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LegalLayout } from '../components/LegalLayout';

export const RefundPage = () => {
  return (
    <LegalLayout title="Refund Policy">
      <Helmet>
        <title>listing pilot Refund Policy</title>
      </Helmet>
      <p className="text-sm italic mb-8">Last Updated: March 15, 2026</p>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">1. Overview</h2>
        <p>listing pilot sells its services through our payment processor, which acts as the Merchant of Record for all transactions. Our payment provider manages payments, taxes, and refund processing for our platform. We aim to provide the highest quality AI listing services and ensure a transparent refund process for all our customers.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">2. Refund Eligibility</h2>
        <p>Customers may request a refund within 14 days of the original purchase date. We believe in the quality of our service and want our customers to feel confident in their purchase. If you are not satisfied with the service for any reason within this 14-day window, you are entitled to a full refund.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">3. How to Request a Refund</h2>
        <p>Refund requests are handled by our payment processor, our Merchant of Record. You may submit a refund request through our payment provider's support channels or by contacting us directly at support@listingpilot.ai. When contacting us, please include your account details and the transaction date to help us expedite the process with our payment processor.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">4. Subscription Cancellations</h2>
        <p>Subscriptions can be cancelled at any time through your account settings. Cancellation will stop future billing immediately. After cancellation, you will continue to have access to your paid features until the end of your current billing cycle.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">5. Processing Time</h2>
        <p>Once a refund is approved by our payment processor, it typically takes 3-5 business days for the funds to appear back in your original payment method. Please note that processing times may vary depending on your financial institution.</p>
      </section>
    </LegalLayout>
  );
};
