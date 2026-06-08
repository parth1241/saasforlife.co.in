import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaLaptopCode, FaServer, FaChartBar, FaUserCheck } from 'react-icons/fa';

export default function About() {
  return (
    <div className="bg-[#0F172A] min-h-screen text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            About Us
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            World-class software systems, consulting, and hosting built for speed and life.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-12">
          {/* Mission */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed">
              At <strong>saasforlife.co.in</strong> (represented by <strong>Parth Karan</strong>), our mission is to empower developers, startups, and enterprises to build, host, and scale software products without worrying about complex infrastructure, payment configurations, or compliance bottlenecks. We build technology solutions that are designed to last.
            </p>
          </section>

          {/* Grid Cards */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">What We Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
                <FaLaptopCode className="text-blue-500 text-2xl" />
                <h4 className="font-bold text-lg">Custom SaaS Development</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  High-performance, secure web applications built using React 18, Node.js, and modern databases.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
                <FaServer className="text-blue-500 text-2xl" />
                <h4 className="font-bold text-lg">SaaS Hosting &amp; SSL</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Lightning-fast static and dynamic cloud hosting with automatic SSL setup, caching, and CDN routing.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
                <FaChartBar className="text-blue-500 text-2xl" />
                <h4 className="font-bold text-lg">Analytics Dashboards</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Real-time analytics and tracking widgets to monitor visitors, conversion ratios, and loading times.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
                <FaUserCheck className="text-blue-500 text-2xl" />
                <h4 className="font-bold text-lg">Payment Integrations</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Seamless merchant setup for Razorpay gateways, supporting secure UPI, cards, and netbanking checkouts.
                </p>
              </div>
            </div>
          </section>

          {/* Legal Identity Details */}
          <section className="p-8 rounded-3xl bg-slate-800/50 border border-slate-800/80 space-y-4">
            <h3 className="text-xl font-bold text-white">Legal Identity &amp; Operations</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We operate as a registered sole proprietorship in Haryana, India, founded and directed by software engineer <strong>Parth Karan</strong>. All transactions and legal arrangements made through this website are registered under our official billing address in Panchkula.
            </p>
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-400">
              <div>
                <span className="block text-slate-500">Legal Business Name</span>
                <span className="text-white text-sm">Parth Karan</span>
              </div>
              <div>
                <span className="block text-slate-500">Registered Office</span>
                <span className="text-white text-sm">C3/41 First Floor, DLF The Valley Panchkula, Haryana, 134107</span>
              </div>
              <div>
                <span className="block text-slate-500">Grievance &amp; Billing Email</span>
                <span className="text-white text-sm">support@saasforlife.co.in</span>
              </div>
              <div>
                <span className="block text-slate-500">Support Hotline</span>
                <span className="text-white text-sm">+91-7355802729</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
