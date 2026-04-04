import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedCard from './components/FeaturedCard';
import PropertyCard from './components/PropertyCard';
import { featuredProperties, newProperties } from './data/properties';

export default function Home() {
  return (
    <div className="min-h-screen bg-clear-day text-nordic font-display selection:bg-mosque selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Hero />

        {/* Featured Collections Section */}
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
            {featuredProperties.map((property) => (
              <FeaturedCard key={property.id} property={property} />
            ))}
          </div>
        </section>

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
            
            {/* Additional cards to fill the grid as in reference */}
            {[1, 2].map((i) => (
              <PropertyCard 
                key={`extra-${i}`} 
                property={{
                  ...newProperties[i % 2],
                  id: `extra-${i}`,
                  title: i === 1 ? 'Central Studio' : 'Garden Villa',
                  location: i === 1 ? '555 Main St, Chicago' : '999 Oak Ln, Austin',
                  image: i === 1 
                    ? 'https://images.unsplash.com/photo-1536376074432-ad7374f6bd2a?auto=format&fit=crop&q=80&w=600'
                    : 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=600'
                }} 
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-white border border-nordic/10 hover:border-mosque hover:text-mosque text-nordic font-medium rounded-lg transition-all hover:shadow-md text-sm">
              Cargar más propiedades
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
