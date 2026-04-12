'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../../lib/i18n/context';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
  };

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

            <div className="pl-2 border-l border-nordic/10 relative" ref={profileRef}>
              {user ? (
                <>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all">
                      <img
                        alt="Profile"
                        className="w-full h-full object-cover"
                        src={user.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                      />
                    </div>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-nordic/5 overflow-hidden z-[200] animate-fade-in-down">
                      <div className="py-2 px-4 border-b border-nordic/5">
                        <p className="text-sm font-semibold truncate text-nordic">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <span className="material-icons text-[18px]">logout</span>
                          <span>{t('auth.logout')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/login" className="flex items-center gap-1.5 px-4 py-2 bg-nordic text-white text-sm font-medium rounded-lg hover:bg-mosque transition-colors duration-300">
                  <span className="material-icons text-[18px]">login</span>
                  <span className="hidden sm:inline">{t('auth.login')}</span>
                </Link>
              )}
            </div>

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
