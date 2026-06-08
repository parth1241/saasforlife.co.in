import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="bg-[#0F172A] min-h-screen text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 max-w-4xl mx-auto px-6">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-8">
          Privacy Policy
        </h1>
        <p className="text-slate-400 text-sm mb-8">Last updated: June 08, 2026</p>

        <div className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Introduction</h2>
            <p>
              Welcome to <strong>saasforlife.co.in</strong> (represented by <strong>Parth Karan</strong>). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us at <strong>support@saasforlife.co.in</strong>.
            </p>
            <p>
              This Privacy Policy governs the privacy policies and practices of our website. Please read this Privacy Policy carefully as it will help you understand what we do with the information that we collect.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Information We Collect</h2>
            <p>
              We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our services, or when you contact us.
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Personal Data:</strong> Name, email address, phone number, company name, and plan interests.</li>
              <li><strong>Payment Data:</strong> All payments are processed through **Razorpay**. We do not store or collect your payment card or bank account details on our servers. This data is provided directly to our third-party payment processor whose use of your personal information is governed by their Privacy Policy.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. How We Use Your Information</h2>
            <p>
              We use personal information collected via our Site for a variety of business purposes, including:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>To facilitate account creation and logon processes.</li>
              <li>To send you administrative information, invoices, billing confirmations, and subscription status updates.</li>
              <li>To respond to user inquiries, verify payment hashes, and offer customer support.</li>
              <li>To protect our Services and prevent security breaches.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Will Your Information Be Shared?</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
            </p>
            <p>
              Specifically, we share payment transaction markers and metadata with **Razorpay** to process payment checkout triggers. We do not sell, rent, or trade your personal information with any third parties for marketing purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Cookies and Tracking Technologies</h2>
            <p>
              We may use cookies and similar tracking technologies to access or store information (like user session tokens and currency selections). You can refuse cookies in your browser settings or manage preferences using the cookie banner on our homepage, though this may restrict some interactive features of our dashboard.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Security of Your Information</h2>
            <p>
              We aim to protect your personal information through a system of organizational and technical security measures. However, please remember that no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">7. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. The updated version will be indicated by an updated “Last updated” date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">8. Contact Us</h2>
            <p>
              If you have questions or comments about this policy, you may contact us at:
            </p>
            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5 text-sm">
              <p><strong>Grievance Officer:</strong> Parth Karan</p>
              <p><strong>Official Email:</strong> support@saasforlife.co.in</p>
              <p><strong>Hotlines:</strong> +91-7355802729</p>
              <p><strong>Address:</strong> C3/41 First Floor, DLF The Valley Panchkula, Haryana, 134107</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
