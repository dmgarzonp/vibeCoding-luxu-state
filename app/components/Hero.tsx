'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterModal from './FilterModal';
import { useTranslation } from '../../lib/i18n/context';

const Hero = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const currentType = searchParams?.get('type') || t('hero.categories.all');
  const [query, setQuery] = useState(searchParams?.get('query') || '');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const categoryKeys = ['all', 'houses', 'apartments', 'villas', 'penthouses'] as const;
  // Map translated label → DB value (DB values are the Spanish ones stored in Supabase)
  const dbValues: Record<string, string> = {
    [t('hero.categories.all')]: 'Todos',
    [t('hero.categories.houses')]: 'Casas',
    [t('hero.categories.apartments')]: 'Apartamentos',
    [t('hero.categories.villas')]: 'Villas',
    [t('hero.categories.penthouses')]: 'Penthouses',
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const setCategoryFilter = (dbValue: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (dbValue && dbValue !== 'Todos') {
      params.set('type', dbValue);
    } else {
      params.delete('type');
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  // Active category: the URL param holds the DB value
  const activeDbType = searchParams?.get('type') || 'Todos';

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic leading-tight">
          {t('hero.title_start')} <span className="relative inline-block">
            <span className="relative z-10 font-medium italic">{t('hero.title_highlight')}</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
          </span>.
        </h1>

        {/* Search Bar */}
        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-icons text-nordic/50 text-2xl group-focus-within:text-mosque transition-colors">search</span>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white text-nordic shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] placeholder-nordic/40 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-lg outline-none"
            placeholder={t('hero.placeholder')}
          />
          <button
            onClick={handleSearch}
            className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20 cursor-pointer"
          >
            {t('hero.search_btn')}
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
          {categoryKeys.map((key) => {
            const label = t(`hero.categories.${key}`);
            const dbValue = key === 'all' ? 'Todos' : dbValues[label] || label;
            const isActive = key === 'all' ? activeDbType === 'Todos' : activeDbType === dbValue;
            return (
              <button
                key={key}
                onClick={() => setCategoryFilter(dbValue)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5 cursor-pointer ${
                  isActive
                    ? 'bg-nordic text-white shadow-lg shadow-nordic/10'
                    : 'bg-white border border-nordic/5 text-nordic/60 hover:text-nordic hover:border-mosque/50 hover:bg-mosque/5'
                }`}
              >
                {label}
              </button>
            );
          })}
          <div className="w-px h-6 bg-nordic/10 mx-2"></div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic font-medium text-sm hover:bg-black/5 transition-colors cursor-pointer"
          >
            <span className="material-icons text-base">tune</span> {t('hero.filters_btn')}
          </button>
        </div>
      </div>

      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
    </section>
  );
};

export default Hero;
