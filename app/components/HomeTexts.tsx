'use client';

import React from 'react';
import { useTranslation } from '../../lib/i18n/context';

interface HomeTextsProps {
  isFeaturedVisible: boolean;
  featuredSection: React.ReactNode;
  listingsSection: React.ReactNode;
}

/**
 * Thin client wrapper that provides translated section headings for the home page.
 * The actual property cards (server-rendered) are passed as children via slots.
 */
export function HomeTexts({ isFeaturedVisible, featuredSection, listingsSection }: HomeTextsProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Featured Collections Section */}
      {isFeaturedVisible && (
        <section className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic">{t('featured.title')}</h2>
              <p className="text-nordic/60 mt-1 text-sm font-light">{t('featured.subtitle')}</p>
            </div>
            <a href="#" className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity">
              {t('featured.view_all')} <span className="material-icons text-sm">arrow_forward</span>
            </a>
          </div>
          {featuredSection}
        </section>
      )}

      {/* New in Market Section */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-light text-nordic">{t('listings.title')}</h2>
            <p className="text-nordic/60 mt-1 text-sm font-light">{t('listings.subtitle')}</p>
          </div>
          <div className="hidden md:flex bg-white p-1 rounded-lg border border-nordic/5 shadow-sm">
            <button className="px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-nordic text-white">
              {t('listings.all')}
            </button>
            <button className="px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-nordic/40 hover:text-nordic">
              {t('listings.for_sale')}
            </button>
            <button className="px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-nordic/40 hover:text-nordic">
              {t('listings.for_rent')}
            </button>
          </div>
        </div>
        {listingsSection}
      </section>
    </>
  );
}
