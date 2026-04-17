'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase';

function syncSessionToCookie(session: any) {
  if (typeof document === 'undefined') return;
  const token = session?.access_token;
  if (token) {
    document.cookie = `sb-access-token=${token}; path=/; max-age=3600; SameSite=Lax;`;
  } else {
    document.cookie = `sb-access-token=; path=/; max-age=0; SameSite=Lax;`;
  }
}

const navItems = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/properties', label: 'Propiedades', exact: false },
  { href: '/admin/users', label: 'Usuarios', exact: false },
  { href: '/admin/inquiries', label: 'Consultas', exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; avatar: string; email: string } | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email || 'Admin',
          avatar: session.user.user_metadata?.avatar_url || '',
          email: session.user.email || '',
        });
        syncSessionToCookie(session);
      }
    });

    // Clic fuera para cerrar dropdown
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsProfileOpen(false);

    // 1. Limpiar cookie y localStorage de inmediato
    syncSessionToCookie(null);
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('sb-'))
        .forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('signOut error:', e);
    }

    // 2. Redirigir de inmediato — sin bloquear la UI
    window.location.href = '/';

    // 3. signOut en background (best-effort)
    supabase.auth.signOut({ scope: 'local' }).catch((e) => {
      console.warn('signOut error:', e);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-clear-day text-nordic font-display antialiased">
      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-nordic/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          {/* Logo + Nav links */}
          <div className="flex items-center gap-12">
            <Link href="/admin" className="flex-shrink-0 flex items-center gap-2">
              <span className="material-icons text-mosque text-2xl">apartment</span>
              <span className="font-bold text-lg text-nordic tracking-tight">LuxeEstate</span>
            </Link>

            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 py-2 text-sm font-semibold transition-all duration-300 border-b-2 ${
                      isActive
                        ? 'text-mosque border-mosque bg-mosque/5'
                        : 'text-nordic/50 border-transparent hover:text-mosque hover:bg-mosque/[0.02]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-[2px] left-0 w-full h-[2px] bg-mosque shadow-[0_0_8px_rgba(0,102,102,0.4)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-5">
            <button className="text-nordic/60 hover:text-mosque transition-colors">
              <span className="material-icons text-xl">search</span>
            </button>
            <div className="relative ml-2" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 group"
                disabled={isLoggingOut}
              >
                <div className={`h-9 w-9 rounded-full bg-nordic/10 flex items-center justify-center overflow-hidden border transition-all ${isProfileOpen ? 'border-mosque ring-2 ring-mosque/20' : 'border-nordic/10 group-hover:border-mosque'}`}>
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className={`w-full h-full object-cover ${isLoggingOut ? 'opacity-30' : ''}`}
                    />
                  ) : (
                    <span className="material-icons text-nordic/60 text-lg">person</span>
                  )}
                  {isLoggingOut && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-icons text-mosque text-xs animate-spin">refresh</span>
                    </div>
                  )}
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-nordic/5 overflow-hidden z-[100] animate-fade-in-down">
                  <div className="px-5 py-4 border-b border-nordic/5 bg-nordic/5">
                    <p className="text-sm font-bold text-nordic truncate">{user?.name}</p>
                    <p className="text-xs text-nordic/50 truncate mt-0.5">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/"
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-nordic/70 hover:bg-mosque/5 hover:text-mosque transition-colors"
                    >
                      <span className="material-icons text-[20px]">home</span>
                      <span>Ver Sitio Público</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <span className={`material-icons text-[20px] ${isLoggingOut ? 'animate-spin' : ''}`}>
                        {isLoggingOut ? 'refresh' : 'logout'}
                      </span>
                      <span>{isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Page Content ────────────────────────────────────────── */}
      <div className="flex-1 w-full flex flex-col">
        {children}
      </div>
    </div>
  );
}
