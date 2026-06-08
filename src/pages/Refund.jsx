import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Refund() {
  return (
    <div className="bg-[#0F172A] min-h-screen text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 max-w-4xl mx-auto px-6">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-8">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="text-slate-400 text-sm mb-8">Last updated: June 08, 2026</p>

        <div className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Cancellation Policy</h2>
            <p>
              We believe in helping our customers as far as possible, and we therefore have a liberal cancellation policy. 
            </p>
            <p>
              Under this policy, you can cancel your subscription plans (Starter, Growth, or Scale) at any time directly from your user dashboard. Once you cancel, your subscription will remain active until the end of your current billing cycle (monthly or annual), and you will not be billed again.
            </p>
            <p>
              *Please note: Cancellations are not accepted for custom developer integration setups once work has officially commenced.*
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Refund Eligibility (7-Day Money-Back Guarantee)</h2>
            <p>
              We strive to deliver world-class software solutions. If you are unsatisfied with our SaaS hosting or analytics platform, we offer a **7-day money-back guarantee** for your initial purchase:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Refund requests must be submitted within <strong>7 days</strong> of your initial payment date.</li>
              <li>Renewals (monthly or annual) are not eligible for refunds under this guarantee, though you can cancel them to prevent future billing.</li>
              <li>Custom development fees, SWIFT wire transaction fees, or specialized consultant strategy calls are non-refundable.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. How to Request a Refund</h2>
            <p>
              To initiate a refund, please send an email from your registered email address to <strong>support@saasforlife.co.in</strong>. Please include your:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Full Name</li>
              <li>Registered Email Address</li>
              <li>Razorpay Payment ID / Transaction Marker</li>
              <li>Brief explanation of why you are requesting a refund (so we can improve our services).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Refund Processing Timeline</h2>
            <p>
              Once your refund request is received and approved, we will initiate the refund back to your original payment source.
            </p>
            <p>
              Refunds are processed securely through **Razorpay**. The refunded amount will be credited back to your original payment method (Credit/Debit Card, UPI, Netbanking, or Wallet) within **5 to 7 working days** (subject to standard bank clearances).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Contact and Escalations</h2>
            <p>
              For any billing disputes, payment issues, or refund inquiries, please reach out to us at:
            </p>
            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5 text-sm">
              <p><strong>Billing Representative:</strong> Parth Karan</p>
              <p><strong>Billing Email:</strong> support@saasforlife.co.in</p>
              <p><strong>Hotlines:</strong> +91-7355802729</p>
              <p><strong>Billing Address:</strong> C3/41 First Floor, DLF The Valley Panchkula, Haryana, 134107</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
