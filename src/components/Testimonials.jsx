import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaStar } from 'react-icons/fa';

export default function Testimonials() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const reviews = [
    {
      initials: 'RM',
      name: 'Rahul M.',
      company: 'TechStartup Pune',
      flag: '🇮🇳',
      text: 'saasforlife.co.in handled our entire tech stack. Hosting, payments, analytics — all sorted in one week.',
    },
    {
      initials: 'PK',
      name: 'Priya K.',
      company: 'E-commerce Mumbai',
      flag: '🇮🇳',
      text: 'The Razorpay integration saved us weeks of dev work. UPI payments were live in 2 days.',
    },
    {
      initials: 'JT',
      name: 'James T.',
      company: 'Digital Agency UK',
      flag: '🇬🇧',
      text: 'Working with an India-based team that understands global requirements was a game changer for our budget.',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
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
    <section id="testimonials" className="py-24 bg-[#0F172A] relative overflow-hidden border-t border-slate-800 text-white">
      {/* Background glow decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-3">
            Testimonials
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Trusted by businesses across India and beyond
          </p>
          <p className="text-lg text-slate-400">
            See how founders, product owners, and developers use our tools to achieve goals faster.
          </p>
        </div>

        {/* Testimonials Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="p-8 rounded-2xl bg-slate-800 border border-slate-700/60 flex flex-col justify-between hover:border-slate-500 transition-all duration-300 shadow-md shadow-black/10"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex space-x-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500 text-sm" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-slate-300 italic text-sm sm:text-base leading-relaxed mb-6">
                  "{review.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center space-x-4 border-t border-slate-700/60 pt-4 mt-6">
                <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/25 flex items-center justify-center text-blue-400 font-bold text-sm select-none shrink-0">
                  {review.initials}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center space-x-1.5">
                    <span>{review.name}</span>
                    <span>{review.flag}</span>
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">{review.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
