'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SUPPORTED_LOCALES, LOCALE_NAMES, LOCALE_FLAGS, type Locale } from '../../lib/i18n/config';
import { useTranslation } from '../../lib/i18n/context';

const LanguageSelector = () => {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        id="language-selector-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-nordic/70 hover:text-nordic hover:bg-nordic/5 transition-all text-sm font-medium select-none cursor-pointer"
      >
        <span className="text-base leading-none">{LOCALE_FLAGS[locale]}</span>
        <span className="hidden sm:inline uppercase tracking-wide text-[11px] font-semibold">
          {locale}
        </span>
        <span
          className={`material-icons text-[14px] text-nordic/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-nordic/5 overflow-hidden z-[200] animate-fade-in-down"
        >
          <div className="py-1">
            {SUPPORTED_LOCALES.map((loc) => {
              const isActive = loc === locale;
              return (
                <button
                  key={loc}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSelect(loc)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-mosque/5 text-mosque font-semibold'
                      : 'text-nordic/70 hover:bg-nordic/5 hover:text-nordic'
                  }`}
                >
                  <span className="text-lg leading-none">{LOCALE_FLAGS[loc]}</span>
                  <span className="flex-1 text-left">{LOCALE_NAMES[loc]}</span>
                  {isActive && (
                    <span className="material-icons text-mosque text-sm">check</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
