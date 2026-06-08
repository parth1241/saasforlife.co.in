import React from 'react';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function ContactPage() {
  return (
    <div className="bg-[#0F172A] min-h-screen text-white flex flex-col font-sans">
      <Navbar />

      <div className="pt-24 flex-grow">
        {/* Render the core Contact Component */}
        <Contact />

        {/* Legal Merchant Information block strictly for Razorpay audit compliance */}
        <div className="max-w-7xl mx-auto px-6 pb-20 mt-[-40px]">
          <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-800/80 max-w-4xl mx-auto space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Registered Merchant Details</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              For payments, billing discrepancies, or official communications, please refer to our registered corporate details:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-2 text-xs font-semibold text-slate-400">
              <div>
                <span className="block text-slate-500 uppercase tracking-wider text-[10px] mb-1">Legal Representative</span>
                <span className="text-white text-sm">Parth Karan</span>
              </div>
              <div>
                <span className="block text-slate-500 uppercase tracking-wider text-[10px] mb-1">Corporate Address</span>
                <span className="text-white text-sm leading-snug">C3/41 First Floor, DLF The Valley Panchkula, Haryana, 134107</span>
              </div>
              <div>
                <span className="block text-slate-500 uppercase tracking-wider text-[10px] mb-1">Direct Support</span>
                <span className="text-white text-sm">support@saasforlife.co.in</span>
              </div>
              <div>
                <span className="block text-slate-500 uppercase tracking-wider text-[10px] mb-1">Telephone</span>
                <span className="text-white text-sm">+91-7355802729</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
