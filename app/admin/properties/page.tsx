import { supabaseAdmin } from '../../../lib/supabase/server';

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
  status: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  featured: boolean;
  created_at: string;
  images?: string[] | null;
}

/* ─── Status badge ───────────────────────────────────────────── */
function StatusBadge({ status, featured }: { status: string; featured: boolean }) {
  const display = featured ? 'featured' : status;

  const styles: Record<string, { bg: string; text: string; border: string; dot: string; label: string }> = {
    featured: { bg: 'bg-hint-of-green', text: 'text-mosque',     border: 'border-mosque/10',  dot: 'bg-mosque',       label: 'Destacada'  },
    active:   { bg: 'bg-hint-of-green', text: 'text-mosque',     border: 'border-mosque/10',  dot: 'bg-mosque',       label: 'Activa'     },
    pending:  { bg: 'bg-orange-100',    text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500',   label: 'Pendiente'  },
    sold:     { bg: 'bg-gray-100',      text: 'text-gray-600',   border: 'border-gray-200',   dot: 'bg-gray-500',     label: 'Vendida'    },
    rented:   { bg: 'bg-indigo-50',     text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500',   label: 'Arrendada'  },
  };

  const s = styles[display] ?? { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400', label: status };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text} border ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} mr-1.5 flex-shrink-0`} />
      {s.label}
    </span>
  );
}

/* ─── Property row ───────────────────────────────────────────── */
function PropertyRow({ property }: { property: Property }) {
  const thumbnail = property.images?.[0] ?? null;

  return (
    <div className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 last:border-b-0 hover:bg-clear-day transition-colors items-center">
      {/* Col 1: Property Details — 6/12 */}
      <div className="col-span-12 md:col-span-6 flex gap-4 items-center min-w-0">
        <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={property.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              <span className="material-icons text-3xl">home_work</span>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-nordic group-hover:text-mosque transition-colors cursor-pointer truncate">
            {property.title}
          </h3>
          <p className="text-sm text-gray-500 truncate">{property.location}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 flex-wrap">
            {property.bedrooms != null && (
              <span className="flex items-center gap-1 flex-shrink-0">
                <span className="material-icons text-[14px]">bed</span>
                {property.bedrooms} Hab.
              </span>
            )}
            {property.bedrooms != null && property.bathrooms != null && (
              <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-1 flex-shrink-0">
                <span className="material-icons text-[14px]">bathtub</span>
                {property.bathrooms} Baños
              </span>
            )}
            {property.area != null && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                <span className="flex-shrink-0">{property.area.toLocaleString()} m²</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Col 2: Price — 2/12 */}
      <div className="col-span-6 md:col-span-2">
        <div className="text-base font-semibold text-nordic">
          ${property.price?.toLocaleString('en-US')}
        </div>
        <div className="text-xs text-gray-400 capitalize">{property.type}</div>
      </div>

      {/* Col 3: Status — 2/12 */}
      <div className="col-span-6 md:col-span-2">
        <StatusBadge status={property.status} featured={property.featured} />
      </div>

      {/* Col 4: Actions — 2/12 */}
      <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
        <button
          title="Editar propiedad"
          className="p-2 rounded-lg text-gray-400 hover:text-mosque hover:bg-hint-of-green/30 transition-all"
        >
          <span className="material-icons text-xl">edit</span>
        </button>
        <button
          title="Eliminar propiedad"
          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <span className="material-icons text-xl">delete_outline</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default async function AdminPropertiesPage() {
  const { data: properties, error } = await supabaseAdmin
    .from('properties')
    .select('id, title, location, price, type, status, bedrooms, bathrooms, area, featured, created_at, images')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 text-rose-700 bg-rose-50 border border-rose-200 px-5 py-4 rounded-xl">
          <span className="material-icons">error_outline</span>
          <span className="text-sm">Error al cargar propiedades: {error.message}</span>
        </div>
      </div>
    );
  }

  const list = (properties ?? []) as Property[];
  const total = list.length;
  const active = list.filter((p) => p.status === 'active' || p.featured).length;
  const pending = list.filter((p) => p.status === 'pending').length;

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-nordic tracking-tight">Mis Propiedades</h1>
          <p className="text-gray-500 mt-1 text-sm">Gestiona tu portafolio y monitorea el rendimiento.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-200 text-nordic hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2">
            <span className="material-icons text-base">filter_list</span>
            Filtrar
          </button>
          <button className="bg-mosque hover:bg-mosque/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-mosque/20 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2">
            <span className="material-icons text-base">add</span>
            Nueva Propiedad
          </button>
        </div>
      </div>

      {/* ── Stats Overview ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Total */}
        <div className="bg-white p-5 rounded-xl border border-mosque/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Listados</p>
            <p className="text-2xl font-bold text-nordic mt-1">{total}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-mosque/10 flex items-center justify-center text-mosque flex-shrink-0">
            <span className="material-icons">apartment</span>
          </div>
        </div>
        {/* Active */}
        <div className="bg-white p-5 rounded-xl border border-mosque/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Propiedades Activas</p>
            <p className="text-2xl font-bold text-nordic mt-1">{active}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-hint-of-green flex items-center justify-center text-mosque flex-shrink-0">
            <span className="material-icons">check_circle</span>
          </div>
        </div>
        {/* Pending */}
        <div className="bg-white p-5 rounded-xl border border-mosque/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pendientes de Venta</p>
            <p className="text-2xl font-bold text-nordic mt-1">{pending}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
            <span className="material-icons">pending</span>
          </div>
        </div>
      </div>

      {/* ── Property List Container ─────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-6">Detalles de la Propiedad</div>
          <div className="col-span-2">Precio</div>
          <div className="col-span-2">Estado</div>
          <div className="col-span-2 text-right">Acciones</div>
        </div>

        {/* Rows */}
        {list.map((property) => (
          <PropertyRow key={property.id} property={property} />
        ))}

        {/* Empty state */}
        {total === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-nordic/30">
            <span className="material-icons text-5xl mb-3">home_work</span>
            <p className="text-sm">No hay propiedades registradas aún.</p>
          </div>
        )}

        {/* Pagination footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="text-sm text-gray-500">
            Mostrando <span className="font-medium text-nordic">1</span> a{' '}
            <span className="font-medium text-nordic">{total}</span> de{' '}
            <span className="font-medium text-nordic">{total}</span> resultados
          </div>
          <div className="flex gap-2">
            <button
              disabled
              className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-white disabled:opacity-50"
            >
              Anterior
            </button>
            <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-white">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
