import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { logger } from "../logger";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) throw new Error("Faltan variables EXPO_PUBLIC_SUPABASE_URL o ANON_KEY");

const isNative = Constants.platform?.ios || Constants.platform?.android;

function getStorage() {
  if (isNative) {
    return require("@react-native-async-storage/async-storage").default;
  }
  return {
    getItem: async (key: string) => {
      if (typeof window === "undefined") return null;
      return window.localStorage.getItem(key);
    },
    setItem: async (key: string, value: string) => {
      if (typeof window !== "undefined") window.localStorage.setItem(key, value);
    },
    removeItem: async (key: string) => {
      if (typeof window !== "undefined") window.localStorage.removeItem(key);
    },
  };
}

const origFetch = globalThis.fetch;
const logFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (!__DEV__) return origFetch(input, init);
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : "url";
  const method = init?.method || "GET";
  logger.network(`${method} ${url}`);
  try {
    const res = await origFetch(input, init);
    res.status >= 400 ? logger.error(`Error ${res.status}`, { url }) : logger.network(`OK ${res.status}`, { url });
    return res;
  } catch (e) {
    logger.error("Connection failed", { url, error: String(e) });
    throw e;
  }
};

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { storage: getStorage(), autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
  global: { fetch: logFetch },
});

logger.info("Supabase init", { url: supabaseUrl });