import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
// import {
//   EXPO_PUBLIC_SUPABASE_URL,
//   EXPO_PUBLIC_SUPABASE_ANON_KEY,
// } from "../.env";

// Polyfill for TextEncoder and TextDecoder

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

// console.log("1", process.env.EXPO_PUBLIC_SUPABASE_URL);
// console.log("2", process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
