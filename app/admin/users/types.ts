// Tipos compartidos del módulo de administración de usuarios
export interface UserWithRole {
  id: string;
  role: 'admin' | 'user';
  created_at: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}
