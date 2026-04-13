import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Cliente con Service Role: bypasses RLS, sólo usar en server-side
 * (Server Components, Server Actions, API Routes).
 * NUNCA exponer al cliente (no usar en 'use client').
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

/**
 * Cliente anon para server-side (respeta RLS).
 */
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);
