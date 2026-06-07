import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaClock, FaCreditCard, FaUniversity, FaGlobe, FaCoins } from 'react-icons/fa';

export default function Contact() {
  const [state, handleSubmit] = useForm(import.meta.env.VITE_FORMSPREE_ID || 'YOUR_FORMSPREE_ID');
  const [formData, setFormData] = useState({

    name: '',
    email: '',
    phone: '+91 ',
    company: '',
    plan: 'Growth',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [triedSubmit, setTriedSubmit] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim() || formData.phone.trim() === '+91') {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    return newErrors;
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setTriedSubmit(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to the first error
      const firstError = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    handleSubmit(e);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (triedSubmit) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0F172A] relative overflow-hidden border-t border-slate-800 text-white">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-3">
            Get In Touch
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Let's build something for life
          </p>
          <p className="text-lg text-slate-400">
            Have questions about customized scale requirements or custom payment integrations? Drop us a line.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Left Side — Form */}
          <div className="lg:col-span-7 bg-[#1E293B] border border-slate-700/60 p-8 rounded-3xl shadow-xl shadow-black/25">
            {state.succeeded ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                  ✓
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Message Received!</h4>
                <p className="text-emerald-400 font-semibold max-w-md mx-auto text-sm sm:text-base">
                  Thanks! We'll be back within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmitHandler} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-slate-300 font-semibold text-xs uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className={`w-full px-4 py-3 rounded-xl border bg-[#0F172A] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        triedSubmit && errors.name ? 'border-red-500' : 'border-slate-700'
                      }`}
                    />
                    {triedSubmit && errors.name && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-slate-300 font-semibold text-xs uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 rounded-xl border bg-[#0F172A] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        triedSubmit && errors.email ? 'border-red-500' : 'border-slate-700'
                      }`}
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1.5" />
                    {triedSubmit && errors.email && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-slate-300 font-semibold text-xs uppercase tracking-wider mb-2">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91-7355802729"
                      className={`w-full px-4 py-3 rounded-xl border bg-[#0F172A] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        triedSubmit && errors.phone ? 'border-red-500' : 'border-slate-700'
                      }`}
                    />
                    {triedSubmit && errors.phone && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone}</p>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="block text-slate-300 font-semibold text-xs uppercase tracking-wider mb-2">
                      Company <span className="text-slate-500 text-xxs font-normal">(Optional)</span>
                    </label>
                    <input
                      id="company"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0F172A] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Plan Interest */}
                <div>
                  <label htmlFor="plan" className="block text-slate-300 font-semibold text-xs uppercase tracking-wider mb-2">
                    Plan Interest *
                  </label>
                  <select
                    id="plan"
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0F172A] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="Starter">Starter — ₹1,499/mo</option>
                    <option value="Growth">Growth — ₹3,999/mo</option>
                    <option value="Scale">Scale — ₹8,999/mo</option>
                    <option value="Custom">Custom Enterprise Solution</option>
                    <option value="Just exploring">Just exploring</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-slate-300 font-semibold text-xs uppercase tracking-wider mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what you are building, scale requirements, or general inquiries..."
                    className={`w-full px-4 py-3 rounded-xl border bg-[#0F172A] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${
                      triedSubmit && errors.message ? 'border-red-500' : 'border-slate-700'
                    }`}
                  />
                  <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-xs mt-1.5" />
                  {triedSubmit && errors.message && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Right Side — Info Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {/* Email */}
            <a
              href="mailto:support@saasforlife.co.in"
              className="p-6 rounded-2xl bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all duration-300 flex items-start space-x-4 group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
                <FaEnvelope />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1">Email Us</h4>
                <p className="text-sm font-semibold text-white break-all group-hover:text-blue-400 transition-colors">
                  support@saasforlife.co.in
                </p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/917355802729"
              target="_blank"
              rel="noreferrer"
              className="p-6 rounded-2xl bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all duration-300 flex items-start space-x-4 group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shrink-0">
                <FaWhatsapp />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1">Chat on WhatsApp</h4>
                <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  +91-7355802729
                </p>
              </div>
            </a>

            {/* Location */}
            <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 flex items-start space-x-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1">Location</h4>
                <p className="text-sm font-semibold text-white">
                  India — serving worldwide
                </p>
              </div>
            </div>

            {/* Response Time */}
            <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 flex items-start space-x-4">
              <div className="w-10 h-10 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <FaClock />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1">Response Time</h4>
                <p className="text-sm font-semibold text-white">
                  Within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Payments Footer */}
        <div className="border-t border-slate-800 pt-12 text-center max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
            Alternative payment channels supported
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200">
              <FaCreditCard className="text-blue-500 text-sm" />
              <span>Razorpay (Cards/UPI/Netbanking)</span>
            </div>
            <div className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200">
              <FaCoins className="text-emerald-500 text-sm" />
              <span>Cryptocurrency (USDT/USDC/BTC/ETH)</span>
            </div>
            <div className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200">
              <FaUniversity className="text-blue-500 text-sm" />
              <span>Bank Transfer (NEFT/RTGS/IMPS)</span>
            </div>
            <div className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200">
              <FaGlobe className="text-blue-500 text-sm" />
              <span>International SWIFT Wire Transfer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
