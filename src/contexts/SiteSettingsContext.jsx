import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const SiteSettingsContext = createContext(null);

const COUNTRY_OPTIONS = [
  { value: "uk", label: "United Kingdom", currency: "£", postcodeLabel: "Postcode", postcodePlaceholder: "e.g. SW1A 1AA", phonePlaceholder: "07xxx xxxxxx", phoneHelper: "UK: 10–11 digits.", addressPlaceholder: "e.g. 123 High Street, Flat 4, London" },
  { value: "us", label: "United States", currency: "$", postcodeLabel: "ZIP Code", postcodePlaceholder: "e.g. 12345 or 12345-6789", phonePlaceholder: "(555) 123-4567", phoneHelper: "US: 10 digits.", addressPlaceholder: "e.g. 123 Main St, New York, NY" },
  { value: "canada", label: "Canada", currency: "CA$", postcodeLabel: "Postal Code", postcodePlaceholder: "e.g. K1A 0B1", phonePlaceholder: "(555) 123-4567", phoneHelper: "Canada: 10 digits.", addressPlaceholder: "e.g. 123 Main St, Toronto, ON" },
];

export function SiteSettingsProvider({ children }) {
  const [location, setLocationState] = useState("London");
  const [locationFull, setLocationFullState] = useState("London");
  const [locationPostcodes, setLocationPostcodesState] = useState("");
  const [logoUrl, setLogoUrlState] = useState("");
  const [country, setCountryState] = useState("uk");
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
    setLocationFullState(map.location_full || "London");
    setLocationPostcodesState(map.location_postcodes || "");
    setLogoUrlState(map.logo_url || "");
    const c = (map.country || "uk").toLowerCase();
    setCountryState(c === "us" || c === "canada" ? c : "uk");
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
    if (key === "country") {
      const c = (value || "uk").toLowerCase();
      setCountryState(c === "us" || c === "canada" ? c : "uk");
    }
  }

  const countryInfo = COUNTRY_OPTIONS.find((o) => o.value === country) || COUNTRY_OPTIONS[0];
  const countryDisplayName = countryInfo.label;
  const currencySymbol = countryInfo.currency;
  const postcodeLabel = countryInfo.postcodeLabel;
  const postcodePlaceholder = countryInfo.postcodePlaceholder || "e.g. SW1A 1AA";
  const phonePlaceholder = countryInfo.phonePlaceholder || "07xxx xxxxxx";
  const phoneHelper = countryInfo.phoneHelper || "10–11 digits.";
  const addressPlaceholder = countryInfo.addressPlaceholder || "e.g. 123 High Street, Flat 4, London";

  const value = {
    location,
    locationFull,
    locationPostcodes,
    logoUrl,
    country,
    countryDisplayName,
    currencySymbol,
    postcodeLabel,
    postcodePlaceholder,
    phonePlaceholder,
    phoneHelper,
    addressPlaceholder,
    countryOptions: COUNTRY_OPTIONS,
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
