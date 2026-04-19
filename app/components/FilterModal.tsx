'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '../../lib/i18n/context';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [type, setType] = useState(searchParams.get('type') || 'Todos');
  const [beds, setBeds] = useState(searchParams.get('beds') ? Number(searchParams.get('beds')) : 0);
  const [baths, setBaths] = useState(searchParams.get('baths') ? Number(searchParams.get('baths')) : 0);

  // State just for UI aesthetics matching
  const [minPrice, setMinPrice] = useState('1,200,000');
  const [maxPrice, setMaxPrice] = useState('4,500,000');

  const amenities = [
    { key: 'pool', icon: 'pool' },
    { key: 'gym', icon: 'fitness_center' },
    { key: 'parking', icon: 'local_parking' },
    { key: 'ac', icon: 'ac_unit' },
    { key: 'wifi', icon: 'wifi' },
    { key: 'terrace', icon: 'deck' },
  ] as const;

  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([0, 4]); // pool & wifi

  const handleToggleAmenity = (index: number) => {
    setSelectedAmenities((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  const onAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  if (!shouldRender) return null;

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (query) params.set('query', query);
    if (type && type !== 'Todos' && type !== 'Any Type') params.set('type', type);
    if (beds > 0) params.set('beds', beds.toString());
    if (baths > 0) params.set('baths', baths.toString());

    params.delete('page');

    router.push(`/?${params.toString()}`);
    onClose();
  };

  const clearFilters = () => {
    setQuery('');
    setType('Todos');
    setBeds(0);
    setBaths(0);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100 font-display' : 'opacity-0 pointer-events-none'}`}
      onTransitionEnd={onAnimationEnd}
    >
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-nordic/40 backdrop-blur-sm z-10 transition-opacity" onClick={onClose}></div>

      {/* Main Modal Container */}
      <main className={`relative z-20 w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>

        {/* Header */}
        <header className="px-8 py-6 border-b border-black/5 flex justify-between items-center bg-white sticky top-0 z-30">
          <h1 className="text-2xl font-semibold tracking-tight text-nordic">{t('filter.title')}</h1>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 transition-colors text-nordic/60">
            <span className="material-icons">close</span>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto hide-scroll p-8 space-y-10">
          {/* Section 1: Location */}
          <section>
            <label className="block text-xs font-semibold text-nordic/60 uppercase tracking-wider mb-3">
              {t('filter.location_label')}
            </label>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-3.5 text-nordic/40 group-focus-within:text-mosque transition-colors">search</span>
              <input
                className="w-full pl-12 pr-12 py-3 bg-clear-day border-0 rounded-lg text-nordic placeholder-nordic/40 focus:ring-2 focus:ring-mosque focus:bg-white transition-all shadow-sm outline-none"
                placeholder={t('filter.location_placeholder')}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-2.5 p-1 rounded-full hover:bg-black/5 text-nordic/40 hover:text-nordic transition-colors cursor-pointer"
                >
                  <span className="material-icons text-xl">close</span>
                </button>
              )}
            </div>
          </section>


          {/* Section 2: Price Range (Visual Only) */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-semibold text-nordic/60 uppercase tracking-wider">
                {t('filter.price_label')}
              </label>
              <span className="text-sm font-medium text-mosque">${minPrice} – ${maxPrice}</span>
            </div>
            <div className="relative h-12 flex items-center mb-6 px-2">
              <div className="absolute w-full h-1 bg-black/10 rounded-full overflow-hidden">
                <div className="h-full bg-mosque w-1/3 ml-[20%]"></div>
              </div>
              <div className="absolute left-[20%] w-6 h-6 bg-white border-2 border-mosque rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform -ml-3 z-10"></div>
              <div className="absolute left-[53%] w-6 h-6 bg-white border-2 border-mosque rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform -ml-3 z-10"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-clear-day p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-nordic/60 uppercase font-medium mb-1">{t('filter.price_min')}</label>
                <div className="flex items-center">
                  <span className="text-nordic/40 mr-1">$</span>
                  <input className="w-full bg-transparent border-0 p-0 text-nordic font-medium focus:ring-0 text-sm outline-none" type="text" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                </div>
              </div>
              <div className="bg-clear-day p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-nordic/60 uppercase font-medium mb-1">{t('filter.price_max')}</label>
                <div className="flex items-center">
                  <span className="text-nordic/40 mr-1">$</span>
                  <input className="w-full bg-transparent border-0 p-0 text-nordic font-medium focus:ring-0 text-sm outline-none" type="text" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Property Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Property Type */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-nordic/60 uppercase tracking-wider">
                {t('filter.type_label')}
              </label>
              <div className="relative">
                <select
                  className="w-full bg-clear-day border-0 rounded-lg py-3 pl-4 pr-10 text-nordic appearance-none focus:ring-2 focus:ring-mosque cursor-pointer outline-none"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Todos">{t('filter.type_any')}</option>
                  <option value="Casas">{t('filter.types.houses')}</option>
                  <option value="Apartamentos">{t('filter.types.apartments')}</option>
                  <option value="Villas">{t('filter.types.villas')}</option>
                  <option value="Penthouses">{t('filter.types.penthouses')}</option>
                </select>
                <span className="material-icons absolute right-3 top-3 text-nordic/40 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Rooms */}
            <div className="space-y-4">
              {/* Beds */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-nordic">{t('filter.beds')}</span>
                <div className="flex items-center space-x-3 bg-clear-day rounded-full p-1">
                  <button
                    onClick={() => setBeds(Math.max(0, beds - 1))}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-nordic/60 hover:text-mosque disabled:opacity-50 transition-colors"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{beds > 0 ? `${beds}+` : '0'}</span>
                  <button
                    onClick={() => setBeds(beds + 1)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>

              {/* Baths */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-nordic">{t('filter.baths')}</span>
                <div className="flex items-center space-x-3 bg-clear-day rounded-full p-1">
                  <button
                    onClick={() => setBaths(Math.max(0, baths - 1))}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-nordic/60 hover:text-mosque transition-colors"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{baths > 0 ? `${baths}+` : '0'}</span>
                  <button
                    onClick={() => setBaths(baths + 1)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Amenities (Visual Only) */}
          <section>
            <label className="block text-xs font-semibold text-nordic/60 uppercase tracking-wider mb-4">
              {t('filter.amenities_label')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenities.map((amenity, idx) => (
                <label key={idx} className="cursor-pointer group relative">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={selectedAmenities.includes(idx)}
                    onChange={() => handleToggleAmenity(idx)}
                  />
                  <div className={`h-full px-4 py-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all 
                    ${selectedAmenities.includes(idx)
                      ? 'border-mosque bg-mosque/5 text-mosque font-medium hover:bg-mosque/10'
                      : 'border-black/10 bg-white text-nordic/80 hover:border-black/20'}`}>
                    <span className={`material-icons text-lg ${selectedAmenities.includes(idx) ? 'text-mosque' : 'text-nordic/40 group-hover:text-nordic/60'}`}>
                      {amenity.icon}
                    </span>
                    {t(`filter.amenities.${amenity.key}`)}
                  </div>
                  {selectedAmenities.includes(idx) && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full opacity-100 transition-opacity"></div>
                  )}
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-black/5 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-nordic/60 hover:text-nordic transition-colors underline decoration-black/20 underline-offset-4"
          >
            {t('filter.clear')}
          </button>
          <button
            onClick={handleSearch}
            className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/30 transition-all hover:shadow-mosque/40 flex items-center gap-2 transform active:scale-95 cursor-pointer"
          >
            {t('filter.apply')}
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>
      </main>
    </div>
  );
};

export default FilterModal;
