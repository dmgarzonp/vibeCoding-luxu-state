'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterModal from './FilterModal';

const Hero = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get('query') || '');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const categories = ['Todos', 'Casas', 'Apartamentos', 'Villas', 'Penthouses'];

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

  const setCategoryFilter = (cat: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (cat && cat !== 'Todos') {
      params.set('type', cat);
    } else {
      params.delete('type');
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic leading-tight">
          Encuentra tu <span className="relative inline-block">
            <span className="relative z-10 font-medium italic">santuario</span>
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
            placeholder="Busca por ciudad, vecindario o dirección..."
          />
          <button 
            onClick={handleSearch}
            className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20 cursor-pointer"
          >
            Buscar
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
          <button 
            onClick={() => setCategoryFilter('Todos')}
            className="whitespace-nowrap px-5 py-2 rounded-full bg-nordic text-white text-sm font-medium shadow-lg shadow-nordic/10 transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            Todos
          </button>
          {categories.slice(1).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className="whitespace-nowrap px-5 py-2 rounded-full bg-white border border-nordic/5 text-nordic/60 hover:text-nordic hover:border-mosque/50 text-sm font-medium transition-all hover:bg-mosque/5 cursor-pointer"
            >
              {cat}
            </button>
          ))}
          <div className="w-px h-6 bg-nordic/10 mx-2"></div>
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic font-medium text-sm hover:bg-black/5 transition-colors cursor-pointer"
          >
            <span className="material-icons text-base">tune</span> Filtros
          </button>
        </div>
      </div>
      
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
    </section>
  );
};

export default Hero;
