import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  User,
  FileText,
  Gift,
  Settings,
  LogOut,
  Loader2,
  Upload,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSiteSettings } from "../contexts/SiteSettingsContext";
import { supabase } from "../lib/supabase";

const BUCKET_LOGO = "logos";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function formatAvailability(availability) {
  if (!availability || typeof availability !== "object") return null;
  return DAYS.filter((day) => availability[day]?.enabled).map((day) => {
    const d = availability[day];
    const slots = [d.s1_start && d.s1_end && `${d.s1_start}–${d.s1_end}`, d.s2_start && d.s2_end && `${d.s2_start}–${d.s2_end}`, d.s3_start && d.s3_end && `${d.s3_start}–${d.s3_end}`].filter(Boolean);
    return { day, slots: slots.length ? slots.join(", ") : "—" };
  });
}

function ApplicationDetail({ app, referrerProfile, variant = "current" }) {
  const fd = app.form_data || {};
  const avail = formatAvailability(fd.availability);
  const elig = fd.eligibility || {};
  const isCurrent = variant === "current";

  const borderRow = isCurrent ? "border-b border-blue-100 last:border-0" : "border-b border-slate-300 last:border-0";
  const labelClass = isCurrent ? "py-2.5 pr-5 text-xs font-medium text-slate-600 tracking-wide whitespace-nowrap align-top w-36" : "py-2 pr-4 text-xs font-medium text-slate-400 tracking-wide whitespace-nowrap align-top w-36";
  const valueClass = isCurrent ? "py-2.5 text-slate-800 text-sm align-top" : "py-2 text-slate-400 text-sm align-top";
  const sectionHeaderClass = isCurrent ? "text-xs font-semibold text-blue-800 tracking-wide flex items-center gap-2" : "text-xs font-semibold text-slate-400 tracking-wide flex items-center gap-2";
  const iconClass = isCurrent ? "text-blue-600" : "text-slate-400";

  const tableRow = (label, value) => (
    <tr key={label} className={borderRow}>
      <td className={labelClass}>{label}</td>
      <td className={valueClass}>{value || "—"}</td>
    </tr>
  );

  const sectionHeader = (title, icon) => (
    <tr>
      <td colSpan={2} className="pt-5 pb-1.5 first:pt-0">
        <h4 className={sectionHeaderClass}>
          <span className={iconClass}>{icon}</span> {title}
        </h4>
      </td>
    </tr>
  );

  const tableWrapperClass = isCurrent
    ? "bg-blue-50/60 rounded-lg border border-blue-200 overflow-hidden px-6 py-5"
    : "bg-slate-100 rounded-lg border border-slate-300 overflow-hidden px-5 py-4 opacity-90";
  const referrerSectionClass = isCurrent
    ? "mt-5 rounded-lg border border-blue-200 bg-blue-50/80 px-5 py-3"
    : "mt-4 rounded-lg border border-slate-300 bg-slate-200/80 px-4 py-3";
  const referrerHeadingClass = isCurrent ? "text-xs font-semibold text-blue-800 tracking-wide mb-1" : "text-xs font-semibold text-slate-400 tracking-wide mb-1";
  const referrerTextClass = isCurrent ? "text-slate-700 text-sm" : "text-slate-500 text-sm";

  return (
    <div className="pt-4">
      <div className={tableWrapperClass}>
        <div className="overflow-x-auto -mx-1 sm:mx-0">
        <table className="w-full text-left min-w-[280px]">
          <tbody>
            {sectionHeader("Personal & contact", <User size={13} />)}
            {tableRow("Name", [fd.firstName, fd.middleName, fd.surname].filter(Boolean).join(" "))}
            {tableRow("Gender", fd.gender)}
            {tableRow("Email", fd.email)}
            {tableRow("Phone", fd.phone)}
            {tableRow("Postcode", fd.postcode)}

            {sectionHeader("Experience", <Briefcase size={13} />)}
            {tableRow("Experience level", fd.experienceLevel)}
            {(fd.experienceTypes?.length || fd.otherExperienceTypes?.length) ? tableRow("Experience types", [...(fd.experienceTypes || []), ...(fd.otherExperienceTypes || [])].filter(Boolean).join(", ")) : null}

            {sectionHeader("Eligibility", <CheckCircle2 size={13} />)}
            <tr className={borderRow}>
              <td colSpan={2} className="py-2.5">
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "workRights", label: "Right to work" },
                    { key: "bankAccount", label: "UK bank account" },
                    { key: "selfEmployed", label: "Self-employed" },
                    { key: "cleanRecord", label: "Clean record" },
                  ].map(({ key, label }) => (
                    <span
                      key={key}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${elig[key] ? "bg-emerald-50 text-emerald-700" : isCurrent ? "bg-blue-100 text-slate-600" : "bg-slate-300 text-slate-500"}`}
                    >
                      {elig[key] ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {label}: {elig[key] ? "Yes" : "No"}
                    </span>
                  ))}
                </div>
              </td>
            </tr>

            {sectionHeader("Availability", <Calendar size={13} />)}
            {avail && avail.length > 0 ? (
              avail.map(({ day, slots }) => (
                <tr key={day} className={borderRow}>
                  <td className={labelClass}>{day}</td>
                  <td className={valueClass}>{slots}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className={`py-2 text-sm ${isCurrent ? "text-slate-400" : "text-slate-400"}`}>No availability set.</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {app.referrer_id && (
        <section className={referrerSectionClass}>
          <h4 className={referrerHeadingClass}>Referred by</h4>
          <p className={referrerTextClass}>
            {referrerProfile ? (
              <span>{referrerProfile.full_name || referrerProfile.email} ({referrerProfile.email})</span>
            ) : (
              <span>Referrer ID: <span className="font-mono text-slate-600">{app.referrer_id}</span></span>
            )}
          </p>
        </section>
      )}
    </div>
  );
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signOut, isAdmin } = useAuth();
  const { location, locationPostcodes, logoUrl, updateSetting, refresh } = useSiteSettings();
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [locationForm, setLocationForm] = useState({ name: "", postcodes: "" });
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [locationFormError, setLocationFormError] = useState("");
  const [expandApp, setExpandApp] = useState(null);
  const [expandUserKey, setExpandUserKey] = useState(null);
  const [seeMoreAppsKeys, setSeeMoreAppsKeys] = useState({});
  const [appFilterName, setAppFilterName] = useState("");
  const [appFilterPostcode, setAppFilterPostcode] = useState("");
  const [appFilterPhone, setAppFilterPhone] = useState("");
  const [appFilterStatus, setAppFilterStatus] = useState("");
  const [appFilterExperience, setAppFilterExperience] = useState("");
  const [appFilterEligibility, setAppFilterEligibility] = useState("");
  const [appFilterDate, setAppFilterDate] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [userSort, setUserSort] = useState("role"); // 'role' | 'date' | 'name_asc' | 'name_desc'
  const [userRoleFilter, setUserRoleFilter] = useState("all"); // 'all' | 'admins' | 'workers' | 'users'
  const [refSearch, setRefSearch] = useState("");
  const [refFilterProgress, setRefFilterProgress] = useState(""); // '' | 'working' | 'waiting'
  const [refFilterRewardStatus, setRefFilterRewardStatus] = useState(""); // '' | 'eligible' | 'claimed' | 'pending'

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/login", { replace: true });
      return;
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    async function load() {
      setLoading(true);
      try {
        const [profilesRes, appsRes, refsRes, locationsRes] = await Promise.all([
          supabase.from("profiles").select("id, email, full_name, role, referral_code, created_at, is_main_admin").order("created_at", { ascending: false }),
          supabase.from("applications").select("id, form_data, referrer_id, user_id, status, created_at").order("created_at", { ascending: false }),
          supabase.from("referrals").select("id, referrer_id, referred_application_id, referred_user_id, days_worked, referred_application_status, reward_eligible_at, reward_claimed_at, status, created_at").order("created_at", { ascending: false }),
          supabase.from("locations").select("id, name, postcodes, created_at").order("name"),
        ]);
        setUsers(profilesRes.data || []);
        setApplications(appsRes.data || []);
        setReferrals(refsRes.data || []);
        setLocations(locationsRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, isAdmin, tab]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const fileName = `logo-${Date.now()}.${file.name.split(".").pop()}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET_LOGO).upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from(BUCKET_LOGO).getPublicUrl(fileName);
      await updateSetting("logo_url", urlData.publicUrl);
      refresh();
    } catch (err) {
      console.error("Logo upload failed. In Supabase: 1) Storage → create bucket 'logos' (Public ON). 2) SQL Editor → run supabase/migrations/storage_logos_bucket_policies.sql", err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateReferral = async (referralId, field, value) => {
    try {
      await supabase.from("referrals").update({ [field]: value, updated_at: new Date().toISOString() }).eq("id", referralId);
      setReferrals((prev) => prev.map((r) => (r.id === referralId ? { ...r, [field]: value } : r)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateApplicationStatus = async (appId, status) => {
    try {
      await supabase.from("applications").update({ status }).eq("id", appId);
      setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    if (newRole !== "user" && newRole !== "admin") return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq("id", userId);
      if (error) throw error;
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (e) {
      console.error("Failed to update role:", e);
    }
  };

  const getProfileById = (id) => users.find((u) => u.id === id);
  const getAppById = (id) => applications.find((a) => a.id === id);

  const userIdsWithApplications = useMemo(
    () => new Set((applications || []).map((a) => a.user_id).filter(Boolean)),
    [applications]
  );
  const isWorker = (u) => u.role === "worker" || (u.role === "user" && userIdsWithApplications.has(u.id));
  const roleOrder = (u) => (u.is_main_admin ? 0 : u.role === "admin" ? 1 : isWorker(u) ? 2 : 3);

  const filteredAndSortedUsers = useMemo(() => {
    let list = users;
    if (userRoleFilter === "admins") {
      list = users.filter((u) => u.is_main_admin || u.role === "admin");
    } else if (userRoleFilter === "workers") {
      list = users.filter((u) => isWorker(u));
    } else if (userRoleFilter === "users") {
      list = users.filter((u) => u.role === "user" && !userIdsWithApplications.has(u.id));
    }
    const q = (userSearch || "").trim().toLowerCase();
    if (q) {
      list = list.filter(
        (u) =>
          (u.email || "").toLowerCase().includes(q) ||
          (u.full_name || "").toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      const orderA = roleOrder(a);
      const orderB = roleOrder(b);
      if (orderA !== orderB) return orderA - orderB;
      if (userSort === "date")
        return new Date(b.created_at) - new Date(a.created_at);
      if (userSort === "name_asc")
        return (a.full_name || a.email || "").localeCompare(b.full_name || b.email || "");
      if (userSort === "name_desc")
        return (b.full_name || b.email || "").localeCompare(a.full_name || a.email || "");
      return 0;
    });
  }, [users, userSearch, userSort, userRoleFilter, userIdsWithApplications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const fd = app.form_data || {};
      const nameStr = [fd.firstName, fd.middleName, fd.surname].filter(Boolean).join(" ").toLowerCase();
      if (appFilterName.trim() && !nameStr.includes(appFilterName.toLowerCase().trim())) return false;
      if (appFilterPostcode.trim()) {
        const pc = (fd.postcode || "").toLowerCase().replace(/\s/g, "");
        if (!pc.includes(appFilterPostcode.toLowerCase().replace(/\s/g, ""))) return false;
      }
      if (appFilterPhone.trim() && !(fd.phone || "").replace(/\D/g, "").includes(appFilterPhone.replace(/\D/g, ""))) return false;
      if (appFilterStatus && app.status !== appFilterStatus) return false;
      if (appFilterExperience && (fd.experienceLevel || "") !== appFilterExperience) return false;
      if (appFilterEligibility === "eligible") {
        const e = fd.eligibility || {};
        if (!e.workRights || !e.bankAccount || !e.selfEmployed || !e.cleanRecord) return false;
      }
      if (appFilterEligibility === "any") {
        const e = fd.eligibility || {};
        if (!e.workRights && !e.bankAccount && !e.selfEmployed && !e.cleanRecord) return false;
      }
      if (appFilterDate && new Date(app.created_at).toISOString().slice(0, 10) !== appFilterDate) return false;
      return true;
    });
  }, [applications, appFilterName, appFilterPostcode, appFilterPhone, appFilterStatus, appFilterExperience, appFilterEligibility, appFilterDate]);

  const filteredReferrals = useMemo(() => {
    let list = referrals || [];
    const q = (refSearch || "").trim().toLowerCase();
    if (q) {
      list = list.filter((r) => {
        const referrer = getProfileById(r.referrer_id);
        const referred = getProfileById(r.referred_user_id);
        const app = getAppById(r.referred_application_id);
        const refName = (referrer?.full_name || "").toLowerCase();
        const refEmail = (referrer?.email || "").toLowerCase();
        const referredName = (referred?.full_name || "").toLowerCase() ||
          `${(app?.form_data?.firstName || "")} ${(app?.form_data?.surname || "")}`.trim().toLowerCase();
        const referredEmail = (referred?.email || app?.form_data?.email || "").toLowerCase();
        return refName.includes(q) || refEmail.includes(q) || referredName.includes(q) || referredEmail.includes(q);
      });
    }
    if (refFilterProgress) {
      list = list.filter((r) => {
        const appStatus = r.referred_application_status || getAppById(r.referred_application_id)?.status || "";
        if (refFilterProgress === "working") return appStatus === "approved";
        if (refFilterProgress === "waiting") return appStatus === "pending" || appStatus === "rejected" || !appStatus;
        return true;
      });
    }
    if (refFilterRewardStatus) {
      list = list.filter((r) => (r.status || "pending") === refFilterRewardStatus);
    }
    return list;
  }, [referrals, refSearch, refFilterProgress, refFilterRewardStatus, users, applications]);

  const applicationsByUser = useMemo(() => {
    const map = new Map();
    for (const app of filteredApplications) {
      const key = app.user_id || (app.form_data?.email || "").trim() || app.id;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(app);
    }
    return Array.from(map.entries()).map(([key, apps]) => ({
      key,
      apps: apps.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    })).sort((a, b) => new Date(b.apps[0].created_at) - new Date(a.apps[0].created_at));
  }, [filteredApplications]);

  if (authLoading || (!user || !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="animate-spin text-[#448cff]" size={40} />
      </div>
    );
  }

  const tabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "referrals", label: "Referrals", icon: Gift },
    { id: "locations", label: "Locations", icon: MapPin },
    { id: "settings", label: "Site Settings", icon: Settings },
  ];

  const loadLocations = async () => {
    setLocationsLoading(true);
    const { data } = await supabase.from("locations").select("id, name, postcodes, created_at").order("name");
    setLocations(data || []);
    setLocationsLoading(false);
  };

  const handleSetAsSiteLocation = async (loc) => {
    setSaving(true);
    setLocationFormError("");
    try {
      await updateSetting("location", loc.name);
      await updateSetting("location_full", `${loc.name}, United Kingdom`);
      await updateSetting("location_postcodes", loc.postcodes || "");
      refresh();
    } catch (e) {
      console.error(e);
      setLocationFormError(e.message || "Failed to set site location.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLocationRow = async () => {
    setLocationFormError("");
    const name = locationForm.name.trim();
    const postcodes = locationForm.postcodes.trim();
    if (!name) {
      setLocationFormError("Location name is required.");
      return;
    }
    setSaving(true);
    try {
      if (editingLocationId) {
        const { error } = await supabase.from("locations").update({ name, postcodes, updated_at: new Date().toISOString() }).eq("id", editingLocationId);
        if (error) throw error;
        setLocations((prev) => prev.map((l) => (l.id === editingLocationId ? { ...l, name, postcodes } : l)));
        setEditingLocationId(null);
      } else {
        const { error } = await supabase.from("locations").insert({ name, postcodes });
        if (error) throw error;
        await loadLocations();
      }
      setLocationForm({ name: "", postcodes: "" });
    } catch (e) {
      setLocationFormError(e.message || "Failed to save location.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLocation = async (id) => {
    if (!window.confirm("Delete this location? This cannot be undone.")) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("locations").delete().eq("id", id);
      if (error) throw error;
      setLocations((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const startEditLocation = (loc) => {
    setEditingLocationId(loc.id);
    setLocationForm({ name: loc.name, postcodes: loc.postcodes || "" });
    setLocationFormError("");
  };

  const cancelEditLocation = () => {
    setEditingLocationId(null);
    setLocationForm({ name: "", postcodes: "" });
    setLocationFormError("");
  };

  const logoSrc = logoUrl || "./websitelogo.png";

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-jakarta">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <Link to="/" className="shrink-0">
              <img src={logoSrc} alt="Shine & Span" className="h-8 sm:h-10 w-auto object-contain" />
            </Link>
            <h1 className="text-base sm:text-xl font-black text-slate-900 uppercase truncate">Admin</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="hidden sm:inline text-sm text-slate-500 truncate max-w-[140px] md:max-w-[200px]" title={profile?.email}>
              {profile?.email}
            </span>
            <button
              onClick={() => {
                signOut();
                navigate("/");
              }}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 border border-gray-300 rounded-sm text-slate-700 font-bold hover:bg-slate-50 text-sm"
            >
              <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
        <div className="border-t border-gray-100 overflow-x-auto overflow-y-hidden scroll-smooth">
          <div className="flex gap-0 sm:gap-2 px-2 sm:px-4 min-w-max max-w-7xl mx-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 sm:px-6 sm:py-4 text-sm font-bold border-b-2 shrink-0 transition-colors whitespace-nowrap ${tab === t.id ? "border-[#448cff] text-[#448cff]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
              >
                <t.icon size={18} className="shrink-0" /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 overflow-x-hidden">
        {loading && tab !== "settings" ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#448cff]" size={32} />
          </div>
        ) : (
          <>
            {tab === "users" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 flex flex-wrap items-end gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0 w-full sm:min-w-[200px] sm:w-auto">
                    <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Search by email or name</label>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#448cff]/30 focus:border-[#448cff]"
                    />
                  </div>
                  <div className="w-full sm:w-44">
                    <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Show</label>
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#448cff]/30 focus:border-[#448cff] bg-white"
                    >
                      <option value="all">All roles</option>
                      <option value="admins">Admins only</option>
                      <option value="workers">Workers only</option>
                      <option value="users">Users only</option>
                    </select>
                  </div>
                  <div className="w-full sm:w-48">
                    <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Sort by</label>
                    <select
                      value={userSort}
                      onChange={(e) => setUserSort(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#448cff]/30 focus:border-[#448cff] bg-white"
                    >
                      <option value="role">Role (main admin → user)</option>
                      <option value="date">Date joined (newest)</option>
                      <option value="name_asc">Name (A–Z)</option>
                      <option value="name_desc">Name (Z–A)</option>
                    </select>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                  {(() => {
                    const currentProfile = users.find((u) => u.id === user?.id);
                    const isMainAdmin = currentProfile?.is_main_admin === true;
                    const roleBadge = (u) => {
                      if (u.is_main_admin) return <span className="px-2 py-1 text-xs font-bold rounded bg-indigo-100 text-indigo-800">Main admin</span>;
                      if (u.role === "admin") return <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800">Admin</span>;
                      if (isWorker(u)) return <span className="px-2 py-1 text-xs font-bold rounded bg-amber-100 text-amber-800">Worker</span>;
                      return <span className="px-2 py-1 text-xs font-bold rounded bg-slate-100 text-slate-600">User</span>;
                    };
                    const canBeMadeAdmin = (u) => u.role === "user" && !userIdsWithApplications.has(u.id);
                    return (
                      <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-slate-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500">Email</th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500">Name</th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500">Role</th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500">Referral Code</th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500">Joined</th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAndSortedUsers.map((u) => (
                            <tr key={u.id} className="border-b border-gray-100 hover:bg-slate-50/50">
                              <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-slate-800 text-sm">{u.email}</td>
                              <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-600 text-sm">{u.full_name || "—"}</td>
                              <td className="px-4 sm:px-6 py-3 sm:py-4">{roleBadge(u)}</td>
                              <td className="px-4 sm:px-6 py-3 sm:py-4 font-mono text-xs sm:text-sm">{u.referral_code || "—"}</td>
                              <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-500 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                              <td className="px-4 sm:px-6 py-3 sm:py-4">
                                {canBeMadeAdmin(u) && isMainAdmin && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateUserRole(u.id, "admin")}
                                    className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#448cff] text-white hover:bg-blue-600 transition-colors"
                                  >
                                    Make admin
                                  </button>
                                )}
                                {canBeMadeAdmin(u) && !isMainAdmin && (
                                  <span className="text-slate-400 text-xs font-medium">—</span>
                                )}
                                {isWorker(u) && (
                                  <span className="text-slate-400 text-xs font-medium">—</span>
                                )}
                                {u.role === "admin" && u.is_main_admin && (
                                  <span className="text-slate-400 text-xs font-medium">—</span>
                                )}
                                {u.role === "admin" && !u.is_main_admin && isMainAdmin && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateUserRole(u.id, "user")}
                                    className="px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                                  >
                                    Make user
                                  </button>
                                )}
                                {u.role === "admin" && !u.is_main_admin && !isMainAdmin && (
                                  <span className="text-slate-400 text-xs font-medium">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()}
                  </div>
                  {users.length === 0 && <p className="p-8 text-center text-slate-500">No users yet.</p>}
                  {users.length > 0 && filteredAndSortedUsers.length === 0 && (
                    <p className="p-8 text-center text-slate-500">No users match your search or filter.</p>
                  )}
                </div>
              </div>
            )}

            {tab === "applications" && (
              <div className="space-y-6">
                <h2 className="text-lg font-black text-slate-900">Job applications</h2>

                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Name</label>
                      <input
                        type="text"
                        placeholder="Search by name..."
                        value={appFilterName}
                        onChange={(e) => setAppFilterName(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#448cff]/30 focus:border-[#448cff]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Postcode</label>
                      <input
                        type="text"
                        placeholder="UK postcode"
                        value={appFilterPostcode}
                        onChange={(e) => setAppFilterPostcode(e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, 8))}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#448cff]/30 focus:border-[#448cff]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Phone</label>
                      <input
                        type="text"
                        placeholder="Phone number"
                        value={appFilterPhone}
                        onChange={(e) => setAppFilterPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#448cff]/30 focus:border-[#448cff]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Status</label>
                      <select
                        value={appFilterStatus}
                        onChange={(e) => setAppFilterStatus(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#448cff]/30 focus:border-[#448cff] bg-white"
                      >
                        <option value="">All</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Experience</label>
                      <select
                        value={appFilterExperience}
                        onChange={(e) => setAppFilterExperience(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#448cff]/30 focus:border-[#448cff] bg-white"
                      >
                        <option value="">All</option>
                        <option value="Less than 6 months">Less than 6 months</option>
                        <option value="More than 6 months">More than 6 months</option>
                        <option value="More than 2 years">More than 2 years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Eligibility</label>
                      <select
                        value={appFilterEligibility}
                        onChange={(e) => setAppFilterEligibility(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#448cff]/30 focus:border-[#448cff] bg-white"
                      >
                        <option value="">All</option>
                        <option value="eligible">All eligible (all boxes ticked)</option>
                        <option value="any">Any eligibility</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Date</label>
                      <input
                        type="date"
                        value={appFilterDate}
                        onChange={(e) => setAppFilterDate(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#448cff]/30 focus:border-[#448cff]"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAppFilterName("");
                          setAppFilterPostcode("");
                          setAppFilterPhone("");
                          setAppFilterStatus("");
                          setAppFilterExperience("");
                          setAppFilterEligibility("");
                          setAppFilterDate("");
                        }}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 flex-1"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2.5 bg-[#448cff] text-white rounded-lg text-sm font-bold hover:bg-blue-600 flex items-center justify-center gap-2 flex-1"
                      >
                        <Search size={18} /> Filter
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => setExpandUserKey(applicationsByUser.length ? applicationsByUser[0].key : null)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Expand first
                  </button>
                  <button
                    type="button"
                    onClick={() => { setExpandUserKey(null); setExpandApp(null); }}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Collapse all
                  </button>
                </div>

                <div className="space-y-4">
                  {applicationsByUser.map(({ key, apps }) => {
                    const first = apps[0];
                    const fd = first.form_data || {};
                    const name = [fd.firstName, fd.middleName, fd.surname].filter(Boolean).join(" ") || "No name";
                    const isOpen = expandUserKey === key;
                    const approvedCount = apps.filter((a) => a.status === "approved").length;
                    const pendingCount = apps.filter((a) => a.status === "pending").length;
                    const rejectedCount = apps.filter((a) => a.status === "rejected").length;
                    const summary = [approvedCount && `${approvedCount} Approved`, pendingCount && `${pendingCount} Pending`, rejectedCount && `${rejectedCount} Rejected`].filter(Boolean).join(" · ");
                    return (
                      <div
                        key={key}
                        className={`bg-white border-2 rounded-xl overflow-hidden shadow-sm transition-all ${isOpen ? "border-[#448cff]/50 ring-2 ring-[#448cff]/10" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <button
                          type="button"
                          onClick={() => setExpandUserKey(isOpen ? null : key)}
                          className="w-full px-4 sm:px-6 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-3 sm:gap-4 text-left hover:bg-slate-50/80 transition-colors"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-[#448cff]/10 flex items-center justify-center shrink-0">
                              <FileText className="text-[#448cff]" size={24} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-lg font-black text-slate-900 truncate">{name}</p>
                              <p className="text-slate-500 text-sm font-medium truncate mt-0.5">{fd.email}</p>
                              <p className="text-xs font-bold text-slate-400 mt-1.5 uppercase tracking-wider">
                                {apps.length} application{apps.length !== 1 ? "s" : ""} — {summary}
                              </p>
                            </div>
                            {fd.experienceLevel && (
                              <span className="hidden sm:inline px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold shrink-0">
                                {fd.experienceLevel}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-slate-400 text-sm font-medium">
                              Latest: {new Date(first.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                            {isOpen ? <ChevronUp className="text-slate-400" size={22} /> : <ChevronDown className="text-slate-400" size={22} />}
                          </div>
                        </button>
                        {isOpen && (
                          <div className="border-t border-gray-200 bg-slate-50/50">
                            {(() => {
                              const showAll = seeMoreAppsKeys[key];
                              const visibleApps = apps.length > 1 && !showAll ? apps.slice(0, 1) : apps;
                              const hasMore = apps.length > 1 && !showAll;
                              const hiddenCount = apps.length - 1;
                              const latestApp = visibleApps[0];
                              const previousApps = visibleApps.slice(1);
                              const renderAppRow = (app, isLatest) => {
                                const statusLabel = app.status === "approved" ? "Approved" : app.status === "rejected" ? "Rejected" : "Pending";
                                const statusClass = isLatest
                                  ? (app.status === "approved" ? "bg-emerald-50 text-emerald-700" : app.status === "rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800")
                                  : "bg-slate-300 text-slate-500";
                                return (
                                  <div key={app.id} className={`flex flex-wrap items-center justify-between gap-4 mb-4 ${!isLatest ? "opacity-80" : ""}`}>
                                    <div className="flex flex-wrap items-center gap-3">
                                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${statusClass}`}>
                                        {statusLabel}
                                      </span>
                                      {!isLatest && (
                                        <span className="text-xs text-slate-500">Older · view only</span>
                                      )}
                                      <span className={isLatest ? "text-slate-500 text-sm" : "text-slate-500 text-xs"}>
                                        {new Date(app.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                      </span>
                                    </div>
                                    {isLatest ? (
                                      <div className="flex flex-wrap gap-2">
                                        <button
                                          type="button"
                                          disabled={app.status === "approved"}
                                          onClick={() => app.status !== "approved" && handleUpdateApplicationStatus(app.id, "approved")}
                                          className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors ${
                                            app.status === "approved"
                                              ? "bg-emerald-200 text-emerald-700 cursor-not-allowed opacity-80"
                                              : "bg-emerald-600 text-white hover:bg-emerald-700"
                                          }`}
                                        >
                                          Approve
                                        </button>
                                        <button
                                          type="button"
                                          disabled={app.status === "rejected"}
                                          onClick={() => app.status !== "rejected" && handleUpdateApplicationStatus(app.id, "rejected")}
                                          className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors ${
                                            app.status === "rejected"
                                              ? "bg-red-200 text-red-700 cursor-not-allowed opacity-80"
                                              : "bg-red-600 text-white hover:bg-red-700"
                                          }`}
                                        >
                                          Reject
                                        </button>
                                        {(app.status === "approved" || app.status === "rejected") && (
                                          <button
                                            type="button"
                                            disabled={app.status === "pending"}
                                            onClick={() => app.status !== "pending" && handleUpdateApplicationStatus(app.id, "pending")}
                                            className={`px-3.5 py-2 rounded-md text-xs font-semibold border transition-colors ${
                                              app.status === "pending"
                                                ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                                                : "border-slate-300 text-slate-600 hover:bg-slate-50"
                                            }`}
                                          >
                                            Set to Pending
                                          </button>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-slate-500 text-xs">Superseded by current application</span>
                                    )}
                                  </div>
                                );
                              };
                              return (
                                <>
                                  {/* Current application — bluish */}
                                  <div className="mx-2 sm:mx-4 mt-4 rounded-lg border border-blue-200 bg-blue-50/40 overflow-hidden">
                                    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-blue-200/80 bg-blue-100/70">
                                      <span className="h-1.5 w-1.5 rounded-full bg-[#448cff] shrink-0" aria-hidden />
                                      <span className="text-xs font-semibold text-blue-800 tracking-wide">Current application</span>
                                    </div>
                                    <div className="px-5 pb-5 bg-white/50">
                                      {latestApp && (
                                        <>
                                          {renderAppRow(latestApp, true)}
                                          <ApplicationDetail app={latestApp} referrerProfile={getProfileById(latestApp.referrer_id)} variant="current" />
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Previous applications — greyish, disabled look */}
                                  {previousApps.length > 0 && (
                                    <div className="mt-5 mx-2 sm:mx-4">
                                      <p className="text-xs font-medium text-slate-500 mb-3">Previous applications</p>
                                      <div className="space-y-4">
                                        {previousApps.map((app) => (
                                          <div key={app.id} className="rounded-lg border border-slate-300 bg-slate-200/60 py-4 px-5 shadow-inner">
                                            {renderAppRow(app, false)}
                                            <ApplicationDetail app={app} referrerProfile={getProfileById(app.referrer_id)} variant="previous" />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {hasMore && (
                                    <div className="mx-2 sm:mx-4 mt-4 px-0">
                                      <button
                                        type="button"
                                        onClick={() => setSeeMoreAppsKeys((prev) => ({ ...prev, [key]: true }))}
                                        className="text-sm font-medium text-[#448cff] hover:text-blue-700 transition-colors"
                                      >
                                        See {hiddenCount} previous application{hiddenCount !== 1 ? "s" : ""}
                                      </button>
                                    </div>
                                  )}
                                  {apps.length > 1 && showAll && (
                                    <div className="mx-2 sm:mx-4 mt-2 px-0">
                                      <button
                                        type="button"
                                        onClick={() => setSeeMoreAppsKeys((prev) => ({ ...prev, [key]: false }))}
                                        className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                                      >
                                        See less
                                      </button>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {applications.length === 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-500 font-medium">No applications yet.</p>
                  </div>
                )}
                {applications.length > 0 && filteredApplications.length === 0 && (
                  <p className="text-slate-500 text-center py-6">No applications match your filters.</p>
                )}
              </div>
            )}

            {tab === "referrals" && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 sm:px-6 py-3 bg-slate-50 border-b border-gray-200">
                  <p className="text-xs text-slate-600 mb-3">
                    <strong>Application</strong> = from their application (read-only): Waiting for approval or Working. <strong>Status</strong> = reward lifecycle (you set): Pending → Eligible → Claimed. <strong>Days worked</strong> / <strong>Eligible to claim</strong> / <strong>Claimed</strong> = for the £25 bonus.
                  </p>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                    <input
                      type="text"
                      placeholder="Search by referrer or referred name / email..."
                      value={refSearch}
                      onChange={(e) => setRefSearch(e.target.value)}
                      className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <select
                      value={refFilterProgress}
                      onChange={(e) => setRefFilterProgress(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[160px]"
                    >
                      <option value="">All (application)</option>
                      <option value="working">Working</option>
                      <option value="waiting">Waiting for approval</option>
                    </select>
                    <select
                      value={refFilterRewardStatus}
                      onChange={(e) => setRefFilterRewardStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[120px]"
                    >
                      <option value="">All (reward status)</option>
                      <option value="eligible">Eligible</option>
                      <option value="claimed">Claimed</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-slate-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500">Referrer (name & email)</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500">Referred (name & email)</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500">Application</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500">Days worked</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500">Eligible to claim</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500">Status</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500">Claimed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReferrals.map((r) => {
                      const referrer = getProfileById(r.referrer_id);
                      const referredProfile = getProfileById(r.referred_user_id);
                      const app = getAppById(r.referred_application_id);
                      const referredName = referredProfile?.full_name?.trim() ||
                        (app ? `${(app.form_data?.firstName || "")} ${(app.form_data?.surname || "")}`.trim() : "") || "—";
                      const referredEmail = referredProfile?.email || app?.form_data?.email || "—";
                      const appStatus = r.referred_application_status || app?.status || "";
                      const applicationLabel = appStatus === "approved" ? "Working" : appStatus === "rejected" ? "Rejected" : "Waiting for approval";
                      return (
                        <tr key={r.id} className="border-b border-gray-100 hover:bg-slate-50/50">
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-800 text-sm">
                            <div className="font-medium">{referrer?.full_name || "—"}</div>
                            <div className="text-slate-500 text-xs">{referrer?.email || "—"}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-800 text-sm">
                            <div className="font-medium">{referredName}</div>
                            <div className="text-slate-500 text-xs">{referredEmail}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              appStatus === "approved" ? "bg-green-100 text-green-800" :
                              appStatus === "rejected" ? "bg-red-100 text-red-800" :
                              "bg-amber-100 text-amber-800"
                            }`}>
                              {applicationLabel}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <input
                              type="number"
                              min="0"
                              value={r.days_worked}
                              onChange={(e) => handleUpdateReferral(r.id, "days_worked", parseInt(e.target.value, 10) || 0)}
                              className="w-16 sm:w-20 p-2 border border-gray-300 rounded text-sm"
                            />
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-600">
                            <input
                              type="date"
                              value={r.reward_eligible_at || ""}
                              onChange={(e) => handleUpdateReferral(r.id, "reward_eligible_at", e.target.value || null)}
                              className="p-2 border border-gray-300 rounded text-sm min-w-0"
                            />
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <select
                              value={r.status === "claimed" ? "claimed" : "eligible"}
                              onChange={(e) => handleUpdateReferral(r.id, "status", e.target.value)}
                              className="p-2 border border-gray-300 rounded text-sm min-w-0"
                            >
                              <option value="eligible">Eligible</option>
                              <option value="claimed">Claimed</option>
                            </select>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            {r.reward_claimed_at ? (
                              <span className="text-green-600 text-sm">{new Date(r.reward_claimed_at).toLocaleDateString()}</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleUpdateReferral(r.id, "reward_claimed_at", new Date().toISOString())}
                                className="text-[#448cff] font-bold text-sm hover:underline"
                              >
                                Mark claimed
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
                {referrals.length === 0 && <p className="p-8 text-center text-slate-500">No referrals yet.</p>}
                {referrals.length > 0 && filteredReferrals.length === 0 && (
                  <p className="p-8 text-center text-slate-500">No referrals match your search or filters.</p>
                )}
              </div>
            )}

            {tab === "locations" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <MapPin size={22} className="text-[#448cff] shrink-0" /> Locations & postcodes
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">
                    Set one location as the site location to update it everywhere on the website.
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-slate-700 mb-3 sm:mb-4 break-words">
                    Current site location: <strong>{location}</strong>
                    {locationPostcodes ? ` (${locationPostcodes})` : ""}
                  </p>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Location name"
                      value={locationForm.name}
                      onChange={(e) => setLocationForm((p) => ({ ...p, name: e.target.value }))}
                      className="flex-1 min-w-0 w-full sm:min-w-[180px] px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Postcodes (e.g. SW19, SW20)"
                      value={locationForm.postcodes}
                      onChange={(e) => setLocationForm((p) => ({ ...p, postcodes: e.target.value }))}
                      className="flex-1 min-w-0 w-full sm:min-w-[200px] px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
                    />
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={handleSaveLocationRow}
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#448cff] text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-600 disabled:opacity-70"
                      >
                        {editingLocationId ? <Pencil size={16} /> : <Plus size={16} />}
                        {editingLocationId ? "Update" : "Add"}
                      </button>
                      {editingLocationId && (
                        <button type="button" onClick={cancelEditLocation} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                  {locationFormError && <p className="text-sm text-red-600 mb-2">{locationFormError}</p>}
                </div>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {locationsLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#448cff]" size={28} /></div>
                  ) : (
                    <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[500px]">
                      <thead className="bg-slate-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500">Location</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500">Postcodes</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500">Status</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black uppercase text-slate-500 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {locations.map((loc) => {
                          const isActive = location === loc.name && (locationPostcodes || "") === (loc.postcodes || "");
                          return (
                            <tr key={loc.id} className={`border-b border-gray-100 hover:bg-slate-50/50 ${editingLocationId === loc.id ? "bg-blue-50/50" : ""}`}>
                              <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-slate-800 text-sm">{loc.name}</td>
                              <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-600 text-xs sm:text-sm">{loc.postcodes || "—"}</td>
                              <td className="px-4 sm:px-6 py-3 sm:py-4">
                                {isActive ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wide">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-xs">—</span>
                                )}
                              </td>
                              <td className="px-4 sm:px-6 py-3 sm:py-4">
                                <div className="flex flex-wrap items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleSetAsSiteLocation(loc)}
                                    disabled={saving || isActive}
                                    title={isActive ? "This is the current site location" : "Use this location across the website"}
                                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                                      isActive
                                        ? "bg-slate-100 text-slate-400 cursor-default"
                                        : "bg-[#448cff] text-white hover:bg-blue-600 shadow-sm hover:shadow"
                                    } disabled:opacity-70`}
                                  >
                                    {isActive ? "Active" : "Set as site location"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => startEditLocation(loc)}
                                    disabled={saving}
                                    title="Edit location"
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-gray-400 transition-all disabled:opacity-70"
                                  >
                                    <Pencil size={14} /> Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLocation(loc.id)}
                                    disabled={saving}
                                    title="Delete location"
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-70"
                                  >
                                    <Trash2 size={14} /> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    </div>
                  )}
                  {!locationsLoading && locations.length === 0 && <p className="p-8 text-center text-slate-500">No locations yet. Add one above.</p>}
                </div>
              </div>
            )}

            {tab === "settings" && (
              <div className="max-w-2xl">
                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                  <h2 className="text-lg font-black text-slate-900 mb-2">Website logo</h2>
                  <p className="text-sm text-slate-500 mb-4">
                    Upload a logo to show on the main site navbar, footer, signup page, and admin header. Any image format (PNG, JPG, SVG, etc.) is supported.
                  </p>
                  {logoUrl && (
                    <div className="mb-4">
                      <img src={logoUrl} alt="Current logo" className="h-16 w-auto object-contain border border-gray-200 rounded" />
                    </div>
                  )}
                  <label className="inline-flex items-center gap-2 bg-slate-100 border border-gray-300 rounded-sm px-4 py-3 cursor-pointer hover:bg-slate-200 transition-colors">
                    <Upload size={18} /> Upload new logo
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                  <p className="mt-2 text-xs text-slate-500">Create a public storage bucket named &quot;logos&quot; in Supabase if upload fails.</p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
