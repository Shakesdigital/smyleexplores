import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
export const hasSupabase = Boolean(supabase);
export const hasServiceRole = Boolean(url && serviceRoleKey);

function noStoreFetch(input: RequestInfo | URL, init?: RequestInit) {
  return fetch(input, {
    ...init,
    cache: "no-store",
  });
}

export function createSupabaseBrowserClient() {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

export function createSupabaseServerClient() {
  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: noStoreFetch,
    },
  });
}

export function createSupabaseServiceRoleClient() {
  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: noStoreFetch,
    },
  });
}
