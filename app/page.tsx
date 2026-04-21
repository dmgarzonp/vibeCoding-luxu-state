import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedCard from './components/FeaturedCard';
import PropertyCard from './components/PropertyCard';
import Pagination from './components/Pagination';
import { HomeTexts } from './components/HomeTexts';
import { getProperties } from '../lib/actions/properties';
import { Suspense } from 'react';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    query?: string;
    type?: string;
    status?: string;
    beds?: string;
    baths?: string;
  }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 8;
  const query = params.query;
  const type = params.type;
  const status = params.status || 'FOR SALE';
  const beds = params.beds ? Number(params.beds) : undefined;
  const baths = params.baths ? Number(params.baths) : undefined;

  // Fetch data on the server
  const { data: featuredProperties } = await getProperties({ featured: true, query, type, status, beds, baths });
  const { data: newProperties, count: totalNew } = await getProperties({
    featured: false,
    page: currentPage,
    limit,
    query,
    type,
    status,
    beds,
    baths,
  });

  const totalPages = Math.ceil(totalNew / limit);
  const isFilterActive = !!(query || (type && type !== 'Todos') || beds || baths);
  const featuredPropertiesToDisplay = featuredProperties.slice(0, 2);

  // Pre-render the card grids (server side)
  const featuredGrid = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {featuredPropertiesToDisplay.map((property) => (
        <FeaturedCard key={property.id} property={property} />
      ))}
    </div>
  );

  const listingsGrid = (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {newProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-clear-day text-nordic font-display selection:bg-mosque selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Suspense fallback={<div className="py-12 h-[300px] flex items-center justify-center">Loading...</div>}>
          <Hero />
        </Suspense>

        <HomeTexts
          isFeaturedVisible={!isFilterActive && featuredPropertiesToDisplay.length > 0}
          featuredSection={featuredGrid}
          listingsSection={listingsGrid}
        />
      </main>
    </div>
  );
}
