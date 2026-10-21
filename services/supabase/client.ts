import "react-native-url-polyfill/auto";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY");
}

// During a web static build the code runs on a server where `window` does not exist.
const isServer = Platform.OS === "web" && typeof window === "undefined";

export const supabase = createClient(url, key, {
  auth: {
    storage: isServer ? undefined : AsyncStorage,
    persistSession: !isServer,
    autoRefreshToken: !isServer,
    detectSessionInUrl: Platform.OS === "web" && !isServer,
  },
});
