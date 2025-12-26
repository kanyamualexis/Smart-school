
import { createClient } from '@supabase/supabase-js';

// Robust environment variable retrieval
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    console.warn('Error accessing environment variables:', e);
  }
  return undefined;
};

// Fallback credentials from environment dump
const DEFAULT_URL = "https://wzsahkqteseumlikpeuf.supabase.co";
const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6c2Foa3F0ZXNldW1saWtwZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDA3OTksImV4cCI6MjA4MjMxNjc5OX0.z0bU8O4C8I01CcsYuoFzlPDrJJOibwQMZ16VXrgFrzc";

// Check VITE_, NEXT_PUBLIC_, and fallback to defaults
const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL') || DEFAULT_URL;
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
