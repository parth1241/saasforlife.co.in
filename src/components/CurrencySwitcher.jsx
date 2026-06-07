import React from 'react';
import { CURRENCIES } from '../utils/currency';

export default function CurrencySwitcher({ selectedCurrency, setSelectedCurrency }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-900/40 rounded-2xl border border-slate-800 max-w-max mx-auto">
      {Object.entries(CURRENCIES).map(([code, details]) => {
        const isActive = selectedCurrency === code;
        return (
          <button
            key={code}
            onClick={() => setSelectedCurrency(code)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105'
                : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
            }`}
          >
            <span className="text-sm sm:text-base leading-none">{details.flag}</span>
            <span className="tracking-wider">{code}</span>
          </button>
        );
      })}
    </div>
  );
}
