export const CURRENCIES = {
  INR: { symbol: '₹', label: 'INR', flag: '🇮🇳', locale: 'en-IN' },
  USD: { symbol: '$', label: 'USD', flag: '🇺🇸', locale: 'en-US' },
  EUR: { symbol: '€', label: 'EUR', flag: '🇪🇺', locale: 'en-IE' },
  GBP: { symbol: '£', label: 'GBP', flag: '🇬🇧', locale: 'en-GB' },
  AED: { symbol: 'د.إ', label: 'AED', flag: '🇦🇪', locale: 'ar-AE' },
  SGD: { symbol: 'S$', label: 'SGD', flag: '🇸🇬', locale: 'en-SG' },
};

export const formatPrice = (amount, currencyCode) => {
  const currencyInfo = CURRENCIES[currencyCode] || CURRENCIES.INR;
  
  // Format price using native Intl.NumberFormat
  return new Intl.NumberFormat(currencyInfo.locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currencyCode === 'INR' ? 0 : 2,
    maximumFractionDigits: currencyCode === 'INR' ? 0 : 2,
  }).format(amount);
};

// Backwards compatibility alias
export const formatCurrency = formatPrice;

