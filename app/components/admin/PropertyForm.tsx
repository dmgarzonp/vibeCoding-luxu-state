'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveProperty, uploadPropertyFile } from '../../admin/properties/actions';

interface PropertyFormProps {
  initialData?: any;
}

export default function PropertyForm({ initialData = {} }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<{ id: string; url?: string; file?: File }[]>(
    (initialData.images || []).map((url: string) => ({ id: Math.random().toString(), url }))
  );

  const [formData, setFormData] = useState({
    title: initialData.title || '',
    price: initialData.price || '',
    status: initialData.status || 'FOR SALE',
    type: initialData.type || 'House',
    description: initialData.description || '',
    location: initialData.location || '',
    area: initialData.sqm || '',
    year_built: initialData.year_built || '',
    beds: initialData.beds || 1,
    baths: initialData.baths || 1,
    parking: initialData.parking || 0,
  });

  const rawAmenities = initialData.amenities || [];
  const [amenities, setAmenities] = useState({
    swimmingPool: rawAmenities.includes('Swimming Pool'),
    garden: rawAmenities.includes('Garden'),
    airConditioning: rawAmenities.includes('Air Conditioning'),
    smartHome: rawAmenities.includes('Smart Home'),
  });

  const [flags, setFlags] = useState({
    isExclusive: initialData.isExclusive || false,
    isFeatured: initialData.isFeatured || false,
    isNew: initialData.isNew || false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityChange = (name: string) => {
    setAmenities(prev => ({ ...prev, [name as keyof typeof amenities]: !prev[name as keyof typeof amenities] }));
  };

  const handleFlagChange = (name: string) => {
    setFlags(prev => ({ ...prev, [name as keyof typeof flags]: !prev[name as keyof typeof flags] }));
  };

  const increment = (field: 'beds' | 'baths' | 'parking') => {
    setFormData(prev => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const decrement = (field: 'beds' | 'baths' | 'parking') => {
    setFormData(prev => ({ ...prev, [field]: Math.max(0, prev[field] - 1) }));
  };

  // Image Upload Logic
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(),
        file,
        url: URL.createObjectURL(file)
      }));
      setImages([...images, ...newFiles]);
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload new images if any
      const finalImageUrls: string[] = [];
      for (const img of images) {
        if (img.file) {
          const fileData = new FormData();
          fileData.append('file', img.file);
          const uploadRes = await uploadPropertyFile(fileData);
          if (uploadRes.publicUrl) {
            finalImageUrls.push(uploadRes.publicUrl);
          }
        } else if (img.url) {
          finalImageUrls.push(img.url);
        }
      }

      // 2. Prepare amenity list
      const finalAmenities = [];
      if (amenities.swimmingPool) finalAmenities.push('Swimming Pool');
      if (amenities.garden) finalAmenities.push('Garden');
      if (amenities.airConditioning) finalAmenities.push('Air Conditioning');
      if (amenities.smartHome) finalAmenities.push('Smart Home');

      // 3. Assemble property data
      const propertyPayload = {
        ...(initialData.id ? { id: initialData.id } : {}),
        title: formData.title,
        price: formData.price,
        status: formData.status,
        type: formData.type,
        description: formData.description,
        location: formData.location,
        sqm: formData.area ? Number(formData.area) : null,
        year_built: formData.year_built ? Number(formData.year_built) : null,
        beds: formData.beds,
        baths: formData.baths,
        parking: formData.parking,
        amenities: finalAmenities,
        images: finalImageUrls,
        isExclusive: flags.isExclusive,
        isFeatured: flags.isFeatured,
        isNew: flags.isNew,
      };

      const res = await saveProperty(propertyPayload);
      if (res.error) {
        console.error('Error al guardar propiedad:', res.error);
        alert('❌ Error al guardar: ' + res.error);
        return; // don't navigate away
      }
      router.push('/admin/properties');
    } catch (error: any) {
      console.error('Error inesperado:', error);
      alert('❌ Error inesperado: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
              <li>
                <Link className="hover:text-mosque transition-colors" href="/admin/properties">Propiedades</Link>
              </li>
              <li><span className="material-icons text-xs text-gray-400">chevron_right</span></li>
              <li aria-current="page" className="text-nordic">
                {initialData.id ? 'Editar Propiedad' : 'Añadir Nueva'}
              </li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nordic tracking-tight mb-2">
              {initialData.id ? 'Editar Propiedad' : 'Añadir Nueva Propiedad'}
            </h1>
            <p className="text-base text-gray-500 max-w-2xl font-normal">
              Completa los detalles a continuación. Los campos marcados con * son obligatorios.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/properties" className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-nordic hover:bg-gray-50 transition-colors font-medium text-sm inline-flex items-center">
            Cancelar
          </Link>
          <button 
            type="submit" 
            form="property-form"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-mosque hover:bg-nordic text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <span className="material-icons text-sm">{loading ? 'hourglass_empty' : 'save'}</span>
            {loading ? 'Guardando...' : 'Guardar Propiedad'}
          </button>
        </div>
      </header>

      <form id="property-form" onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-8 space-y-8">
          
          {/* Información Básica */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-hint-of-green flex items-center gap-3 bg-gradient-to-r from-hint-of-green to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">info</span>
              </div>
              <h2 className="text-xl font-bold text-nordic">Información Básica</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-nordic mb-1.5" htmlFor="title">
                  Título de Propiedad <span className="text-red-500">*</span>
                </label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full text-base px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all" id="title" placeholder="Ej. Moderno Penthouse con Vista al Océano" type="text" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-nordic mb-1.5" htmlFor="price">Precio <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input required name="price" value={formData.price} onChange={handleChange} className="w-full pl-7 pr-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-medium" id="price" placeholder="500,000" type="text" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-nordic mb-1.5" htmlFor="status">Estado</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base cursor-pointer" id="status">
                    <option value="FOR SALE">En Venta</option>
                    <option value="FOR RENT">En Alquiler</option>
                    <option value="SOLD">Vendido</option>
                    <option value="PENDING">Pendiente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-nordic mb-1.5" htmlFor="type">Tipo de Propiedad</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base cursor-pointer" id="type">
                    <option value="Apartment">Apartamento</option>
                    <option value="House">Casa</option>
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Commercial">Comercial</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-hint-of-green flex items-center gap-3 bg-gradient-to-r from-hint-of-green to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">description</span>
              </div>
              <h2 className="text-xl font-bold text-nordic">Descripción</h2>
            </div>
            <div className="p-8">
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base leading-relaxed resize-y min-h-[200px]" id="description" placeholder="Describe las características de la propiedad, vecindario y puntos únicos..."></textarea>
            </div>
          </div>

          {/* Galería */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-hint-of-green flex justify-between items-center bg-gradient-to-r from-hint-of-green to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic">
                  <span className="material-icons text-lg">image</span>
                </div>
                <h2 className="text-xl font-bold text-nordic">Galería</h2>
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">JPG, PNG, WEBP</span>
            </div>
            <div className="p-8">
              <div 
                className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 p-10 text-center hover:bg-hint-of-green hover:border-mosque/40 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} onChange={handleImageUpload} className="hidden" multiple type="file" accept="image/*" />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-mosque group-hover:scale-110 transition-transform duration-300">
                    <span className="material-icons text-2xl">cloud_upload</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-medium text-nordic">Clic para añadir imágenes</p>
                    <p className="text-xs text-gray-400">Tamaño máximo 5MB por imagen</p>
                  </div>
                </div>
              </div>
              
              {/* Image Previews */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {images.map((img, index) => (
                  <div key={img.id} className="aspect-square rounded-lg overflow-hidden relative group shadow-sm">
                    <img alt={`Preview`} className="w-full h-full object-cover" src={img.url} />
                    <div className="absolute inset-0 bg-nordic/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                      <button type="button" onClick={() => removeImage(img.id)} className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors">
                        <span className="material-icons text-sm">delete</span>
                      </button>
                    </div>
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-mosque text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">Principal</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Barra Lateral (Location & Details) */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Locación */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-hint-of-green flex items-center gap-3 bg-gradient-to-r from-hint-of-green to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">place</span>
              </div>
              <h2 className="text-lg font-bold text-nordic">Ubicación</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-nordic mb-1.5" htmlFor="location">Dirección completa</label>
                <input name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm" id="location" placeholder="Calle, Ciudad, Código Postal" type="text" />
              </div>
              <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                <img alt="Map view of city streets" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS55FY7gfArnlTpNsdabJk9nBO5uQJgOwIsl8beO34JRZ9dMmjLoIkTuTUO72Y9L5tUmQqTReQWebUWadAWwLusGmRQiIict5sqY--yRaOxuYpTzfR4vv4RKh1ex6oxY64e0kbSeMudNO6pv-gG0WzVWs-pDfvQm5IoTQ1mT-tAV49LDkXAHZl317M1-D7eZw3N8o2ExKWTgg6oMAXOFVnkApIqnb7TZHekwSw8pWQxpJV2EKI8EQKQbQXJaSbjN8gB1n8b-ueWj8" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-white/90 text-nordic px-3 py-1.5 rounded shadow-sm backdrop-blur-sm text-xs font-bold flex items-center gap-1">
                    <span className="material-icons text-sm text-mosque">map</span> Vista Previa
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detalles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="px-6 py-4 border-b border-hint-of-green flex items-center gap-3 bg-gradient-to-r from-hint-of-green to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">straighten</span>
              </div>
              <h2 className="text-lg font-bold text-nordic">Detalles</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-xs text-gray-500 font-medium mb-1 block" htmlFor="area">Área (m²)</label>
                  <input name="area" value={formData.area} onChange={handleChange} className="w-full text-left px-3 py-2 rounded border border-gray-200 bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm" id="area" placeholder="0" type="number" />
                </div>
                <div className="group">
                  <label className="text-xs text-gray-500 font-medium mb-1 block" htmlFor="year_built">Construcción</label>
                  <input name="year_built" value={formData.year_built} onChange={handleChange} className="w-full text-left px-3 py-2 rounded border border-gray-200 bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm" id="year_built" placeholder="YYYY" type="number" />
                </div>
              </div>
              <hr className="border-gray-100" />
              <div className="space-y-4">
                {/* Rooms Counters */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-nordic flex items-center gap-2">
                    <span className="material-icons text-gray-400 text-sm">bed</span> Habitaciones
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                    <button type="button" onClick={() => decrement('beds')} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 border-r border-gray-100">-</button>
                    <input className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium" readOnly type="text" value={formData.beds} />
                    <button type="button" onClick={() => increment('beds')} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 border-l border-gray-100">+</button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-nordic flex items-center gap-2">
                    <span className="material-icons text-gray-400 text-sm">shower</span> Baños
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                    <button type="button" onClick={() => decrement('baths')} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 border-r border-gray-100">-</button>
                    <input className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium" readOnly type="text" value={formData.baths} />
                    <button type="button" onClick={() => increment('baths')} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 border-l border-gray-100">+</button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-nordic flex items-center gap-2">
                    <span className="material-icons text-gray-400 text-sm">directions_car</span> Parqueaderos
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                    <button type="button" onClick={() => decrement('parking')} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 border-r border-gray-100">-</button>
                    <input className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium" readOnly type="text" value={formData.parking} />
                    <button type="button" onClick={() => increment('parking')} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 border-l border-gray-100">+</button>
                  </div>
                </div>
              </div>
              <hr className="border-gray-100" />
              {/* Amenities */}
              <div>
                <h3 className="text-sm font-bold text-nordic mb-3 uppercase tracking-wider text-xs text-gray-500">Amenidades</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input checked={amenities.swimmingPool} onChange={() => handleAmenityChange('swimmingPool')} className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque" type="checkbox" />
                    <span className="text-sm text-gray-700 group-hover:text-nordic transition-colors">Piscina</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input checked={amenities.garden} onChange={() => handleAmenityChange('garden')} className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque" type="checkbox" />
                    <span className="text-sm text-gray-700 group-hover:text-nordic transition-colors">Jardín</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input checked={amenities.airConditioning} onChange={() => handleAmenityChange('airConditioning')} className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque" type="checkbox" />
                    <span className="text-sm text-gray-700 group-hover:text-nordic transition-colors">Aire Acondicionado</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input checked={amenities.smartHome} onChange={() => handleAmenityChange('smartHome')} className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque" type="checkbox" />
                    <span className="text-sm text-gray-700 group-hover:text-nordic transition-colors">Smart Home</span>
                  </label>
                </div>
              </div>

              <hr className="border-gray-100" />
              {/* Configuracion Adicional */}
              <div>
                <h3 className="text-sm font-bold text-nordic mb-3 uppercase tracking-wider text-xs text-gray-500">Configuración Adicional</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input checked={flags.isFeatured} onChange={() => handleFlagChange('isFeatured')} className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque" type="checkbox" />
                    <span className="text-sm text-gray-700 group-hover:text-nordic transition-colors">Destacada (Aparece en inicio)</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input checked={flags.isExclusive} onChange={() => handleFlagChange('isExclusive')} className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque" type="checkbox" />
                    <span className="text-sm text-gray-700 group-hover:text-nordic transition-colors">Propietario Exclusivo</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input checked={flags.isNew} onChange={() => handleFlagChange('isNew')} className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque" type="checkbox" />
                    <span className="text-sm text-gray-700 group-hover:text-nordic transition-colors">Marcar como "Nueva"</span>
                  </label>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Submit sticky bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl md:hidden z-40 flex gap-3">
          <Link href="/admin/properties" className="flex-1 py-3 rounded-lg border border-gray-300 bg-white text-nordic font-medium text-center">
            Cancelar
          </Link>
          <button type="submit" form="property-form" disabled={loading} className="flex-1 py-3 rounded-lg bg-mosque text-white font-medium flex justify-center items-center gap-2 disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </main>
  );
}
