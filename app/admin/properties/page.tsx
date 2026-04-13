import { supabaseAdmin } from '../../../lib/supabase/server';

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  featured: boolean;
  created_at: string;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    featured: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    active:   'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    sold:     'bg-rose-500/20 text-rose-400 border-rose-500/30',
    rented:   'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${map[status] ?? 'bg-white/10 text-white/50 border-white/10'}`}>
      {status}
    </span>
  );
}

export default async function AdminPropertiesPage() {
  const { data: properties, error } = await supabaseAdmin
    .from('properties')
    .select('id, title, location, price, type, status, bedrooms, bathrooms, area, featured, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="flex items-center gap-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-5 py-4 rounded-xl">
        <span className="material-icons">error_outline</span>
        <span className="text-sm">Error al cargar propiedades: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Propiedades</h2>
          <p className="text-sm text-white/40 mt-1">
            {properties?.length ?? 0} propiedades en total
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
          <span className="material-icons text-[16px]">info_outline</span>
          Solo lectura en esta versión
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111c27] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-5 py-3.5 text-[11px] font-semibold text-white/40 uppercase tracking-widest">ID</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-white/40 uppercase tracking-widest">Título</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-white/40 uppercase tracking-widest">Ubicación</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-white/40 uppercase tracking-widest">Precio</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-white/40 uppercase tracking-widest">Tipo</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-white/40 uppercase tracking-widest">Status</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-white/40 uppercase tracking-widest">Hab.</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-white/40 uppercase tracking-widest">Área m²</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-white/40 uppercase tracking-widest">Destacada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(properties as Property[]).map((property) => (
                <tr key={property.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-white/30 font-mono text-xs">#{property.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-white font-medium truncate max-w-[200px]">{property.title}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1 text-white/50">
                      <span className="material-icons text-[14px]">location_on</span>
                      {property.location}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-mosque font-semibold">
                      ${property.price?.toLocaleString('en-US')}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-white/60 capitalize">{property.type}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={property.status} />
                  </td>
                  <td className="px-5 py-3.5 text-white/60 text-center">{property.bedrooms ?? '—'}</td>
                  <td className="px-5 py-3.5 text-white/60">{property.area ?? '—'}</td>
                  <td className="px-5 py-3.5 text-center">
                    {property.featured ? (
                      <span className="material-icons text-amber-400 text-[18px]">star</span>
                    ) : (
                      <span className="material-icons text-white/20 text-[18px]">star_outline</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!properties || properties.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 text-white/30">
            <span className="material-icons text-5xl mb-3">home_work</span>
            <p className="text-sm">No hay propiedades registradas aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
