import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class SupabaseService {
  // Authentication
  static async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  static async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    return { data, error };
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // Database operations
  static async executeQuery(query: string, params?: any[]) {
    try {
      const { data, error } = await supabase.rpc('execute_sql', {
        query,
        params: params || []
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Projects
  static async saveProject(project: any) {
    const { data, error } = await supabase
      .from('projects')
      .upsert(project)
      .select();
    return { data, error };
  }

  static async getProjects(userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId);
    return { data, error };
  }

  // Schema operations
  static async syncSchema(tables: any[]) {
    const { data, error } = await supabase
      .from('database_schemas')
      .upsert(tables)
      .select();
    return { data, error };
  }
}