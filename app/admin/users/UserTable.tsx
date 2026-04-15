'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { updateUserRole } from './action';
import type { UserWithRole } from './types';

/* ─────────────────────────────────────────────────────────────
   Role dropdown (the "Change Role" button + menu)
───────────────────────────────────────────────────────────── */
function RoleDropdown({
  userId,
  currentRole,
  onRoleChange,
  isPending,
  isHighlighted,
}: {
  userId: string;
  currentRole: 'admin' | 'user';
  onRoleChange: (role: 'admin' | 'user') => void;
  isPending: boolean;
  isHighlighted: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const roleOptions: Array<{ value: 'admin' | 'user'; label: string; icon: string }> = [
    { value: 'admin', label: 'Administrador', icon: 'shield' },
    { value: 'user', label: 'Agente', icon: 'support_agent' },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        id={`role-btn-${userId}`}
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className={`
          inline-flex items-center px-4 py-2 text-xs font-medium rounded-lg
          transition-colors w-full md:w-auto justify-center gap-1
          ${isHighlighted
            ? 'bg-mosque text-white shadow-md hover:bg-mosque/90'
            : 'border border-nordic/10 bg-white shadow-sm text-nordic hover:bg-nordic hover:text-white'
          }
          disabled:opacity-50
        `}
      >
        {isPending
          ? <span className="material-icons text-[16px] animate-spin">refresh</span>
          : null
        }
        Cambiar Rol
        <span className="material-icons text-[16px] ml-1">{open ? 'expand_less' : 'expand_more'}</span>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] bg-mosque ring-1 ring-black/5 overflow-hidden z-50 animate-fade-in-down">
          <div className="py-1" role="menu">
            {roleOptions.map((opt) => (
              <button
                key={opt.value}
                role="menuitem"
                onClick={() => { onRoleChange(opt.value); setOpen(false); }}
                className={`
                  group flex items-center w-full px-4 py-3 text-xs transition-colors
                  ${currentRole === opt.value
                    ? 'text-white font-medium bg-white/10 hover:bg-white/20'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <span className={`material-icons text-sm mr-3 ${currentRole === opt.value ? 'text-white' : 'text-white/50 group-hover:text-white'}`}>
                  {opt.icon}
                </span>
                {opt.label}
              </button>
            ))}
            <div className="border-t border-white/10 my-1" />
            <button
              role="menuitem"
              onClick={() => setOpen(false)}
              className="group flex items-center w-full px-4 py-3 text-xs text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-colors"
            >
              <span className="material-icons text-sm mr-3 text-red-300 group-hover:text-red-100">block</span>
              Suspender Usuario
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Single user card row
───────────────────────────────────────────────────────────── */
function UserCard({ user }: { user: UserWithRole }) {
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

  // Highlight (green bg) for admin users — same as the reference "active/selected" card style
  const isHighlighted = currentRole === 'admin';

  // Build initials for avatar fallback
  const initials = (user.full_name ?? user.email)
    .split(/[\s@]/)
    .map((w) => w[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`
        group relative rounded-xl p-5 shadow-sm
        flex flex-col md:grid md:grid-cols-12 gap-4 items-center
        transition-all duration-200
        ${isHighlighted
          ? 'bg-hint-of-green border border-transparent hover:shadow-[0_4px_20px_-2px_rgba(25,50,47,0.05)]'
          : 'bg-white border border-gray-100 hover:bg-hint-of-green hover:shadow-[0_4px_20px_-2px_rgba(25,50,47,0.05)]'
        }
      `}
    >
      {/* ── Col 1: User Details (4/12) ──────────────────────── */}
      <div className="col-span-12 md:col-span-4 flex items-center w-full">
        <div className="relative flex-shrink-0">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name ?? user.email}
              className={`h-12 w-12 rounded-full object-cover border-2 ${isHighlighted ? 'border-white' : 'border-white'}`}
            />
          ) : (
            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white ${isHighlighted ? 'bg-mosque/10 text-mosque' : 'bg-gray-100 text-nordic/60'}`}>
              {initials}
            </div>
          )}
          {/* Online indicator: green for admin, gray for user */}
          <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${isHighlighted ? 'bg-green-400' : 'bg-gray-300'}`} />
        </div>
        <div className="ml-4 overflow-hidden">
          <div className="text-sm font-bold text-nordic truncate">{user.full_name ?? '—'}</div>
          <div className="text-xs text-nordic/70 truncate">{user.email}</div>
          <div className={`mt-1 text-[10px] px-2 py-0.5 inline-block rounded text-nordic/60 transition-colors ${isHighlighted ? 'bg-white/50' : 'bg-gray-50 group-hover:bg-white/50'}`}>
            ID: #{user.id.slice(0, 8).toUpperCase()}
          </div>
        </div>
      </div>

      {/* ── Col 2: Role & Status (3/12) ─────────────────────── */}
      <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
        {/* Role badge */}
        {currentRole === 'admin' ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-nordic text-white">
            Administrador
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
            Agente
          </span>
        )}
        {/* Active/Away status */}
        <div className="flex items-center text-xs text-nordic/60">
          {isHighlighted ? (
            <>
              <span className="material-icons text-[14px] mr-1 text-mosque">check_circle</span>
              Activo
            </>
          ) : (
            <>
              <span className="material-icons text-[14px] mr-1 text-gray-400">schedule</span>
              Inactivo
            </>
          )}
        </div>
      </div>

      {/* ── Col 3: Performance (3/12) ───────────────────────── */}
      <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-nordic/50">Rol actual</div>
          <div className="text-sm font-semibold text-nordic">
            {currentRole === 'admin' ? 'Admin' : 'Usuario'}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-nordic/50">Miembro desde</div>
          <div className="text-sm font-semibold text-nordic">
            {new Date(user.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* ── Col 4: Actions (2/12) ───────────────────────────── */}
      <div className="col-span-12 md:col-span-2 w-full flex justify-end items-center gap-2 relative">
        <RoleDropdown
          userId={user.id}
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          isPending={isPending}
          isHighlighted={isHighlighted}
        />
        {feedback === 'success' && !isPending && (
          <span className="material-icons text-green-500 text-[18px]">check_circle</span>
        )}
        {feedback === 'error' && !isPending && (
          <span className="material-icons text-red-400 text-[18px]">error_outline</span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main export — rendered inside page.tsx
───────────────────────────────────────────────────────────── */
type TabKey = 'all' | 'admin' | 'user';

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: 'all', label: 'Todos los Usuarios' },
  { key: 'admin', label: 'Administradores' },
  { key: 'user', label: 'Agentes' },
];

export default function UsersTableClient({ users }: { users: UserWithRole[] }) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.email.toLowerCase().includes(q) ||
      (u.full_name ?? '').toLowerCase().includes(q);
    const matchTab = activeTab === 'all' || u.role === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Page Header ─────────────────────────────────────── */}
      <header className="pt-8 pb-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-nordic">Directorio de Usuarios</h1>
            <p className="text-nordic/60 mt-1 text-sm">
              Gestiona el acceso y roles de los usuarios de tu plataforma.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-nordic/40 group-focus-within:text-mosque text-xl">search</span>
              </div>
              <input
                id="user-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, email..."
                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white text-nordic shadow-[0_4px_20px_-2px_rgba(25,50,47,0.05)] placeholder-nordic/30 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-sm outline-none"
              />
            </div>
            <button className="inline-flex items-center justify-center px-4 py-2.5 border border-mosque text-sm font-medium rounded-lg text-mosque bg-transparent hover:bg-mosque/5 transition-colors whitespace-nowrap">
              <span className="material-icons text-lg mr-2">add</span>
              Agregar Usuario
            </button>
          </div>
        </div>
      </header>

      {/* ── Tabs ────────────────────────────────────────────── */}
      <div className="mt-8 flex gap-6 border-b border-nordic/10 overflow-x-auto hide-scroll">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'font-semibold text-mosque border-b-2 border-mosque'
                : 'font-medium text-nordic/60 hover:text-nordic'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Column headers ──────────────────────────────────── */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 mt-4 mb-2 text-xs font-semibold uppercase tracking-wider text-nordic/50">
        <div className="col-span-4">Detalles del Usuario</div>
        <div className="col-span-3">Rol y Estado</div>
        <div className="col-span-3">Rendimiento</div>
        <div className="col-span-2 text-right">Acciones</div>
      </div>

      {/* ── Cards ───────────────────────────────────────────── */}
      <div className="space-y-4 pb-12">
        {filtered.map((u) => <UserCard key={u.id} user={u} />)}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-nordic/30 bg-white rounded-xl border border-gray-100">
            <span className="material-icons text-5xl mb-3">manage_accounts</span>
            <p className="text-sm">
              {search ? 'Sin resultados para tu búsqueda.' : 'No hay usuarios registrados aún.'}
            </p>
          </div>
        )}
      </div>

      {/* ── Footer pagination ───────────────────────────────── */}
      {filtered.length > 0 && (
        <footer className="border-t border-nordic/5 bg-clear-day py-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
              <p className="text-sm text-nordic/60">
                Mostrando <span className="font-medium text-nordic">1</span> a{' '}
                <span className="font-medium text-nordic">{filtered.length}</span> de{' '}
                <span className="font-medium text-nordic">{users.length}</span> usuarios
              </p>
              <nav className="relative z-0 inline-flex rounded-md -space-x-px">
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-nordic/50 hover:text-mosque transition-colors">
                  <span className="sr-only">Anterior</span>
                  <span className="material-icons text-xl">chevron_left</span>
                </a>
                <a aria-current="page" href="#" className="z-10 bg-mosque text-white relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-1 shadow-sm">1</a>
                <a href="#" className="bg-transparent text-nordic/70 hover:bg-white hover:text-mosque relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-1 transition-colors">2</a>
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-nordic/50 hover:text-mosque transition-colors">
                  <span className="sr-only">Siguiente</span>
                  <span className="material-icons text-xl">chevron_right</span>
                </a>
              </nav>
            </div>
          </div>
        </footer>
      )}
    </main>
  );
}
