import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', to: 'features' },
    { name: 'Pricing', to: 'pricing' },
    { name: 'Testimonials', to: 'testimonials' },
    { name: 'Contact', to: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0F172A]/85 backdrop-blur-md border-b border-slate-800/80 py-4' 
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        {location.pathname === '/' ? (
          <Link
            to="hero"
            smooth={true}
            duration={500}
            className="flex items-center cursor-pointer select-none font-bold text-xl tracking-tight text-white"
          >
            saasforlife.co.in<span className="text-blue-500 text-2xl leading-none">.</span>
          </Link>
        ) : (
          <RouterLink
            to="/"
            className="flex items-center cursor-pointer select-none font-bold text-xl tracking-tight text-white"
          >
            saasforlife.co.in<span className="text-blue-500 text-2xl leading-none">.</span>
          </RouterLink>
        )}

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            location.pathname === '/' ? (
              <Link
                key={link.to}
                to={link.to}
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="text-slate-300 hover:text-white font-medium cursor-pointer transition-colors duration-200"
              >
                {link.name}
              </Link>
            ) : (
              <RouterLink
                key={link.to}
                to={`/#${link.to}`}
                className="text-slate-300 hover:text-white font-medium cursor-pointer transition-colors duration-200"
              >
                {link.name}
              </RouterLink>
            )
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center space-x-5">
          <RouterLink
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="text-slate-300 hover:text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            {isAuthenticated ? 'Console' : 'Login'}
          </RouterLink>
          {location.pathname === '/' ? (
            <Link
              to="pricing"
              smooth={true}
              offset={-80}
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-500/10 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </Link>
          ) : (
            <RouterLink
              to="/#pricing"
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-500/10 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </RouterLink>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="text-slate-300 hover:text-white text-2xl focus:outline-none cursor-pointer"
          >
            {navOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer using AnimatePresence & framer-motion */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden fixed inset-x-0 top-[72px] bg-[#0F172A] border-b border-slate-800 z-40 flex flex-col justify-start px-6 py-8 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                location.pathname === '/' ? (
                  <Link
                    key={link.to}
                    to={link.to}
                    spy={true}
                    smooth={true}
                    offset={-80}
                    duration={500}
                    onClick={() => setNavOpen(false)}
                    className="text-lg text-slate-300 hover:text-white font-medium cursor-pointer"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <RouterLink
                    key={link.to}
                    to={`/#${link.to}`}
                    onClick={() => setNavOpen(false)}
                    className="text-lg text-slate-300 hover:text-white font-medium cursor-pointer"
                  >
                    {link.name}
                  </RouterLink>
                )
              ))}
              
              <RouterLink
                to={isAuthenticated ? "/dashboard" : "/login"}
                onClick={() => setNavOpen(false)}
                className="w-full text-center py-3.5 rounded-full border border-slate-700 text-slate-300 font-semibold hover:text-white hover:border-slate-500 transition-all cursor-pointer text-sm"
              >
                {isAuthenticated ? 'Console' : 'Login'}
              </RouterLink>
              
              {location.pathname === '/' ? (
                <Link
                  to="pricing"
                  smooth={true}
                  offset={-80}
                  onClick={() => setNavOpen(false)}
                  className="w-full text-center py-3.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all cursor-pointer shadow-lg shadow-blue-500/15"
                >
                  Get Started
                </Link>
              ) : (
                <RouterLink
                  to="/#pricing"
                  onClick={() => setNavOpen(false)}
                  className="w-full text-center py-3.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all cursor-pointer shadow-lg shadow-blue-500/15"
                >
                  Get Started
                </RouterLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}


