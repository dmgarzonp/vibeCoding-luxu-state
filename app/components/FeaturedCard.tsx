import React from 'react';
import { Property } from '../data/properties';
import Link from 'next/link';

interface FeaturedCardProps {
  property: Property;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ property }) => {
  return (
    <Link href={`/property/${property.slug}`} className="block">
      <div className="group relative rounded-xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] bg-white cursor-pointer h-full">
        <div className="aspect-[4/3] w-full overflow-hidden relative">
        <img
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={property.image}
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-nordic">
          {property.isExclusive ? 'Exclusivo' : property.isNew ? 'Nuevo' : property.status}
        </div>
        
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-nordic hover:bg-mosque hover:text-white transition-all shadow-md">
          <span className="material-icons text-xl">favorite_border</span>
        </button>
        
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
      </div>
      
      <div className="p-6 relative">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-medium text-nordic group-hover:text-mosque transition-colors leading-tight">
              {property.title}
            </h3>
            <p className="text-nordic/60 text-sm flex items-center gap-1 mt-1 font-light">
              <span className="material-icons text-sm text-mosque">place</span> {property.location}
            </p>
          </div>
          <span className="text-xl font-semibold text-mosque whitespace-nowrap">
            {property.price}
          </span>
        </div>
        
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-nordic/5">
          <div className="flex items-center gap-2 text-nordic/60 text-xs font-light">
            <span className="material-icons text-lg text-mosque/40">king_bed</span> {property.beds} Hab.
          </div>
          <div className="flex items-center gap-2 text-nordic/60 text-xs font-light">
            <span className="material-icons text-lg text-mosque/40">bathtub</span> {property.baths} Baños
          </div>
          <div className="flex items-center gap-2 text-nordic/60 text-xs font-light">
            <span className="material-icons text-lg text-mosque/40">square_foot</span> {property.sqm} m²
          </div>
        </div>
      </div>
      </div>
    </Link>
  );
};

export default FeaturedCard;
