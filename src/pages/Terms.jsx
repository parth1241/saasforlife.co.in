import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="bg-[#0F172A] min-h-screen text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 max-w-4xl mx-auto px-6">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-8">
          Terms &amp; Conditions
        </h1>
        <p className="text-slate-400 text-sm mb-8">Last updated: June 08, 2026</p>

        <div className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Agreement to Terms</h2>
            <p>
              These Terms &amp; Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and <strong>saasforlife.co.in</strong> (represented by <strong>Parth Karan</strong>, “we,” “us,” or “our”), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
            </p>
            <p>
              By accessing the Site, you agree that you have read, understood, and agreed to be bound by all of these Terms &amp; Conditions. If you do not agree with all of these terms, then you are expressly prohibited from using the Site and you must discontinue use immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Intellectual Property Rights</h2>
            <p>
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. User Representations</h2>
            <p>
              By using the Site, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>All registration information you submit will be true, accurate, current, and complete.</li>
              <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
              <li>You have the legal capacity and you agree to comply with these Terms &amp; Conditions.</li>
              <li>You will not use the Site for any illegal or unauthorized purpose, and your use of the Site will not violate any applicable law or regulation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Services &amp; Subscriptions</h2>
            <p>
              We provide software consultations, custom website development, integrations, and SaaS hosting services. Detailed plans (Starter, Growth, Scale) and pricing are listed on our pricing panel. We reserve the right to alter pricing, hosting allotments, and service terms at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Billing and Payments</h2>
            <p>
              We accept payments in INR and converted international currencies. Payments are processed securely through our authorized payment partner, **Razorpay**. 
            </p>
            <p>
              You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. You further agree to promptly update account and payment information, including email address and payment method details, so that we can complete your transactions and contact you as needed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Prohibited Activities</h2>
            <p>
              You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">7. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms &amp; Conditions and your use of the Site are governed by and construed in accordance with the laws of **India**. Any legal action, suit, or proceeding arising out of or relating to these Terms shall be instituted exclusively in the competent courts located in **Panchkula, Haryana, India**.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">8. Contact Information</h2>
            <p>
              In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
            </p>
            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5 text-sm">
              <p><strong>Merchant Legal Representative:</strong> Parth Karan</p>
              <p><strong>Support Email:</strong> support@saasforlife.co.in</p>
              <p><strong>Support Hotlines:</strong> +91-7355802729</p>
              <p><strong>Registered Address:</strong> C3/41 First Floor, DLF The Valley Panchkula, Haryana, 134107</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
