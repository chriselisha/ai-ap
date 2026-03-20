import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LegalLayout } from '../components/LegalLayout';

export const PrivacyPage = () => {
  return (
    <LegalLayout title="Privacy Policy">
      <Helmet>
        <title>listing pilot Privacy Policy</title>
      </Helmet>
      <p className="text-sm italic mb-8">Last Updated: March 16, 2026</p>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
        <p>At listing pilot, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
        <p className="mb-4">We collect information that you provide directly to us, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Account information (name, email, password)</li>
          <li>Property details (address, specs, features)</li>
          <li>Uploaded images and media</li>
          <li>Pasted URLs from third-party listing platforms</li>
          <li>Payment information (processed securely by our Merchant of Record)</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">3. How We Use Information</h2>
        <p className="mb-4">We use the collected information to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide and maintain our AI services</li>
          <li>Process and generate listing optimizations</li>
          <li>Analyze property data to provide market insights</li>
          <li>Communicate with you about your account and updates</li>
          <li>Improve our AI models and platform performance</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">4. AI Processing of Inputs</h2>
        <p>listing pilot processes your property data and images using advanced AI models. This processing is necessary to generate the listing content you request. We do not use your private property data to train public AI models without your explicit consent.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">5. Sharing of Information</h2>
        <p>We do not sell your personal data to third parties. We may share information with trusted service providers who assist us in operating our platform, such as hosting providers, AI infrastructure partners, and our Merchant of Record. Payment information is processed securely by our payment provider, and we do not store full credit card details on our servers.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
        <p>We retain your information for as long as your account is active or as needed to provide you with the Service. You may request the deletion of your account and associated data at any time through your account settings.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">7. Security</h2>
        <p>We implement reasonable security measures to protect your data. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">8. User Rights</h2>
        <p>Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or delete your information. Please contact us to exercise these rights.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
        <p>For privacy-related inquiries, please contact our Data Protection Officer at privacy@listingpilot.ai.</p>
      </section>
    </LegalLayout>
  );
};
