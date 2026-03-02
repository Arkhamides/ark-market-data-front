// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_HOST;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export async function signUp(email: string, password: string) {
    return supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
    return supabase.auth.signOut();
}

export async function getUser() {
    return supabase.auth.getUser();
}

export async function getSession() {
    return supabase.auth.getSession();
}

export async function insertIntoTable<T>(table: string, values: T) {
    const { data, error } = await supabase.from(table).insert(values).select();
    if (error) throw error;
    return data;
}
