import { supabaseAdmin } from '../../lib/supabase/server';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  sub?: string;
}

function StatCard({ icon, label, value, color, sub }: StatCardProps) {
  return (
    <div className="bg-[#111c27] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <span className="material-icons text-white text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const [propResult, userResult] = await Promise.all([
    supabaseAdmin.from('properties').select('id, status', { count: 'exact', head: false }),
    supabaseAdmin.from('user_roles').select('role', { count: 'exact', head: false }),
  ]);

  const properties = propResult.data ?? [];
  const users = userResult.data ?? [];

  const totalProperties = properties.length;
  const featuredProps = properties.filter((p: { status?: string }) => p.status === 'featured').length;
  const totalUsers = users.length;
  const totalAdmins = users.filter((u: { role: string }) => u.role === 'admin').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Resumen General</h2>
        <p className="text-sm text-white/40 mt-1">Bienvenido al panel de administración de LuxeEstate.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon="home_work"
          label="Propiedades"
          value={totalProperties}
          color="bg-mosque"
          sub="Total en base de datos"
        />
        <StatCard
          icon="star"
          label="Destacadas"
          value={featuredProps}
          color="bg-amber-600"
          sub="Con status featured"
        />
        <StatCard
          icon="group"
          label="Usuarios"
          value={totalUsers}
          color="bg-indigo-600"
          sub="Registrados"
        />
        <StatCard
          icon="admin_panel_settings"
          label="Administradores"
          value={totalAdmins}
          color="bg-rose-600"
          sub="Con rol admin"
        />
      </div>

      {/* Quick Links */}
      <div className="bg-[#111c27] border border-white/5 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">Acciones rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="/admin/properties"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-mosque/20 border border-white/5 hover:border-mosque/40 transition-all group"
          >
            <span className="material-icons text-mosque text-xl">home_work</span>
            <div>
              <p className="text-sm font-medium text-white group-hover:text-mosque transition-colors">Ver Propiedades</p>
              <p className="text-xs text-white/30">Gestiona el catálogo completo</p>
            </div>
            <span className="material-icons text-white/20 ml-auto">arrow_forward_ios</span>
          </a>
          <a
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-indigo-600/20 border border-white/5 hover:border-indigo-600/40 transition-all group"
          >
            <span className="material-icons text-indigo-400 text-xl">manage_accounts</span>
            <div>
              <p className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">Gestionar Usuarios</p>
              <p className="text-xs text-white/30">Editar roles y permisos</p>
            </div>
            <span className="material-icons text-white/20 ml-auto">arrow_forward_ios</span>
          </a>
        </div>
      </div>
    </div>
  );
}
