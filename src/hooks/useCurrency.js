import { useState, useEffect } from 'react';
import axios from 'axios';
import { CURRENCIES } from '../utils/currency';

const FALLBACK_RATES = {
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  AED: 0.044,
  SGD: 0.016,
  INR: 1,
};

export const useCurrency = () => {
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem('saas_selected_currency') || 'INR';
  });
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/INR');
        if (response.data && response.data.rates) {
          // Keep only supported currencies rates
          const fetchedRates = {};
          Object.keys(FALLBACK_RATES).forEach((code) => {
            fetchedRates[code] = response.data.rates[code] || FALLBACK_RATES[code];
          });
          setRates(fetchedRates);
        }
      } catch (error) {
        console.error('Failed to fetch live rates from exchangerate-api, using fallback rates:', error);
        setRates(FALLBACK_RATES);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  // Save selected currency choice to localStorage
  useEffect(() => {
    localStorage.setItem('saas_selected_currency', selectedCurrency);
  }, [selectedCurrency]);

  const convert = (inrAmount) => {
    if (selectedCurrency === 'INR') return inrAmount;
    const rate = rates[selectedCurrency] || FALLBACK_RATES[selectedCurrency];
    const raw = inrAmount * rate;
    
    // Round to a "good number" ending in .99 (e.g. 17.988 -> 17.99)
    // Ensures the value is strictly never less than the raw converted rate.
    const option1 = Math.floor(raw) + 0.99;
    if (option1 >= raw) {
      return option1;
    }
    return Math.floor(raw) + 1.99;
  };


  const symbol = CURRENCIES[selectedCurrency]?.symbol || '₹';

  return {
    rates,
    selectedCurrency,
    setSelectedCurrency,
    convert,
    symbol,
    loading,
  };
};
