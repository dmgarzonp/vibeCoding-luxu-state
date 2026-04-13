-- ============================================================
-- Verificar y backfill de usuarios existentes
-- ============================================================

-- Ver cuántos usuarios están en auth.users
SELECT id, email, created_at, raw_app_meta_data->>'provider' as provider
FROM auth.users
ORDER BY created_at DESC;

-- Insertar los que faltan en user_roles
INSERT INTO public.user_roles (id, role)
SELECT id, 'user'::public.app_role
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_roles)
ON CONFLICT (id) DO NOTHING;

-- Verificar resultado final
SELECT 
  u.email,
  u.raw_app_meta_data->>'provider' as provider,
  r.role,
  r.created_at
FROM auth.users u
LEFT JOIN public.user_roles r ON r.id = u.id
ORDER BY u.created_at DESC;
