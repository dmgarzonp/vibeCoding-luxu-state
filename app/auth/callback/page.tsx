'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

/**
 * Página de callback post-OAuth.
 * Supabase redirige aquí tras login con Google/GitHub.
 * Garantiza el registro en user_roles ANTES de ir al home.
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let redirected = false;

    const finish = () => {
      if (!redirected) {
        redirected = true;
        router.replace('/');
      }
    };

    const ensureRole = async (userId: string) => {
      try {
        const { error: rpcError } = await supabase.rpc('ensure_user_role');
        if (rpcError) {
          await supabase
            .from('user_roles')
            .upsert(
              { id: userId, role: 'user' },
              { onConflict: 'id', ignoreDuplicates: true }
            );
        }
      } catch (e) {
        console.error('[auth/callback] Error ensuring role:', e);
      }
    };

    // Verificar si ya hay sesión activa (ej: recarga de página o token ya procesado)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await ensureRole(session.user.id);
        finish();
        return;
      }

      // Si no hay sesión todavía, escuchar el evento SIGNED_IN
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
            await ensureRole(session.user.id);
            finish();
          }
        }
      );

      // Timeout de seguridad reducido a 2s — si no llega evento, redirigir igual
      const timeout = setTimeout(finish, 2000);

      return () => {
        subscription.unsubscribe();
        clearTimeout(timeout);
      };
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-clear-day flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-nordic">
        <div className="w-12 h-12 rounded-xl bg-mosque flex items-center justify-center animate-pulse">
          <span className="material-icons text-white text-2xl">apartment</span>
        </div>
        <p className="text-sm font-medium text-nordic/60">Iniciando sesión…</p>
      </div>
    </div>
  );
}
