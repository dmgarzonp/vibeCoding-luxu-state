'use client';

import React from 'react';
import { useTranslation } from '../../lib/i18n/context';

interface PropertyStatusBadgesProps {
  isFeatured: boolean;
  isNew: boolean;
  status: string;
}

export function PropertyStatusBadges({ isFeatured, isNew, status }: PropertyStatusBadgesProps) {
  const { t } = useTranslation();
  return (
    <div className="absolute top-4 left-4 flex gap-2">
      {isFeatured && (
        <span className="bg-mosque text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
          {t('property.featured_badge')}
        </span>
      )}
      {isNew && (
        <span className="bg-white/90 backdrop-blur text-nordic text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
          {t('property.new_badge')}
        </span>
      )}
      <span className={`${status === 'FOR RENT' ? 'bg-mosque' : 'bg-nordic'} text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm`}>
        {status === 'FOR RENT' ? t('property.for_rent') : t('property.for_sale')}
      </span>
    </div>
  );
}

interface PropertyBreadcrumbProps {
  status: string;
  title: string;
}

export function PropertyBreadcrumb({ status, title }: PropertyBreadcrumbProps) {
  const { t } = useTranslation();
  return (
    <nav className="flex text-sm text-nordic/60 mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <a href="/" className="hover:text-mosque transition-colors">{t('property.home')}</a>
        </li>
        <li>
          <div className="flex items-center">
            <span className="material-icons text-sm mx-1">chevron_right</span>
            <span className="hover:text-mosque transition-colors cursor-pointer">
              {status === 'FOR SALE' ? t('property.for_sale') : t('property.for_rent')}
            </span>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <span className="material-icons text-sm mx-1">chevron_right</span>
            <span className="text-nordic font-medium truncate max-w-[200px]">{title}</span>
          </div>
        </li>
      </ol>
    </nav>
  );
}

interface PropertyActionsProps {
  title: string;
  location: string;
  price: string;
}

export function PropertyActions({ title, location, price }: PropertyActionsProps) {
  const { t } = useTranslation();
  void title;
  return (
    <>
      <div className="mb-4">
        <h1 className="text-4xl font-display font-light text-nordic mb-2">{price}</h1>
        <p className="text-nordic/60 font-medium flex items-center gap-1">
          <span className="material-icons text-mosque text-sm">location_on</span>
          {location}
        </p>
      </div>
      <div className="h-px bg-slate-100 my-6"></div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100"
            alt="Agent"
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h3 className="font-semibold text-nordic">Elena Restrepo</h3>
          <div className="flex items-center gap-1 text-xs text-mosque font-medium">
            <span className="material-icons text-[14px]">star</span>
            <span>{t('property.agent_badge')}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
            <span className="material-icons text-sm">chat</span>
          </button>
          <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
            <span className="material-icons text-sm">call</span>
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <button className="w-full bg-mosque hover:bg-mosque/90 text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group">
          <span className="material-icons text-xl group-hover:scale-110 transition-transform">calendar_today</span>
          {t('property.schedule')}
        </button>
        <button className="w-full bg-transparent border border-nordic/10 hover:border-mosque text-nordic/80 hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
          <span className="material-icons text-xl">mail_outline</span>
          {t('property.contact')}
        </button>
      </div>
    </>
  );
}

interface PropertyDetailsTextsProps {
  beds: number;
  baths: number;
  sqm: number;
  title: string;
  location: string;
  type: string;
  isHouseOrVilla: boolean;
}

export function PropertyDetailsTexts({ beds, baths, sqm, title, location, type, isHouseOrVilla }: PropertyDetailsTextsProps) {
  const { t } = useTranslation();

  const desc1 = t('property.about_desc_1')
    .replace('{title}', title)
    .replace('{location}', location)
    .replace('{type}', type.toLowerCase());

  return (
    <>
      {/* Key Features */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
        <h2 className="text-lg font-semibold mb-6 text-nordic">{t('property.features_title')}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
            <span className="material-icons text-mosque text-2xl mb-2">square_foot</span>
            <span className="text-xl font-bold text-nordic">{sqm}</span>
            <span className="text-xs uppercase tracking-wider text-nordic/50">{t('property.sqm')}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
            <span className="material-icons text-mosque text-2xl mb-2">bed</span>
            <span className="text-xl font-bold text-nordic">{beds}</span>
            <span className="text-xs uppercase tracking-wider text-nordic/50">{t('property.bedrooms')}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
            <span className="material-icons text-mosque text-2xl mb-2">shower</span>
            <span className="text-xl font-bold text-nordic">{baths}</span>
            <span className="text-xs uppercase tracking-wider text-nordic/50">{t('property.bathrooms')}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
            <span className="material-icons text-mosque text-2xl mb-2">directions_car</span>
            <span className="text-xl font-bold text-nordic">2</span>
            <span className="text-xs uppercase tracking-wider text-nordic/50">{t('property.garages')}</span>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
        <h2 className="text-lg font-semibold mb-4 text-nordic">{t('property.about_title')}</h2>
        <div className="prose prose-slate max-w-none text-nordic/70 leading-relaxed font-light">
          <p className="mb-4">{desc1}</p>
          <p>{t('property.about_desc_2')}</p>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
        <h2 className="text-lg font-semibold mb-6 text-nordic">{t('property.amenities_title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
          {(['smart_home', 'ac', 'security', 'bbq'] as const).map((key) => (
            <div key={key} className="flex items-center gap-3 text-nordic/70 hover:text-mosque transition-colors">
              <span className="material-icons text-mosque/60 text-sm">check_circle</span>
              <span className="font-light">{t(`property.amenities.${key}`)}</span>
            </div>
          ))}
          <div className="flex items-center gap-3 text-nordic/70 hover:text-mosque transition-colors">
            <span className="material-icons text-mosque/60 text-sm">check_circle</span>
            <span className="font-light">
              {isHouseOrVilla ? t('property.amenities.garden') : t('property.amenities.pool')}
            </span>
          </div>
        </div>
      </div>

      {/* Mortgage Calculator Widget */}
      <div className="bg-mosque/5 p-6 rounded-xl border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-full text-mosque shadow-sm shrink-0">
            <span className="material-icons">calculate</span>
          </div>
          <div>
            <h3 className="font-semibold text-nordic">{t('property.mortgage_title')}</h3>
            <p
              className="text-sm text-nordic/60 font-light mt-1"
              dangerouslySetInnerHTML={{ __html: t('property.mortgage_sub') }}
            />
          </div>
        </div>
        <button className="whitespace-nowrap px-6 py-2.5 bg-white border border-nordic/10 rounded-lg text-sm font-semibold hover:border-mosque transition-colors text-nordic">
          {t('property.mortgage_btn')}
        </button>
      </div>
    </>
  );
}

interface PropertyViewPhotosProps {
  children?: React.ReactNode;
}

export function PropertyViewPhotosBtn({ children }: PropertyViewPhotosProps) {
  const { t } = useTranslation();
  void children;
  return (
    <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2">
      <span className="material-icons text-sm">grid_view</span>
      {t('property.view_photos')}
    </button>
  );
}

export function PropertyViewMapLink() {
  const { t } = useTranslation();
  return (
    <a href="#" className="absolute bottom-4 right-4 bg-white/90 text-xs font-medium px-2 py-1 rounded shadow-sm text-nordic hover:text-mosque z-[1000] pointer-events-auto backdrop-blur-sm">
      {t('property.view_map')}
    </a>
  );
}

export function PropertyFooter() {
  const { t } = useTranslation();
  return (
    <footer className="bg-white border-t border-slate-200 mt-12 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm text-nordic/50 font-light">
          {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
