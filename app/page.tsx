import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedCard from './components/FeaturedCard';
import PropertyCard from './components/PropertyCard';
import Pagination from './components/Pagination';
import { getProperties } from '../lib/actions/properties';
import { Suspense } from 'react';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string;
    query?: string;
    type?: string;
    beds?: string;
    baths?: string;
  }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 8;
  const query = params.query;
  const type = params.type;
  const beds = params.beds ? Number(params.beds) : undefined;
  const baths = params.baths ? Number(params.baths) : undefined;

  // Fetch data on the server
  const { data: featuredProperties } = await getProperties({ featured: true, query, type, beds, baths });
  const { data: newProperties, count: totalNew } = await getProperties({ 
    featured: false, 
    page: currentPage, 
    limit,
    query,
    type,
    beds,
    baths
  });

  const totalPages = Math.ceil(totalNew / limit);
  const isFilterActive = !!(query || (type && type !== 'Todos') || beds || baths);
  const featuredPropertiesToDisplay = featuredProperties.slice(0, 2);

  return (
    <div className="min-h-screen bg-clear-day text-nordic font-display selection:bg-mosque selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Suspense fallback={<div className="py-12 h-[300px] flex items-center justify-center">Cargando buscador...</div>}>
          <Hero />
        </Suspense>

        {/* Featured Collections Section */}
        {!isFilterActive && featuredPropertiesToDisplay.length > 0 && (
          <section className="mb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-light text-nordic">Colecciones Destacadas</h2>
                <p className="text-nordic/60 mt-1 text-sm font-light">Propiedades seleccionadas para el ojo exigente.</p>
              </div>
              <a href="#" className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity">
                Ver todas <span className="material-icons text-sm">arrow_forward</span>
              </a>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPropertiesToDisplay.map((property) => (
                <FeaturedCard key={property.id} property={property} />
              ))}
            </div>
          </section>
        )}

        {/* New in Market Section */}
        <section className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic">Novedades en el Mercado</h2>
              <p className="text-nordic/60 mt-1 text-sm font-light">Nuevas oportunidades añadidas esta semana.</p>
            </div>
            <div className="hidden md:flex bg-white p-1 rounded-lg border border-nordic/5 shadow-sm">
              <button className="px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-nordic text-white">Todo</button>
              <button className="px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-nordic/40 hover:text-nordic">Venta</button>
              <button className="px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-nordic/40 hover:text-nordic">Alquiler</button>
            </div>
          </div>
          
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
        </section>
      </main>
    </div>
  );
}
