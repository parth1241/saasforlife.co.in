import React from 'react';
import { FaTwitter, FaLinkedin, FaInstagram, FaGithub, FaEnvelope, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] border-t border-slate-800 pt-16 pb-8 relative overflow-hidden text-slate-400">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-1 font-bold text-xl tracking-tight text-white select-none">
              saasforlife.co.in<span className="text-blue-500 text-2xl leading-none">.</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              World-class software solutions engineered in India. Built for speed, compliance, and life.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200" aria-label="Twitter">
                <FaTwitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200" aria-label="LinkedIn">
                <FaLinkedin size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200" aria-label="Instagram">
                <FaInstagram size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200" aria-label="GitHub">
                <FaGithub size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#refund" className="hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-3.5 text-sm">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Contact Info</h4>
            <div className="flex items-center space-x-2.5">
              <FaEnvelope className="text-blue-500 shrink-0" />
              <a href="mailto:support@saasforlife.co.in" className="hover:text-white transition-colors break-all">
                support@saasforlife.co.in
              </a>
            </div>
            <div className="flex items-center space-x-2.5">
              <FaWhatsapp className="text-emerald-500 shrink-0" />
              <a href="https://wa.me/917355802729" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                +91-7355802729
              </a>
            </div>
            <div className="flex items-center space-x-2.5">
              <FaMapMarkerAlt className="text-indigo-500 shrink-0" />
              <span>India — serving worldwide</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2025 saasforlife.co.in — Made in India 🇮🇳 for the world</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#refund" className="hover:text-white transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
