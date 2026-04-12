'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../../lib/i18n/context';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 z-50 bg-clear-day/95 backdrop-blur-md border-b border-nordic/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-nordic flex items-center justify-center">
                <span className="material-icons text-white text-lg">apartment</span>
              </div>
              <span className="text-xl font-semibold tracking-tight text-nordic">LuxeEstate</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1" href="#">{t('nav.buy')}</a>
            <a className="text-nordic/70 hover:text-nordic font-medium text-sm hover:border-b-2 hover:border-nordic/20 px-1 py-1 transition-all" href="#">{t('nav.rent')}</a>
            <a className="text-nordic/70 hover:text-nordic font-medium text-sm hover:border-b-2 hover:border-nordic/20 px-1 py-1 transition-all" href="#">{t('nav.sell')}</a>
            <a className="text-nordic/70 hover:text-nordic font-medium text-sm hover:border-b-2 hover:border-nordic/20 px-1 py-1 transition-all" href="#">{t('nav.saved')}</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className="text-nordic hover:text-mosque transition-colors">
              <span className="material-icons">search</span>
            </button>
            <button className="text-nordic hover:text-mosque transition-colors relative">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-clear-day"></span>
            </button>

            {/* Language Selector */}
            <div className="border-l border-nordic/10 pl-3">
              <LanguageSelector />
            </div>

            <button className="flex items-center gap-2 pl-2 border-l border-nordic/10">
              <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all">
                <img
                  alt="Profile"
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                />
              </div>
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-nordic"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="material-icons">{isMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-nordic/5 bg-clear-day overflow-hidden transition-all duration-300">
          <div className="px-4 py-2 space-y-1">
            <a className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10" href="#">{t('nav.buy')}</a>
            <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic hover:bg-nordic/5" href="#">{t('nav.rent')}</a>
            <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic hover:bg-nordic/5" href="#">{t('nav.sell')}</a>
            <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic hover:bg-nordic/5" href="#">{t('nav.saved')}</a>
            <div className="pt-2 pb-1 px-3">
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
