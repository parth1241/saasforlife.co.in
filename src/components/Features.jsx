import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiGlobe, FiBarChart2, FiShield, FiCreditCard, FiHeadphones, FiZap } from 'react-icons/fi';

export default function Features() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const features = [
    {
      icon: <FiGlobe className="text-blue-400" />,
      title: 'Website & app hosting',
      description: 'Blazing fast hosting with 99.9% uptime SLA, CDN delivery, and automatic SSL certificates included.',
    },
    {
      icon: <FiBarChart2 className="text-blue-400" />,
      title: 'Analytics & reporting',
      description: 'Real-time dashboards for traffic, conversions and revenue. Actionable insights without hiring a data team.',
    },
    {
      icon: <FiShield className="text-blue-400" />,
      title: 'Security & compliance',
      description: 'Enterprise-grade DDoS protection, daily backups, and GDPR-ready infrastructure managed for you.',
    },
    {
      icon: <FiCreditCard className="text-blue-400" />,
      title: 'Payment integration',
      description: 'Native Razorpay for India (UPI, cards, netbanking) plus Stripe for international customers. Accept money from anywhere.',
    },
    {
      icon: <FiHeadphones className="text-blue-400" />,
      title: 'Dedicated support',
      description: 'Real humans on email, WhatsApp, and video calls. India-based team available across time zones.',
    },
    {
      icon: <FiZap className="text-blue-400" />,
      title: 'Custom integrations',
      description: 'Connect CRMs, ERPs, email platforms and 100+ popular tools via our integration layer.',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="features" className="py-24 bg-[#0F172A] relative overflow-hidden border-t border-slate-800">
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-3">
            Why Choose Us
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Engineered to Perform. Designed to Scale.
          </p>
          <p className="text-lg text-slate-400">
            Discover how saasforlife bridges the gap between premium global infrastructure and localized operational needs.
          </p>
        </div>

        {/* Feature Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="p-8 rounded-2xl bg-slate-800 border border-slate-700 hover:border-blue-500 transition-colors duration-300 flex flex-col justify-start group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Strip */}
        <div className="mt-20 bg-blue-600 rounded-2xl py-8 px-6 md:px-12 shadow-xl shadow-blue-600/25">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col justify-center items-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-white">500+</span>
              <span className="text-sm text-blue-100 font-semibold mt-1">Clients</span>
            </div>
            <div className="flex flex-col justify-center items-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-white">99.9%</span>
              <span className="text-sm text-blue-100 font-semibold mt-1">Uptime</span>
            </div>
            <div className="flex flex-col justify-center items-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-white">₹0</span>
              <span className="text-sm text-blue-100 font-semibold mt-1">Setup Fee</span>
            </div>
            <div className="flex flex-col justify-center items-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-white">4hr</span>
              <span className="text-sm text-blue-100 font-semibold mt-1">Response</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
