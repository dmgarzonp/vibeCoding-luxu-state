'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase';

const navItems = [
  { href: '/admin', label: 'Resumen', icon: 'dashboard' },
  { href: '/admin/properties', label: 'Propiedades', icon: 'home_work' },
  { href: '/admin/users', label: 'Usuarios', icon: 'manage_accounts' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email || 'Admin',
          avatar: session.user.user_metadata?.avatar_url || '',
        });
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex bg-[#0f1923] text-white font-display">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 flex flex-col
          bg-[#111c27] border-r border-white/5
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-mosque flex items-center justify-center flex-shrink-0">
            <span className="material-icons text-white text-lg">apartment</span>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">LuxeEstate</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-mosque text-white shadow-[0_0_20px_-5px_rgba(0,102,85,0.5)]'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <span className="material-icons text-[20px]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-mosque/30 overflow-hidden flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="material-icons text-mosque text-lg flex items-center justify-center w-full h-full">person</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-white/40">Administrador</p>
            </div>
            <Link href="/" title="Volver al sitio" className="text-white/30 hover:text-white transition-colors">
              <span className="material-icons text-[18px]">open_in_new</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-[#0f1923]/90 backdrop-blur-md">
          <button
            className="md:hidden text-white/50 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-icons">menu</span>
          </button>
          <h1 className="text-sm font-semibold text-white/80">
            {navItems.find((n) => pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href)))?.label ?? 'Admin'}
          </h1>
          <div className="ml-auto flex items-center gap-3 text-xs text-white/30">
            <span className="material-icons text-[16px]">circle</span>
            <span>En línea</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
