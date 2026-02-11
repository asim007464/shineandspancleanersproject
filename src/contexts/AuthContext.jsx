import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
        if (cancelled) return;
        await fetchApplicationStatus(session.user.id);
      } else {
        setProfile(null);
        setApplicationStatus(null);
      }
      if (!cancelled) setLoading(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchApplicationStatus(session.user.id);
      } else {
        setProfile(null);
        setApplicationStatus(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(uid) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", uid).single();
    if (error) {
      console.warn("Profile fetch failed:", error.message);
      setProfile(null);
      return;
    }
    setProfile(data ?? null);
  }

  async function fetchApplicationStatus(uid) {
    const { data, error } = await supabase
      .from("applications")
      .select("status")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      console.warn("Application status fetch failed:", error.message);
      setApplicationStatus(null);
      return;
    }
    setApplicationStatus(data?.status ?? null);
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data?.user?.id) await fetchProfile(data.user.id);
    return data;
  }

  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setApplicationStatus(null);
  }

  const value = {
    user,
    profile,
    applicationStatus,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: profile?.role === "admin",
    refreshApplicationStatus: user ? () => fetchApplicationStatus(user.id) : () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
