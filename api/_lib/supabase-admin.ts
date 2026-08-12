import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../src/integrations/supabase/types";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const publishableKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const getSupabaseServer = (options: { requireServiceRole?: boolean } = {}) => {
  const key = options.requireServiceRole ? serviceRoleKey : serviceRoleKey ?? publishableKey;

  if (!supabaseUrl || !key) {
    throw new Error("Supabase URL and server key are required");
  }

  return createClient<Database>(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

export const getSupabaseAdmin = () =>
  getSupabaseServer({ requireServiceRole: true });
