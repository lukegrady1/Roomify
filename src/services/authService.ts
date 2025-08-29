import { supabase } from '../lib/supabase';

export const signUp = async (email: string, password: string, userData?: { full_name?: string }) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: userData ? { data: userData } : undefined
  });
};

export const login = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const logout = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email);
};