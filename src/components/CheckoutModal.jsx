import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCopy, FaCheck, FaQrcode, FaCreditCard, FaCoins, FaArrowLeft, FaWallet } from 'react-icons/fa';
import { openRazorpay } from '../utils/razorpay';
import axios from 'axios';

export default function CheckoutModal({ isOpen, onClose, plan, isAnnual, exchangeRates }) {
  const [paymentMethod, setPaymentMethod] = useState(null); // null | 'crypto'
  const [selectedCoin, setSelectedCoin] = useState('USDT');
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [formSucceeded, setFormSucceeded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cryptoRates, setCryptoRates] = useState({ BTC: 68000, ETH: 3500 });

  // Fetch live BTC/ETH prices on load
  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
        );
        if (response.data && response.data.bitcoin && response.data.ethereum) {
          setCryptoRates({
            BTC: response.data.bitcoin.usd || 68000,
            ETH: response.data.ethereum.usd || 3500,
          });
        }
      } catch (err) {
        console.warn('Failed to fetch live crypto rates, using fallbacks.', err);
      }
    };
    if (isOpen) {
      fetchCryptoPrices();
    }
  }, [isOpen]);

  // Reset state when modal closes/opens
  useEffect(() => {
    if (isOpen) {
      setPaymentMethod(null);
      setSelectedCoin('USDT');
      setTxHash('');
      setEmail('');
      setFormErrors({});
      setFormSucceeded(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Pricing calculations
  const baseMonthlyPrice = plan.monthlyPriceINR;
  const finalMonthlyPrice = isAnnual ? baseMonthlyPrice * 0.8 : baseMonthlyPrice;
  const totalINR = isAnnual ? finalMonthlyPrice * 12 : finalMonthlyPrice;
  const billingCycle = isAnnual ? 'Annual' : 'Monthly';

  // Convert INR to USD using rates
  const inrToUsdRate = exchangeRates.USD || 0.012;
  const priceInUSD = totalINR * inrToUsdRate;

  // Crypto wallets configuration
  const wallets = {
    USDT: {
      name: 'USDT (TRC-20)',
      network: 'TRON Network (TRC-20)',
      address: import.meta.env.VITE_CRYPTO_USDT_ADDR || 'TY3s8X7G7J8hM8s8z8y8x8w8v8u8t8s8r8',
      amount: priceInUSD.toFixed(2),
      symbol: 'USDT',
    },
    USDC: {
      name: 'USDC (ERC-20)',
      network: 'Ethereum Network (ERC-20)',
      address: import.meta.env.VITE_CRYPTO_USDC_ADDR || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      amount: priceInUSD.toFixed(2),
      symbol: 'USDC',
    },
    BTC: {
      name: 'Bitcoin (BTC)',
      network: 'Bitcoin Native Network',
      address: import.meta.env.VITE_CRYPTO_BTC_ADDR || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      amount: (priceInUSD / cryptoRates.BTC).toFixed(6),
      symbol: 'BTC',
    },
    ETH: {
      name: 'Ethereum (ETH)',
      network: 'Ethereum Network (ERC-20)',
      address: import.meta.env.VITE_CRYPTO_ETH_ADDR || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      amount: (priceInUSD / cryptoRates.ETH).toFixed(5),
      symbol: 'ETH',
    },
  };

  const activeWallet = wallets[selectedCoin];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeWallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRazorpayFlow = () => {
    onClose();
    openRazorpay(plan.name, totalINR, billingCycle);
  };

  // Custom Formspree submission for crypto validation
  const handleCryptoSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!txHash.trim()) {
      errors.txHash = 'Transaction Hash/ID is required';
    } else if (txHash.trim().length < 8) {
      errors.txHash = 'Please enter a valid transaction hash';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const formspreeId = import.meta.env.VITE_FORMSPREE_ID || 'xgobaqgv';
      const response = await axios.post(`https://formspree.io/f/${formspreeId}`, {
        email: email,
        subject: `Crypto Payment Verification: ${plan.name} Plan (${billingCycle})`,
        planName: plan.name,
        billingCycle: billingCycle,
        totalUSD: `$${priceInUSD.toFixed(2)} USD`,
        cryptoSelected: activeWallet.name,
        cryptoWalletAddress: activeWallet.address,
        cryptoExpectedAmount: `${activeWallet.amount} ${activeWallet.symbol}`,
        transactionHash: txHash,
      });

      if (response.status === 200 || response.data?.ok) {
        setFormSucceeded(true);
      } else {
        alert('Failed to submit verification. Please contact support@saasforlife.co.in directly.');
      }
    } catch (err) {
      console.error('Error submitting to Formspree:', err);
      alert('Failed to send verification email. Please retry or contact support@saasforlife.co.in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10 text-white max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800/80 flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-2">
              {paymentMethod && (
                <button
                  onClick={() => setPaymentMethod(null)}
                  className="mr-2 p-1.5 rounded-lg bg-slate-800 border border-slate-700/60 hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
                  aria-label="Back"
                >
                  <FaArrowLeft className="text-sm" />
                </button>
              )}
              <div>
                <h3 className="font-bold text-lg leading-snug">Checkout</h3>
                <p className="text-xs text-slate-400">
                  {plan.name} Plan • {billingCycle} Billing
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
              aria-label="Close modal"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-grow">
            {!paymentMethod ? (
              /* Payment Selection View */
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-slate-400">Total Payable Amount</p>
                  <p className="text-3xl font-extrabold text-white mt-1">
                    {symbol}
                    {totalINR.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </p>
                  {isAnnual && (
                    <p className="text-xxs text-blue-400 font-semibold mt-1">
                      Includes 20% discount for annual billing
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Option 1: Razorpay Card/UPI */}
                  <button
                    onClick={handleRazorpayFlow}
                    className="w-full p-5 text-left rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-blue-500 hover:bg-slate-800 transition-all group flex items-start space-x-4 cursor-pointer"
                  >
                    <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                      <FaCreditCard className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                        Card / UPI / Netbanking
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Instant activation via Razorpay. Support cards, UPI, Wallets, and Netbanking.
                      </p>
                    </div>
                  </button>

                  {/* Option 2: Crypto */}
                  <button
                    onClick={() => setPaymentMethod('crypto')}
                    className="w-full p-5 text-left rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500 hover:bg-slate-800 transition-all group flex items-start space-x-4 cursor-pointer"
                  >
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
                      <FaCoins className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                        Cryptocurrency
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Direct payment with USDT, USDC, BTC, or ETH. Manual validation (2-4 hours).
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            ) : formSucceeded ? (
              /* Success View */
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto">
                  ✓
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-white">Verification Submitted!</h4>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you! We've received your transaction hash. We will verify the transaction on the blockchain and activate your plan.
                  </p>
                  <p className="text-sm font-semibold text-emerald-400">
                    A confirmation will be sent to: {email}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-500 text-sm font-semibold transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              /* Cryptocurrency View */
              <div className="space-y-6">
                {/* Coin Pills */}
                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(wallets).map((coin) => (
                    <button
                      key={coin}
                      onClick={() => {
                        setSelectedCoin(coin);
                        setFormErrors({});
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        selectedCoin === coin
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/10'
                          : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-600'
                      }`}
                    >
                      {coin}
                    </button>
                  ))}
                </div>

                {/* Transfer Info */}
                <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Required Amount:</span>
                    <span className="text-sm font-bold text-white">
                      {activeWallet.amount} {activeWallet.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Network:</span>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/10">
                      {activeWallet.network}
                    </span>
                  </div>

                  {/* QR and Copy Panel */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                    {/* QR Code */}
                    <div className="bg-white p-2 rounded-xl shrink-0 shadow-lg shadow-black/35">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(
                          activeWallet.address
                        )}`}
                        alt="Crypto Wallet Address QR Code"
                        width="130"
                        height="130"
                        className="block"
                      />
                    </div>

                    {/* Address Display & Copy */}
                    <div className="w-full space-y-2">
                      <span className="text-xxs uppercase tracking-wider font-semibold text-slate-500">
                        Wallet Address
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono break-all flex-grow select-all select-none select-text">
                          {activeWallet.address}
                        </div>
                        <button
                          onClick={handleCopy}
                          className={`p-3 rounded-xl border transition-all shrink-0 cursor-pointer ${
                            copied
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                          }`}
                          title="Copy Wallet Address"
                        >
                          {copied ? <FaCheck className="text-sm" /> : <FaCopy className="text-sm" />}
                        </button>
                      </div>
                      <p className="text-xxs text-amber-500/80 font-medium">
                        * Only transfer on the network specified above. Incorrect network transfers result in loss of funds.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Proof of Transfer Form */}
                <form onSubmit={handleCryptoSubmit} className="space-y-4 pt-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    Verify Your Transaction
                  </h4>

                  {/* Customer Email */}
                  <div>
                    <label htmlFor="modal-email" className="block text-slate-400 text-xxs font-semibold uppercase tracking-wider mb-1.5">
                      Your Email Address *
                    </label>
                    <input
                      id="modal-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className={`w-full px-4 py-2.5 rounded-xl border bg-slate-950/40 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                        formErrors.email ? 'border-red-500' : 'border-slate-800'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xxs mt-1 font-semibold">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Transaction Hash */}
                  <div>
                    <label htmlFor="modal-txhash" className="block text-slate-400 text-xxs font-semibold uppercase tracking-wider mb-1.5">
                      Transaction Hash / ID *
                    </label>
                    <input
                      id="modal-txhash"
                      type="text"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      placeholder="Enter TxHash or TxID"
                      className={`w-full px-4 py-2.5 rounded-xl border bg-slate-950/40 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                        formErrors.txHash ? 'border-red-500' : 'border-slate-800'
                      }`}
                    />
                    {formErrors.txHash && (
                      <p className="text-red-500 text-xxs mt-1 font-semibold">{formErrors.txHash}</p>
                    )}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <span>{isSubmitting ? 'Submitting Verification...' : 'Submit Proof of Payment'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
