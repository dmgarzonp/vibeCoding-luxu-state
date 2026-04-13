import { supabaseAdmin } from '../../../lib/supabase/server';
import UserTable from './UserTable';
import type { UserWithRole } from './types';



export default async function AdminUsersPage() {
  // Obtener todos los roles
  const { data: roles, error: rolesError } = await supabaseAdmin
    .from('user_roles')
    .select('id, role, created_at')
    .order('created_at', { ascending: false });

  if (rolesError) {
    return (
      <div className="flex items-center gap-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-5 py-4 rounded-xl">
        <span className="material-icons">error_outline</span>
        <span className="text-sm">Error al cargar usuarios: {rolesError.message}</span>
      </div>
    );
  }

  // Obtener metadata de cada usuario desde auth.users usando admin API
  const usersWithMeta: UserWithRole[] = [];


  for (const roleRow of (roles ?? []) as Array<{ id: string; role: 'admin' | 'user'; created_at: string }>) {
    try {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(roleRow.id);
      usersWithMeta.push({
        id: roleRow.id,
        role: roleRow.role,
        created_at: roleRow.created_at,
        email: authUser?.user?.email ?? 'Sin email',
        full_name: authUser?.user?.user_metadata?.full_name ?? null,
        avatar_url: authUser?.user?.user_metadata?.avatar_url ?? null,
      });
    } catch {
      usersWithMeta.push({
        id: roleRow.id,
        role: roleRow.role,
        created_at: roleRow.created_at,
        email: 'Sin email',
        full_name: null,
        avatar_url: null,
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
        <p className="text-sm text-white/40 mt-1">
          {usersWithMeta.length} usuarios registrados · Edita roles haciendo clic en el selector
        </p>
      </div>

      <UserTable users={usersWithMeta} />
    </div>
  );
}
