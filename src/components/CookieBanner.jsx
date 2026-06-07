import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('saasforlife-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('saasforlife-cookie-consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('saasforlife-cookie-consent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 p-6 rounded-2xl border border-slate-700 bg-slate-800/95 backdrop-blur-md shadow-2xl shadow-black/40 text-white"
        >
          <div className="mb-4">
            <h4 className="text-white font-bold text-sm mb-1.5">Cookie Preferences</h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              We use cookies to improve your experience. By continuing you agree to our{' '}
              <a href="#privacy" className="text-blue-400 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
          <div className="flex space-x-3 justify-end text-xs font-semibold">
            <button
              onClick={handleDecline}
              className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors cursor-pointer shadow shadow-blue-600/10"
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
