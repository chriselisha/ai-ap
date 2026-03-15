import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LegalLayout } from '../components/LegalLayout';

export const RefundPage = () => {
  return (
    <LegalLayout title="Refund Policy">
      <Helmet>
        <title>ListingPilot AI Refund Policy</title>
      </Helmet>
      <p className="text-sm italic mb-8">Last Updated: March 15, 2026</p>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">1. Overview</h2>
        <p>ListingPilot AI aims to provide the highest quality AI listing services. We understand that circumstances may change, and we have established this policy to be fair to both our users and our business.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">2. Subscription Billing</h2>
        <p>ListingPilot AI is a subscription-based service. Subscriptions are billed in advance on a monthly or annual basis. You can cancel your subscription at any time.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">3. Refund Eligibility</h2>
        <p className="mb-4">Refund requests are reviewed on a case-by-case basis. You may be eligible for a refund if:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>You were charged due to a technical error or duplicate billing.</li>
          <li>You requested a refund within 48 hours of an accidental renewal and have not used the Service during that period.</li>
          <li>The Service was unavailable for an extended period due to our internal technical issues.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">4. Non-Refundable Situations</h2>
        <p className="mb-4">Generally, refunds will not be issued for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Subscription periods that have already been partially used.</li>
          <li>Dissatisfaction with AI-generated outputs (as these are subjective and provided as suggestions).</li>
          <li>Failure to cancel a subscription before the renewal date.</li>
          <li>Accounts terminated due to violations of our Terms of Service.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">5. Cancellation Policy</h2>
        <p>When you cancel your subscription, you will continue to have access to the Pro or Agency features until the end of your current billing cycle. No further charges will be made after cancellation.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">6. How to Request a Refund</h2>
        <p>To request a refund, please email support@listingpilot.ai with your account details, the transaction date, and the reason for your request. We aim to respond to all requests within 3-5 business days.</p>
      </section>
    </LegalLayout>
  );
};
