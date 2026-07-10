import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Mock implementation for development/testing without keys
const createMockClient = () => {
  return {
    auth: {
      getSession: async () => ({ data: { session: { user: { id: 'mock-user', email: 'admin@example.com' }, access_token: 'mock-token' } }, error: null }),
      signInWithPassword: async () => ({ data: { user: { id: 'mock-user', email: 'admin@example.com' }, session: {} }, error: null }),
      signUp: async () => ({ data: { user: { id: 'mock-user', email: 'admin@example.com' }, session: {} }, error: null }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (cb: any) => {
        cb('SIGNED_IN', { user: { id: 'mock-user', email: 'admin@example.com' } });
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: { id: 'mock-user', email: 'admin@example.com', role: 'admin' }, error: null })
        })
      })
    })
  } as any;
};

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();
