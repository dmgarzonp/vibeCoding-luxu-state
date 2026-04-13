import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo proteger rutas /admin
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  console.log(`[Middleware] 🛡️ Protegiendo ruta: ${pathname}`);

  // 1. Buscar el token en cookies
  // Prioridad: sb-access-token (nuestra) > sb-*-auth-token (Supabase)
  let accessToken: string | null = null;
  const allCookies = request.cookies.getAll();

  // Intento A: Nuestra cookie de sincronización
  const syncCookie = request.cookies.get('sb-access-token');
  if (syncCookie) {
    accessToken = syncCookie.value;
    console.log('[Middleware] ✅ Token encontrado en cookie sb-access-token');
  }

  // Intento B: Cookies estándar de Supabase (si no encontramos el anterior)
  if (!accessToken) {
    for (const { name, value } of allCookies) {
      if (name.startsWith('sb-') && name.endsWith('-auth-token')) {
        try {
          const parsed = JSON.parse(decodeURIComponent(value));
          accessToken = parsed?.access_token ?? null;
          if (accessToken) console.log(`[Middleware] 🍪 Token extraído de cookie Supabase: ${name}`);
        } catch { /* ignore */ }
      }
    }
  }

  if (!accessToken) {
    console.log('[Middleware] ❌ No se encontró token de sesión. Redirigiendo a /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Verificar el token con Supabase
  let userId: string | null = null;
  try {
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: SUPABASE_ANON_KEY,
      },
    });

    if (!userRes.ok) {
      console.log(`[Middleware] ❌ Token inválido o expirado. Status: ${userRes.status}`);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const userData = await userRes.json();
    userId = userData.id ?? null;
    console.log(`[Middleware] 👤 Usuario verificado: ${userData.email} (${userId})`);
  } catch (error) {
    console.error('[Middleware] 🔥 Error verificando token:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!userId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Verificar el rol del usuario en la tabla user_roles
  try {
    const roleRes = await fetch(
      `${SUPABASE_URL}/rest/v1/user_roles?id=eq.${userId}&select=role`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: SUPABASE_ANON_KEY,
        },
      }
    );

    if (!roleRes.ok) {
      console.log(`[Middleware] ❌ Error consultando rol. Status: ${roleRes.status}`);
      return NextResponse.redirect(new URL('/', request.url));
    }

    const roleData: Array<{ role: string }> = await roleRes.json();
    const role = roleData[0]?.role;

    console.log(`[Middleware] 👑 Rol detectado: ${role}`);

    if (role !== 'admin') {
      console.log('[Middleware] 🚫 Acceso denegado: El usuario no es administrador.');
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url));
    }
  } catch (error) {
    console.error('[Middleware] 🔥 Error consultando rol:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.log('[Middleware] 🔓 Acceso concedido.');
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

