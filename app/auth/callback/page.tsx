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

    // Escuchar el evento SIGNED_IN que Supabase dispara al procesar el hash de OAuth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Garantizar que existe registro en user_roles
            const { error: rpcError } = await supabase.rpc('ensure_user_role');

            if (rpcError) {
              // Fallback: upsert directo
              await supabase
                .from('user_roles')
                .upsert(
                  { id: session.user.id, role: 'user' },
                  { onConflict: 'id', ignoreDuplicates: true }
                );
            }
          } catch (e) {
            console.error('[auth/callback] Error ensuring role:', e);
          }

          finish();
        }
      }
    );

    // Seguro: si en 5 segundos no llega el evento, redirigir igual
    const timeout = setTimeout(finish, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
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
