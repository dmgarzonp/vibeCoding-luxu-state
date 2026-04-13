-- ============================================================
-- LUXE STATE - Backfill + Fix completo de user_roles
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Backfill: insertar usuarios existentes que no tienen registro
INSERT INTO public.user_roles (id, role)
SELECT id, 'user'::public.app_role
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_roles)
ON CONFLICT (id) DO NOTHING;

-- 2. Función RPC segura para upsert desde el cliente
CREATE OR REPLACE FUNCTION public.ensure_user_role()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (id, role)
  VALUES (auth.uid(), 'user')
  ON CONFLICT (id) DO NOTHING;
END;
$$;

-- Permitir que usuarios autenticados llamen a esta función
GRANT EXECUTE ON FUNCTION public.ensure_user_role() TO authenticated;

-- 3. Política INSERT para que usuarios puedan crear su propio registro
--    (necesaria para el fallback upsert directo)
DROP POLICY IF EXISTS "users_can_insert_own_role" ON public.user_roles;
CREATE POLICY "users_can_insert_own_role"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
