import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { FaCheck } from 'react-icons/fa';
import { useCurrency } from '../hooks/useCurrency';
import { formatPrice } from '../utils/currency';
import { openRazorpay } from '../utils/razorpay';
import CurrencySwitcher from './CurrencySwitcher';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Pricing() {
  const { selectedCurrency, setSelectedCurrency, convert, symbol } = useCurrency();
  const [isAnnual, setIsAnnual] = useState(false);
  const { user, updateLocalUser } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPriceINR: 1499,
      features: [
        '1 website',
        'Automatic SSL certificate',
        '5GB high-speed SSD storage',
        'Email support (48hr SLA)',
        'Basic analytics dashboard',
        'Uptime monitoring alerts',
      ],
      popular: false,
    },
    {
      id: 'growth',
      name: 'Growth',
      monthlyPriceINR: 3999,
      features: [
        '5 websites',
        'Everything in Starter',
        'Custom domain mapping',
        'Priority support (12hr SLA)',
        'Advanced analytics suite',
        'Monthly Strategy Call (1-on-1)',
      ],
      popular: true,
    },
    {
      id: 'scale',
      name: 'Scale',
      monthlyPriceINR: 8999,
      features: [
        'Unlimited websites',
        'Everything in Growth',
        'Dedicated account manager',
        'Enterprise SLA (4hr response)',
        'White-label portal access',
        'Developer API & webhooks',
        'Custom integration setup',
      ],
      popular: false,
    },
  ];

  const handleSubscription = async (plan) => {
    if (!user) {
      alert("Please log in or register to purchase a subscription plan.");
      navigate('/login');
      return;
    }

    // Calculate total charge amount in INR (since Razorpay expects INR)
    const baseMonthlyPrice = plan.monthlyPriceINR;
    const finalMonthlyPrice = isAnnual ? baseMonthlyPrice * 0.8 : baseMonthlyPrice;
    
    // Total charged amount: 1 month if monthly, 12 months if annual
    const totalINR = isAnnual ? finalMonthlyPrice * 12 : finalMonthlyPrice;
    const billingCycle = isAnnual ? 'Annual' : 'Monthly';

    try {
      const result = await openRazorpay(plan.name, totalINR, billingCycle);
      
      if (result && result.success) {
        // Call backend API to upgrade user subscription status
        const response = await axios.post('/api/dashboard/upgrade', {
          plan: plan.name,
          billingCycle: billingCycle
        });

        if (response.data && response.data.success) {
          // Update the React local auth state
          updateLocalUser({
            plan: plan.name,
            planStatus: 'Active',
            planBilling: billingCycle
          });
          
          alert(`Success! Your account has been upgraded to ${plan.name} Plan.`);
          navigate('/dashboard');
        } else {
          alert("Payment succeeded but subscription activation failed. Please contact customer support.");
        }
      }
    } catch (error) {
      console.error("Subscription payment error:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  return (
    <section id="pricing" className="py-24 bg-[#0F172A] relative overflow-hidden border-t border-slate-800">
      {/* Background Blobs */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-3">
            Flexible Plans
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Sub subscriptions tailored to you
          </p>
          <p className="text-lg text-slate-400">
            Select the perfect package for your team. Switch currencies to see rates in USD, EUR, INR, and more.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="mb-8">
          <CurrencySwitcher 
            selectedCurrency={selectedCurrency} 
            setSelectedCurrency={setSelectedCurrency} 
          />
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center space-x-4 mb-16">
          <span className={`text-sm font-semibold transition-colors duration-200 ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 bg-slate-800 border border-slate-700 rounded-full p-1 relative transition-all duration-300 cursor-pointer"
            aria-label="Toggle billing cycle"
          >
            <div className={`w-6 h-6 bg-blue-600 rounded-full transition-all duration-300 ${
              isAnnual ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
          <span className={`text-sm font-semibold transition-colors duration-200 flex items-center space-x-1.5 ${isAnnual ? 'text-white' : 'text-slate-400'}`}>
            <span>Annually</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
              Save 20%
            </span>
          </span>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan) => {
            // Apply 20% discount if annual selected, then convert using current exchange rate
            const baseMonthly = plan.monthlyPriceINR;
            const displayedMonthly = isAnnual ? baseMonthly * 0.8 : baseMonthly;
            const convertedMonthly = convert(displayedMonthly);

            return (
              <div
                key={plan.id}
                className={`flex flex-col p-8 rounded-3xl bg-slate-800 border ${
                  plan.popular
                    ? 'border-blue-500 relative shadow-xl shadow-blue-500/5 lg:scale-[1.03]'
                    : 'border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-600/20">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                </div>

                <div className="flex items-baseline mb-6">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {formatPrice(convertedMonthly, selectedCurrency)}
                  </span>
                  <span className="text-slate-400 text-sm font-medium ml-2">
                    /mo
                  </span>
                </div>

                {isAnnual && (
                  <p className="text-xs text-blue-400 font-semibold mb-4 leading-none">
                    Billed annually (Total: {formatPrice(convert(displayedMonthly * 12), selectedCurrency)})
                  </p>
                )}

                <button
                  onClick={() => handleSubscription(plan)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 mb-8 cursor-pointer text-center ${
                    plan.popular
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98]'
                      : 'border border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800'
                  }`}
                >
                  Get Started
                </button>

                <div className="flex-grow">
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-sm text-slate-300">
                        <FaCheck className="text-blue-500 mt-0.5 shrink-0 text-base" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Options Footer */}
        <div className="mt-20 text-center border-t border-slate-800 pt-10 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-2 text-sm text-slate-400">
          <span>Also accept: <strong>UPI</strong> | <strong>NEFT/RTGS</strong> | <strong>International Wire</strong></span>
          <Link
            to="contact"
            smooth={true}
            offset={-80}
            duration={600}
            className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 hover:text-white rounded-lg transition-all text-xs font-semibold cursor-pointer"
          >
            Contact for payment options
          </Link>
        </div>
      </div>
    </section>
  );
}
