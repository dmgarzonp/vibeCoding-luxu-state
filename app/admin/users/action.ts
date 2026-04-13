'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '../../../lib/supabase/server';

/**
 * Server Action para actualizar el rol de un usuario.
 * Usa el cliente admin (service role) para bypassear RLS.
 */
export async function updateUserRole(
  userId: string,
  newRole: 'admin' | 'user'
): Promise<{ success: boolean; error?: string }> {
  if (!userId || !['admin', 'user'].includes(newRole)) {
    return { success: false, error: 'Parámetros inválidos.' };
  }

  const { error } = await supabaseAdmin
    .from('user_roles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) {
    console.error('[updateUserRole] Error:', error.message);
    return { success: false, error: error.message };
  }

  // Revalidar la página de usuarios para reflejar los cambios
  revalidatePath('/admin/users');

  return { success: true };
}
