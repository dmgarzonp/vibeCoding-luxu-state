'use client';

import React from 'react';
import { Property } from '../data/properties';
import Link from 'next/link';
import { useTranslation } from '../../lib/i18n/context';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { t } = useTranslation();

  const isForRent = property.status === 'FOR RENT';

  return (
    <Link href={`/property/${property.slug}`} className="group block h-full">
      <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-300 cursor-pointer h-full flex flex-col border border-nordic/5">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={property.images?.[0] || ''}
          />

          <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-mosque hover:text-white transition-colors text-nordic shadow-sm">
            <span className="material-icons text-lg">favorite_border</span>
          </button>

          <div className={`absolute bottom-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
            isForRent ? 'bg-mosque/90' : 'bg-nordic/90'
          }`}>
            {isForRent ? t('card.for_rent') : t('card.for_sale')}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="font-bold text-lg text-nordic">
              {property.price}
              {isForRent && (
                <span className="text-xs font-normal text-nordic/50">{t('card.per_month')}</span>
              )}
            </h3>
          </div>

          <h4 className="text-nordic/80 font-medium truncate mb-0.5 text-sm">
            {property.title}
          </h4>
          <p className="text-nordic/50 text-[10px] mb-4 font-light">
            {property.location}
          </p>

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-nordic/5">
            <div className="flex items-center gap-1 text-nordic/60 text-[10px] font-light">
              <span className="material-icons text-xs text-mosque/80">king_bed</span> {property.beds}
            </div>
            <div className="flex items-center gap-1 text-nordic/60 text-[10px] font-light">
              <span className="material-icons text-xs text-mosque/80">bathtub</span> {property.baths}
            </div>
            <div className="flex items-center gap-1 text-nordic/60 text-[10px] font-light">
              <span className="material-icons text-xs text-mosque/80">square_foot</span> {property.sqm}m²
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PropertyCard;
