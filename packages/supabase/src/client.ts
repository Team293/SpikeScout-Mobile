import { createClient } from '@supabase/supabase-js';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { z } from 'zod';

import { Database } from './database.types';
import { LargeSecureStore } from './large-secure-store';

const storage = Platform.OS === 'web' ? AsyncStorage : new LargeSecureStore();

const { supabaseUrl, supabaseAnonKey } = z
  .object({
    supabaseUrl: z.string(),
    supabaseAnonKey: z.string(),
  })
  .parse({
    supabaseUrl: 'https://oibjwelnhwnuktptqldj.supabase.co/',
    supabaseAnonKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pYmp3ZWxuaHdudWt0cHRxbGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzgwMjQsImV4cCI6MjA1NTkxNDAyNH0.4vE9-yPsK37auaIth8EFkLQlX4B7iMQ8OelJmA-72qo',
  });

export const getSupabaseBrowserClient = <GenericSchema = Database>() =>
  createClient<GenericSchema>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: typeof document !== 'undefined',
      detectSessionInUrl: false,
    },
  });
