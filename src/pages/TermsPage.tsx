import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LegalLayout } from '../components/LegalLayout';

export const TermsPage = () => {
  return (
    <LegalLayout title="Terms of Service">
      <Helmet>
        <title>listing pilot Terms of Service</title>
      </Helmet>
      <p className="text-sm italic mb-8">Last Updated: March 16, 2026</p>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
        <p>By accessing or using listing pilot ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. These terms apply to all visitors, users, and others who access or use the Service.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">2. Eligibility to Use the Service</h2>
        <p>You must be at least 18 years old to use the Service. By using listing pilot, you represent and warrant that you have the full right, power, and authority to enter into these Terms.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">3. Description of Services</h2>
        <p>listing pilot provides an AI-powered platform designed to generate and optimize real estate listings, including titles, descriptions, social media content, and estimated pricing suggestions. The Service uses advanced machine learning models to provide these outputs.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">4. AI-Generated Output Disclaimer</h2>
        <div className="bg-foreground/5 border-l-4 border-primary p-6 rounded-r-xl mb-6">
          <p className="font-bold text-foreground mb-2">Important Notice:</p>
          <p className="text-sm">listing pilot provides AI-generated suggestions, estimates, and optimizations. These do not constitute legal, financial, or professional real estate advice. All outputs, including estimated pricing, are approximate and based on AI analysis of provided data.</p>
        </div>
        <p>Users are solely responsible for reviewing, verifying, and editing all AI-generated content before publishing it to any third-party platform. listing pilot does not guarantee the accuracy, market performance, or legal compliance of any generated listing.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">5. Pricing, Billing, and Merchant of Record</h2>
        <p className="mb-4">Access to certain features of the Service requires a paid subscription. Our order process is conducted by our online reseller PayPal. PayPal is the Merchant of Record for all our orders. PayPal provides all customer service inquiries and handles returns.</p>
        <p>All payments are processed securely by PayPal. By subscribing to our Service, you agree to PayPal's terms and conditions in addition to these Terms. We reserve the right to change our pricing at any time with reasonable notice to active subscribers.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
        <p>The Service and its original content, features, and functionality are and will remain the exclusive property of listing pilot and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">7. User Content</h2>
        <p>You retain all rights to the property data and images you upload to the Service. By uploading content, you grant listing pilot a non-exclusive, worldwide license to use, process, and analyze that content solely for the purpose of providing the Service to you.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
        <p>In no event shall listing pilot, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or other intangible losses, resulting from your use of the Service.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">9. Governing Law</h2>
        <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the company is registered, without regard to its conflict of law provisions.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">10. Contact Information</h2>
        <p>If you have any questions about these Terms, please contact us at legal@listingpilot.ai.</p>
      </section>
    </LegalLayout>
  );
};
