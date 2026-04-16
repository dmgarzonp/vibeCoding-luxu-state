'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase';

const navItems = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/properties', label: 'Propiedades', exact: false },
  { href: '/admin/users', label: 'Usuarios', exact: false },
  { href: '/admin/inquiries', label: 'Consultas', exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);

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
            <button className="text-nordic/60 hover:text-mosque transition-colors relative">
              <span className="material-icons text-xl">notifications</span>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <button className="flex items-center gap-2 ml-2">
              <div className="h-8 w-8 rounded-full bg-nordic/10 flex items-center justify-center overflow-hidden border border-nordic/10">
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-icons text-nordic/60 text-lg">person</span>
                )}
              </div>
            </button>
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
