import { supabaseAdmin } from '../../lib/supabase/server';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  iconBg: string;
  iconColor: string;
  sub?: string;
}

function StatCard({ icon, label, value, iconBg, iconColor, sub }: StatCardProps) {
  return (
    <div className="bg-white border border-mosque/10 rounded-xl p-5 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-nordic mt-1">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <div className={`h-10 w-10 rounded-full ${iconBg} flex items-center justify-center ${iconColor}`}>
        <span className="material-icons">{icon}</span>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const [propResult, userResult] = await Promise.all([
    supabaseAdmin.from('properties').select('id, status, is_featured, is_active', { count: 'exact', head: false }),
    supabaseAdmin.from('user_roles').select('role', { count: 'exact', head: false }),
  ]);

  const properties = propResult.data ?? [];
  const users = userResult.data ?? [];

  const totalProperties = properties.length;
  const activeProperties = properties.filter((p: any) => p.is_active).length;
  const inactiveProperties = totalProperties - activeProperties;
  const featuredProps = properties.filter((p: any) => p.is_featured && p.is_active).length;
  const totalUsers = users.length;
  const totalAdmins = users.filter((u: { role: string }) => u.role === 'admin').length;

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nordic">Resumen General</h1>
        <p className="text-sm text-gray-500 mt-1">Bienvenido al panel de administración de LuxeEstate.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon="apartment"
          label="Propiedades"
          value={activeProperties}
          iconBg="bg-mosque/10"
          iconColor="text-mosque"
          sub={`${totalProperties} total (${inactiveProperties} inactivas)`}
        />
        <StatCard
          icon="star"
          label="Destacadas"
          value={featuredProps}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          sub="Activas con status featured"
        />
        <StatCard
          icon="group"
          label="Usuarios"
          value={totalUsers}
          iconBg="bg-hint-of-green"
          iconColor="text-mosque"
          sub="Registrados"
        />
        <StatCard
          icon="admin_panel_settings"
          label="Administradores"
          value={totalAdmins}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          sub="Con rol admin"
        />
      </div>

      {/* Quick Links */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-nordic/60 uppercase tracking-widest mb-4">Acciones rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="/admin/properties"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-clear-day hover:bg-hint-of-green border border-mosque/10 hover:border-mosque/30 transition-all group"
          >
            <span className="material-icons text-mosque text-xl">home_work</span>
            <div>
              <p className="text-sm font-medium text-nordic group-hover:text-mosque transition-colors">Ver Propiedades</p>
              <p className="text-xs text-gray-400">Gestiona el catálogo completo</p>
            </div>
            <span className="material-icons text-nordic/20 ml-auto">arrow_forward_ios</span>
          </a>
          <a
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-clear-day hover:bg-hint-of-green border border-mosque/10 hover:border-mosque/30 transition-all group"
          >
            <span className="material-icons text-mosque text-xl">manage_accounts</span>
            <div>
              <p className="text-sm font-medium text-nordic group-hover:text-mosque transition-colors">Gestionar Usuarios</p>
              <p className="text-xs text-gray-400">Editar roles y permisos</p>
            </div>
            <span className="material-icons text-nordic/20 ml-auto">arrow_forward_ios</span>
          </a>
        </div>
      </div>
    </div>
    </main>
  );
}
