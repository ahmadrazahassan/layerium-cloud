"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { routes } from "@/lib/routes";
import type { User, Session } from "@supabase/supabase-js";

export type UserRole = "USER" | "ADMIN";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  company_name: string | null;
  role: UserRole;
  is_active: boolean;
  email_verified: boolean;
  timezone: string | null;
  email_notifications: boolean;
  marketing_emails: boolean;
  notes: string | null;
  last_login_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithGitHub: () => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

type AuthContextType = AuthState & AuthActions;

const AuthContext = createContext<AuthContextType | null>(null);

// Lazy initialize supabase client only in browser
let supabase: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error("Supabase client can only be used in browser");
  }
  if (!supabase) {
    supabase = createClient();
  }
  return supabase;
}

// Helper to create profile from user metadata
function createProfileFromUser(user: User): UserProfile {
  const fullName = user.user_metadata?.full_name 
    || user.user_metadata?.name 
    || user.email?.split("@")[0] 
    || null;
    
  return {
    id: user.id,
    email: user.email || "",
    full_name: fullName,
    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
    phone: null,
    company_name: null,
    role: "USER" as UserRole,
    is_active: true,
    email_verified: user.email_confirmed_at ? true : false,
    timezone: "UTC",
    email_notifications: true,
    marketing_emails: false,
    notes: null,
    last_login_at: null,
    metadata: {},
    created_at: user.created_at,
    updated_at: new Date().toISOString(),
  };
}

// Helper to fetch profile from database
async function fetchProfileFromDB(userId: string): Promise<UserProfile | null> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      // PGRST116 = no rows found, expected for new users
      if (error.code !== "PGRST116") {
        console.warn("Profile fetch error:", error.message);
      }
      return null;
    }
    return data as UserProfile;
  } catch (err) {
    console.error("Profile fetch exception:", err);
    return null;
  }
}

// Helper to ensure profile exists in database
async function ensureProfileInDB(user: User): Promise<UserProfile | null> {
  try {
    const supabase = getSupabaseClient();
    const fullName = user.user_metadata?.full_name
      || user.user_metadata?.name
      || user.email?.split("@")[0]
      || null;

    const { data, error } = await (supabase.from("profiles") as any)
      .upsert({
        id: user.id,
        email: user.email || "",
        full_name: fullName,
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        role: "USER",
        is_active: true,
        email_verified: !!user.email_confirmed_at,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "id",
        ignoreDuplicates: false,
      })
      .select("*")
      .single();

    if (error) {
      console.warn("Profile upsert error:", error.message);
      return null;
    }
    return data as UserProfile;
  } catch (err) {
    console.error("Profile upsert exception:", err);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
  });

  // Helper to load profile and update state
  const loadUserState = useCallback(async (
    user: User,
    session: Session,
    mounted: { current: boolean }
  ) => {
    // 1. Try fetching existing profile from DB
    let profile = await fetchProfileFromDB(user.id);

    // 2. No profile row? Create one from user metadata so it persists
    if (!profile) {
      profile = await ensureProfileInDB(user);
    }

    // 3. Last resort fallback (DB write also failed)
    if (!profile) {
      profile = createProfileFromUser(user);
    }

    if (!mounted.current) return;

    setState({
      user,
      profile,
      session,
      isLoading: false,
      isAuthenticated: true,
      isAdmin: profile?.role === "ADMIN",
    });
  }, []);

  // Initialize auth - single source of truth via onAuthStateChange
  useEffect(() => {
    const mounted = { current: true };
    const supabase = getSupabaseClient();

    // onAuthStateChange fires INITIAL_SESSION on mount, then subsequent events.
    // This is the single source of truth — no separate getSession() call needed.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted.current) return;

        console.log("Auth state change:", event, session?.user?.email);

        if (event === "SIGNED_OUT" || !session?.user) {
          setState({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            isAdmin: false,
          });
          if (event === "SIGNED_OUT") {
            router.push(routes.home);
          }
          return;
        }

        // INITIAL_SESSION, SIGNED_IN, TOKEN_REFRESHED — all load the user
        await loadUserState(session.user, session, mounted);
      }
    );

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [router, loadUserState]);

  // Auth actions
  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error: error?.message || null };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${routes.auth.callback}` },
    });
    return { error: error?.message || null };
  }, []);

  const signInWithGitHub = useCallback(async () => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}${routes.auth.callback}` },
    });
    return { error: error?.message || null };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    
    let profile = await fetchProfileFromDB(state.user.id);
    if (!profile) {
      profile = createProfileFromUser(state.user);
    }

    setState(prev => ({
      ...prev,
      profile,
      isAdmin: profile?.role === "ADMIN",
    }));
  }, [state.user]);

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGitHub,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    // Return default state when used outside provider
    return {
      user: null,
      profile: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,
      isAdmin: false,
      signIn: async () => ({ error: "Auth provider not found" }),
      signUp: async () => ({ error: "Auth provider not found" }),
      signOut: async () => {},
      signInWithGoogle: async () => ({ error: "Auth provider not found" }),
      signInWithGitHub: async () => ({ error: "Auth provider not found" }),
      refreshProfile: async () => {},
    };
  }
  
  return context;
}
