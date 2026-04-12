import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPropertyBySlug } from '../../../lib/actions/properties';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import PropertyMap from '../../components/PropertyMapWrapper';

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
    }
  };
}

export default async function PropertyDetailsPage({ params }: PropertyPageProps) {
  const resolvedParams = await params;
  const { data: property } = await getPropertyBySlug(resolvedParams.slug);

  if (!property) {
    notFound();
  }

  // To display the gallery based on images layout in code.html
  // Let's ensure we have at least 4 images to map or fallback to the same image.
  const galleryImages = [
    property.images?.[0] || '',
    property.images?.[1] || property.images?.[0] || '',
    property.images?.[2] || property.images?.[0] || '',
    property.images?.[3] || property.images?.[0] || '',
  ];

  return (
    <div className="min-h-screen bg-clear-day text-nordic font-display selection:bg-mosque/20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-nordic/60 mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-mosque transition-colors">Inicio</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-icons text-sm mx-1">chevron_right</span>
                <span className="hover:text-mosque transition-colors cursor-pointer">{property.status === 'FOR SALE' ? 'Venta' : 'Alquiler'}</span>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="material-icons text-sm mx-1">chevron_right</span>
                <span className="text-nordic font-medium truncate max-w-[200px]">{property.title}</span>
              </div>
            </li>
          </ol>
        </nav>

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
                
                <div className="absolute top-4 left-4 flex gap-2">
                  {property.isFeatured && <span className="bg-mosque text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">Destacado</span>}
                  {property.isNew && <span className="bg-white/90 backdrop-blur text-nordic text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">Nuevo</span>}
                  <span className={`${property.status === 'FOR RENT' ? 'bg-mosque' : 'bg-nordic'} text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm`}>
                    {property.status === 'FOR RENT' ? 'Alquiler' : 'En Venta'}
                  </span>
                </div>
                
                <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2">
                  <span className="material-icons text-sm">grid_view</span>
                  Ver todas las fotos
                </button>
             </div>

             <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
               {galleryImages.map((imgSrc, idx) => (
                  <div key={idx} className={`relative flex-none w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer snap-start transition-opacity ${idx === 0 ? 'ring-2 ring-mosque ring-offset-2 ring-offset-clear-day' : 'opacity-70 hover:opacity-100'}`}>
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
                <div className="mb-4">
                  <h1 className="text-4xl font-display font-light text-nordic mb-2">{property.price}</h1>
                  <p className="text-nordic/60 font-medium flex items-center gap-1">
                    <span className="material-icons text-mosque text-sm">location_on</span>
                    {property.location}
                  </p>
                </div>
                
                <div className="h-px bg-slate-100 my-6"></div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                    <Image 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" 
                      alt="Agent" 
                      width={56} 
                      height={56} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-nordic">Elena Restrepo</h3>
                    <div className="flex items-center gap-1 text-xs text-mosque font-medium">
                      <span className="material-icons text-[14px]">star</span>
                      <span>Agente Top</span>
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
                  <button className="w-full bg-mosque hover:bg-primary-hover text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group">
                    <span className="material-icons text-xl group-hover:scale-110 transition-transform">calendar_today</span>
                    Agendar Visita
                  </button>
                  <button className="w-full bg-transparent border border-nordic/10 hover:border-mosque text-nordic/80 hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                    <span className="material-icons text-xl">mail_outline</span>
                    Contactar Agente
                  </button>
                </div>
              </div>

              {/* Map Block */}
              <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5 relative">
                <PropertyMap locationString={property.location} />
                <a href="#" className="absolute bottom-4 right-4 bg-white/90 text-xs font-medium px-2 py-1 rounded shadow-sm text-nordic hover:text-mosque z-[1000] pointer-events-auto backdrop-blur-sm">
                  Ver en mapa
                </a>
              </div>
            </div>
          </div>

          {/* Details Content Below */}
          <div className="lg:col-span-8 lg:row-start-2 -mt-8 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
               <h2 className="text-lg font-semibold mb-6 text-nordic">Características Principales</h2>
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                   <span className="material-icons text-mosque text-2xl mb-2">square_foot</span>
                   <span className="text-xl font-bold text-nordic">{property.sqm}</span>
                   <span className="text-xs uppercase tracking-wider text-nordic/50">Mts Cuadrados</span>
                 </div>
                 <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                   <span className="material-icons text-mosque text-2xl mb-2">bed</span>
                   <span className="text-xl font-bold text-nordic">{property.beds}</span>
                   <span className="text-xs uppercase tracking-wider text-nordic/50">Habitaciones</span>
                 </div>
                 <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                   <span className="material-icons text-mosque text-2xl mb-2">shower</span>
                   <span className="text-xl font-bold text-nordic">{property.baths}</span>
                   <span className="text-xs uppercase tracking-wider text-nordic/50">Baños</span>
                 </div>
                 <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                   <span className="material-icons text-mosque text-2xl mb-2">directions_car</span>
                   <span className="text-xl font-bold text-nordic">2</span>
                   <span className="text-xs uppercase tracking-wider text-nordic/50">Garajes</span>
                 </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-4 text-nordic">Sobre esta propiedad</h2>
              <div className="prose prose-slate max-w-none text-nordic/70 leading-relaxed font-light">
                <p className="mb-4">
                  {property.title} representa la cúspide de la vida moderna y elegante. Situada estratégicamente en {property.location}, esta {property.type.toLowerCase()} ofrece un equilibrio perfecto entre confort, diseño y accesibilidad.
                </p>
                <p>
                  Diseñada pensando en la iluminación natural, los espacios abiertos se comunican de manera fluida, creando ambientes ideales tanto para el descanso privado como para el entretenimiento. Los acabados de primera calidad y las amenidades excepcionales definen el estándar de esta increíble inversión.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-6 text-nordic">Amenidades Incluidas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex items-center gap-3 text-nordic/70 hover:text-mosque transition-colors">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span className="font-light">Sistema Smart Home</span>
                </div>
                <div className="flex items-center gap-3 text-nordic/70 hover:text-mosque transition-colors">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span className="font-light">Aire Acondicionado Central</span>
                </div>
                <div className="flex items-center gap-3 text-nordic/70 hover:text-mosque transition-colors">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span className="font-light">Seguridad 24/7</span>
                </div>
                <div className="flex items-center gap-3 text-nordic/70 hover:text-mosque transition-colors">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span className="font-light">Zona BBQ</span>
                </div>
                {property.type === 'Villa' || property.type === 'House' ? (
                  <div className="flex items-center gap-3 text-nordic/70 hover:text-mosque transition-colors">
                    <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                    <span className="font-light">Jardín Privado</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-nordic/70 hover:text-mosque transition-colors">
                    <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                    <span className="font-light">Piscina Condominio</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Calculator Widget */}
            <div className="bg-mosque/5 p-6 rounded-xl border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-full text-mosque shadow-sm shrink-0">
                  <span className="material-icons">calculate</span>
                </div>
                <div>
                  <h3 className="font-semibold text-nordic">Calculadora de Hipoteca</h3>
                  <p className="text-sm text-nordic/60 font-light mt-1">Estima tu pago inicial desde un <strong className="text-mosque">20% de enganche</strong></p>
                </div>
              </div>
              <button className="whitespace-nowrap px-6 py-2.5 bg-white border border-nordic/10 rounded-lg text-sm font-semibold hover:border-mosque transition-colors text-nordic">
                Calcular Pago
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-nordic/50 font-light">
            © 2026 LuxeEstate Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
