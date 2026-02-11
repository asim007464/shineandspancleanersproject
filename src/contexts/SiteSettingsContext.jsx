import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const [location, setLocationState] = useState("London");
  const [locationFull, setLocationFullState] = useState("London, United Kingdom");
  const [locationPostcodes, setLocationPostcodesState] = useState("");
  const [logoUrl, setLogoUrlState] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchSettings() {
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error) {
      console.warn("Site settings fetch failed:", error);
      setLoading(false);
      return;
    }
    const map = Object.fromEntries((data || []).map((r) => [r.key, r.value]));
    setLocationState(map.location || "London");
    setLocationFullState(map.location_full || "London, United Kingdom");
    setLocationPostcodesState(map.location_postcodes || "");
    setLogoUrlState(map.logo_url || "");
    setLoading(false);
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  async function updateSetting(key, value) {
    const { error } = await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) throw error;
    if (key === "location") setLocationState(value);
    if (key === "location_full") setLocationFullState(value);
    if (key === "location_postcodes") setLocationPostcodesState(value);
    if (key === "logo_url") setLogoUrlState(value);
  }

  const value = {
    location,
    locationFull,
    locationPostcodes,
    logoUrl,
    loading: loading,
    updateSetting,
    refresh: fetchSettings,
  };

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return ctx;
}
