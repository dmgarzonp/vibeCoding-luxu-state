import { supabaseAdmin } from '../../../lib/supabase/server';
import UsersTableClient from './UserTable';
import type { UserWithRole } from './types';

export default async function AdminUsersPage() {
  const { data: roles, error: rolesError } = await supabaseAdmin
    .from('user_roles')
    .select('id, role, created_at')
    .order('created_at', { ascending: false });

  if (rolesError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 text-rose-700 bg-rose-50 border border-rose-200 px-5 py-4 rounded-xl">
          <span className="material-icons">error_outline</span>
          <span className="text-sm">Error al cargar usuarios: {rolesError.message}</span>
        </div>
      </div>
    );
  }

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

  return <UsersTableClient users={usersWithMeta} />;
}
