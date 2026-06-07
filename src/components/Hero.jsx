import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { FaChevronDown } from 'react-icons/fa';

export default function Hero() {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex flex-col items-center justify-center bg-[#0F172A] text-white overflow-hidden px-6"
    >
      {/* Floating Blobs using arbitrary Tailwind animations */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl animate-[float-slow_15s_ease-in-out_infinite] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl animate-[float-medium_12s_ease-in-out_infinite] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl animate-[float-fast_8s_ease-in-out_infinite] pointer-events-none" />

      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415510_1px,transparent_1px),linear-gradient(to_bottom,#33415510_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Animated Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.15] mb-6 text-white"
        >
          Software that scales — <br />
          <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
            for India and beyond
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-2xl mb-10 leading-relaxed font-light"
        >
          Affordable, high-performance SaaS solutions engineered in India, designed to power forward-thinking businesses across the globe.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto mb-16"
        >
          <Link
            to="pricing"
            smooth={true}
            duration={600}
            offset={-80}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-blue-500/20 cursor-pointer text-center"
          >
            View Plans
          </Link>
          
          <Link
            to="contact"
            smooth={true}
            duration={600}
            offset={-80}
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-700 bg-slate-800/40 text-slate-200 font-semibold hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all cursor-pointer text-center"
          >
            Talk to Us
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer"
        >
          <Link to="features" smooth={true} duration={500} offset={-80}>
            <FaChevronDown className="text-blue-500 text-2xl animate-bounce" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

