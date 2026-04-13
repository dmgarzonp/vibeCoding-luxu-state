'use client';

import { useState, useTransition } from 'react';
import { updateUserRole } from './action';
import type { UserWithRole } from './types';



function RoleBadge({ role }: { role: 'admin' | 'user' }) {
  return role === 'admin' ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/25">
      <span className="material-icons text-[12px]">admin_panel_settings</span>
      Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
      <span className="material-icons text-[12px]">person</span>
      Usuario
    </span>
  );
}

function UserRow({ user }: { user: UserWithRole }) {
  const [currentRole, setCurrentRole] = useState<'admin' | 'user'>(user.role);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);

  const handleRoleChange = (newRole: 'admin' | 'user') => {
    if (newRole === currentRole) return;
    setFeedback(null);
    startTransition(async () => {
      const result = await updateUserRole(user.id, newRole);
      if (result.success) {
        setCurrentRole(newRole);
        setFeedback('success');
        setTimeout(() => setFeedback(null), 2000);
      } else {
        setFeedback('error');
        setTimeout(() => setFeedback(null), 3000);
      }
    });
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
      {/* Avatar + Info */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-white/10">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name ?? ''} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-icons text-white/30 text-xl">person</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user.full_name ?? '—'}</p>
            <p className="text-xs text-white/40">{user.email}</p>
          </div>
        </div>
      </td>

      {/* UUID */}
      <td className="px-5 py-3.5">
        <span className="font-mono text-[11px] text-white/30 truncate block max-w-[140px]">{user.id}</span>
      </td>

      {/* Fecha de registro */}
      <td className="px-5 py-3.5 text-xs text-white/40">{formatDate(user.created_at)}</td>

      {/* Rol actual */}
      <td className="px-5 py-3.5">
        <RoleBadge role={currentRole} />
      </td>

      {/* Cambiar rol */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <select
            id={`role-select-${user.id}`}
            value={currentRole}
            onChange={(e) => handleRoleChange(e.target.value as 'admin' | 'user')}
            disabled={isPending}
            className="
              text-xs font-medium rounded-lg px-2.5 py-1.5
              bg-white/5 border border-white/10 text-white
              focus:outline-none focus:border-mosque focus:ring-1 focus:ring-mosque/40
              disabled:opacity-50 cursor-pointer transition-all
            "
          >
            <option value="user" className="bg-[#111c27]">Usuario</option>
            <option value="admin" className="bg-[#111c27]">Admin</option>
          </select>

          {isPending && (
            <span className="material-icons text-mosque text-[18px] animate-spin">refresh</span>
          )}
          {feedback === 'success' && !isPending && (
            <span className="material-icons text-emerald-400 text-[18px]">check_circle</span>
          )}
          {feedback === 'error' && !isPending && (
            <span className="material-icons text-rose-400 text-[18px]">error_outline</span>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function UsersTable({ users }: { users: UserWithRole[] }) {
  const [search, setSearch] = useState('');

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-[18px]">search</span>
        <input
          id="user-search"
          type="text"
          placeholder="Buscar por nombre o email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full pl-9 pr-4 py-2 text-sm rounded-xl
            bg-[#111c27] border border-white/10 text-white placeholder-white/30
            focus:outline-none focus:border-mosque focus:ring-1 focus:ring-mosque/30
            transition-all
          "
        />
      </div>

      {/* Table */}
      <div className="bg-[#111c27] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-5 py-3.5 text-[11px] font-semibold text-white/40 uppercase tracking-widest">Usuario</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-white/40 uppercase tracking-widest">UUID</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-white/40 uppercase tracking-widest">Registro</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-white/40 uppercase tracking-widest">Rol actual</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-white/40 uppercase tracking-widest">Cambiar rol</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-white/30">
            <span className="material-icons text-5xl mb-3">manage_accounts</span>
            <p className="text-sm">{search ? 'Sin resultados para tu búsqueda.' : 'No hay usuarios registrados aún.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
