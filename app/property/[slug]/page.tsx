import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPropertyBySlug } from '../../../lib/actions/properties';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import { Metadata } from 'next';
import PropertyMap from '../../components/PropertyMapWrapper';
import {
  PropertyStatusBadges,
  PropertyBreadcrumb,
  PropertyActions,
  PropertyDetailsTexts,
  PropertyViewPhotosBtn,
  PropertyViewMapLink,
  PropertyFooter,
} from '../../components/PropertyClientTexts';

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: property } = await getPropertyBySlug(resolvedParams.slug);

  if (!property) return { title: 'Propiedad no encontrada | LuxeEstate' };

  return {
    title: `${property.title} - ${property.price} | LuxeEstate`,
    description: `Hermosa propiedad en ${property.location} con ${property.beds} habitaciones y ${property.baths} baños.`,
    openGraph: {
      title: property.title,
      description: `Propiedad en ${property.location} por ${property.price}`,
      images: [{ url: property.images?.[0] || '' }],
    },
  };
}

export default async function PropertyDetailsPage({ params }: PropertyPageProps) {
  const resolvedParams = await params;
  const { data: property } = await getPropertyBySlug(resolvedParams.slug);

  if (!property) {
    notFound();
  }

  const galleryImages = [
    property.images?.[0] || '',
    property.images?.[1] || property.images?.[0] || '',
    property.images?.[2] || property.images?.[0] || '',
    property.images?.[3] || property.images?.[0] || '',
  ];

  const isHouseOrVilla = property.type === 'Villa' || property.type === 'House';

  return (
    <div className="min-h-screen bg-clear-day text-nordic font-display selection:bg-mosque/20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumbs */}
        <PropertyBreadcrumb status={property.status} title={property.title} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Main Gallery Area */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group bg-slate-100">
              <Image
                src={galleryImages[0]}
                alt={property.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
              />

              <PropertyStatusBadges
                isFeatured={!!property.isFeatured}
                isNew={!!property.isNew}
                status={property.status}
              />

              <Suspense fallback={null}>
                <PropertyViewPhotosBtn />
              </Suspense>
            </div>

            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
              {galleryImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className={`relative flex-none w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer snap-start transition-opacity ${idx === 0 ? 'ring-2 ring-mosque ring-offset-2 ring-offset-clear-day' : 'opacity-70 hover:opacity-100'}`}
                >
                  <Image
                    src={imgSrc}
                    alt={`${property.title} view ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-mosque/5">
                <PropertyActions
                  title={property.title}
                  location={property.location}
                  price={property.price}
                />
              </div>

              {/* Map Block */}
              <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5 relative">
                <PropertyMap locationString={property.location} />
                <PropertyViewMapLink />
              </div>
            </div>
          </div>

          {/* Details Content Below */}
          <div className="lg:col-span-8 lg:row-start-2 -mt-8 space-y-8">
            <PropertyDetailsTexts
              beds={property.beds}
              baths={property.baths}
              sqm={property.sqm}
              title={property.title}
              location={property.location}
              type={property.type}
              isHouseOrVilla={isHouseOrVilla}
            />
          </div>
        </div>
      </main>

      <PropertyFooter />
    </div>
  );
}
