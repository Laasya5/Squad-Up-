"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

let supabase: SupabaseClient | null = null;

export function createClient() {
  if (supabase) return supabase;

  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Supabase is not configured. Add the required variables to .env.local.");
  }

  supabase = createBrowserClient(config.url, config.publishableKey);
  return supabase;
}
