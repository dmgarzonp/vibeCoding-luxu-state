-- ============================================================
-- LUXE STATE - Script: Creación de tabla user_roles
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Crear el tipo ENUM para los roles disponibles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Crear la tabla user_roles
CREATE TABLE public.user_roles (
  id          UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role        public.app_role NOT NULL DEFAULT 'user',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Comentarios para documentar la tabla
COMMENT ON TABLE public.user_roles IS 'Roles de usuarios autenticados de la aplicación Luxe State';
COMMENT ON COLUMN public.user_roles.id IS 'UUID del usuario, referencia a auth.users';
COMMENT ON COLUMN public.user_roles.role IS 'Rol del usuario: admin o user';

-- 4. Índice para búsquedas por rol
CREATE INDEX idx_user_roles_role ON public.user_roles (role);

-- ============================================================
-- TRIGGER: Asignar rol 'user' automáticamente al registrarse
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FUNCIÓN HELPER: Verificar si un usuario es admin
-- (útil en políticas RLS y server actions)
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Habilitar RLS en la tabla
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver su propio rol
CREATE POLICY "users_can_read_own_role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = id);

-- Política: Los admins pueden ver todos los roles
CREATE POLICY "admins_can_read_all_roles"
  ON public.user_roles
  FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Política: Solo los admins pueden actualizar roles
CREATE POLICY "admins_can_update_roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================
-- TRIGGER: Actualizar updated_at automáticamente
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_roles_updated
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- ⚡ PASO FINAL: Asigna el rol 'admin' a tu usuario
-- Reemplaza el UUID con el tuyo (lo encuentras en
-- Supabase Dashboard > Authentication > Users)
-- ============================================================

-- UPDATE public.user_roles
-- SET role = 'admin'
-- WHERE id = 'TU-UUID-AQUI';
