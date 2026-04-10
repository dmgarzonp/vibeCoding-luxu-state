'use client';

import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('./PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-slate-100 animate-pulse rounded-lg flex items-center justify-center">
      <span className="material-icons text-mosque">map</span>
    </div>
  ),
});

export default PropertyMap;
