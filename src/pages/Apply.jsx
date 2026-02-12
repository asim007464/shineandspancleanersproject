import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Check,
  Clock,
  ShieldCheck,
  User,
  Mail,
  MapPin,
  Sparkles,
  Briefcase,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import Navbar from "../Components/Homecomponents/Navbar";
import Footer from "../Components/Homecomponents/Footer";
import { supabase } from "../lib/supabase";
import { useSiteSettings } from "../contexts/SiteSettingsContext";
import { useAuth } from "../contexts/AuthContext";
import { rateLimit, sanitizeFormData } from "../lib/security";

const APPLY_REFERRAL_STORAGE_KEY = "apply_referral_ref";

const Apply = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const refFromUrl = searchParams.get("ref") || "";
  const refFromStorage =
    typeof sessionStorage !== "undefined" ? sessionStorage.getItem(APPLY_REFERRAL_STORAGE_KEY) : null;
  const refCode = refFromUrl || refFromStorage || "";
  const { user, loading: authLoading, isAdmin, refreshApplicationStatus } = useAuth();
  const { location, locationPostcodes, country, postcodeLabel, postcodePlaceholder, phonePlaceholder, phoneHelper, addressPlaceholder } = useSiteSettings();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [activeSection, setActiveSection] = useState("section-1");
  const [myApplication, setMyApplication] = useState(null);
  const [loadingMyApp, setLoadingMyApp] = useState(true);
  const [requestUpdate, setRequestUpdate] = useState(false);
  // --- FORM STATE (Fixed: Added otherExperienceTypes) ---
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    surname: "",
    gender: "",
    phone: "",
    email: "",
    postcode: "",
    address: "",
    referralCode: "",
    experienceLevel: "",
    experienceTypes: [],
    otherExperienceTypes: [], // Added this array for the checkboxes
    availability: {
      Monday: {
        enabled: false,
        s1_start: "",
        s1_end: "",
        s2_start: "",
        s2_end: "",
        s3_start: "",
        s3_end: "",
      },
      Tuesday: {
        enabled: false,
        s1_start: "",
        s1_end: "",
        s2_start: "",
        s2_end: "",
        s3_start: "",
        s3_end: "",
      },
      Wednesday: {
        enabled: false,
        s1_start: "",
        s1_end: "",
        s2_start: "",
        s2_end: "",
        s3_start: "",
        s3_end: "",
      },
      Thursday: {
        enabled: false,
        s1_start: "",
        s1_end: "",
        s2_start: "",
        s2_end: "",
        s3_start: "",
        s3_end: "",
      },
      Friday: {
        enabled: false,
        s1_start: "",
        s1_end: "",
        s2_start: "",
        s2_end: "",
        s3_start: "",
        s3_end: "",
      },
      Saturday: {
        enabled: false,
        s1_start: "",
        s1_end: "",
        s2_start: "",
        s2_end: "",
        s3_start: "",
        s3_end: "",
      },
      Sunday: {
        enabled: false,
        s1_start: "",
        s1_end: "",
        s2_start: "",
        s2_end: "",
        s3_start: "",
        s3_end: "",
      },
    },
    eligibility: {
      workRights: false,
      bankAccount: false,
      selfEmployed: false,
      cleanRecord: false,
    },
  });

  // Persist ref in sessionStorage when in URL; restore from sessionStorage when redirect dropped it (e.g. after signup → login → apply)
  useEffect(() => {
    if (refFromUrl.trim()) {
      try {
        sessionStorage.setItem(APPLY_REFERRAL_STORAGE_KEY, refFromUrl.trim());
      } catch {
        // ignore storage errors
      }
      return;
    }
    if (refFromStorage?.trim()) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("ref", refFromStorage.trim());
          return next;
        },
        { replace: true }
      );
    }
  }, [refFromUrl, refFromStorage, setSearchParams]);

  // Require login; admins cannot use Apply (they're not applicants)
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      let returnPath = `/apply${window.location.search || ""}`;
      if (!refFromUrl && refFromStorage?.trim())
        returnPath = `/apply?ref=${encodeURIComponent(refFromStorage.trim())}`;
      navigate(`/login?redirect=${encodeURIComponent(returnPath)}`, {
        replace: true,
        state: { requireLogin: true, from: "apply" },
      });
      return;
    }
    if (isAdmin) {
      navigate("/", { replace: true });
      return;
    }
  }, [user, authLoading, isAdmin, navigate, refFromUrl, refFromStorage]);

  // Fetch current user's latest application (direct by user_id so new accounts never see someone else's)
  useEffect(() => {
    if (!user?.id) {
      queueMicrotask(() => setLoadingMyApp(false));
      setMyApplication(null);
      return;
    }
    let cancelled = false;
    queueMicrotask(() => setLoadingMyApp(true));
    (async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled) {
        if (error) {
          setMyApplication(null);
          setLoadingMyApp(false);
          return;
        }
        setMyApplication(data ?? null);
        refreshApplicationStatus();
        setLoadingMyApp(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, refreshApplicationStatus]);

  // Keep form email in sync with login email (application must use own account email)
  useEffect(() => {
    if (!user?.email) return;
    if (myApplication?.status === "approved" && requestUpdate) return;
    setFormData((prev) => ({ ...prev, email: user.email }));
  }, [user?.email, myApplication?.status, requestUpdate]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSubmitted) {
      const sectionIds = ["section-1", "section-2", "section-3", "section-4", "section-5"];
      const triggerOffset = 200;

      const onScroll = () => {
        const sections = sectionIds
          .map((id) => document.getElementById(id))
          .filter(Boolean);
        let current = sectionIds[0];
        for (const el of sections) {
          const top = el.getBoundingClientRect().top;
          if (top <= triggerOffset) current = el.id;
        }
        setActiveSection(current);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [isSubmitted]);

  const timeOptions = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePhone = (value) => {
    const digitsOnly = value.replace(/\D/g, "");
    const maxLen = country === "uk" ? 11 : 10;
    const limited = digitsOnly.slice(0, maxLen);
    setFormData((prev) => ({ ...prev, phone: limited }));
  };

  const updatePostcode = (value) => {
    if (country === "us") {
      const cleaned = value.replace(/[^0-9-]/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, postcode: cleaned }));
    } else if (country === "canada") {
      const cleaned = value.toUpperCase().replace(/[^A-Z0-9 ]/g, "").replace(/\s+/g, " ").slice(0, 7);
      setFormData((prev) => ({ ...prev, postcode: cleaned }));
    } else {
      const cleaned = value.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, 8);
      setFormData((prev) => ({ ...prev, postcode: cleaned }));
    }
  };

  // Effective referral code: optional form input or URL ref; uppercase for DB lookup
  const getEffectiveReferralCode = () => {
    const fromForm = formData.referralCode && formData.referralCode.trim();
    const fromRef = refCode && refCode.trim();
    const raw = fromForm || fromRef || "";
    return raw ? raw.trim().toUpperCase() : "";
  };

  const validateForm = () => {
    const errors = [];
    if (!availabilityOnlyUpdate) {
      const phoneDigits = formData.phone.replace(/\D/g, "");
      if (country === "uk") {
        if (phoneDigits.length < 10 || phoneDigits.length > 11) {
          errors.push("Please enter a valid UK phone number (10–11 digits).");
        }
      } else {
        if (phoneDigits.length !== 10) {
          errors.push(country === "us" ? "Please enter a valid US phone number (10 digits)." : "Please enter a valid Canadian phone number (10 digits).");
        }
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        errors.push("Email is required.");
      } else if (!emailRegex.test(formData.email.trim())) {
        errors.push("Please enter a valid email address.");
      }
      const pc = formData.postcode.trim().replace(/\s+/g, " ");
      if (!formData.postcode.trim()) {
        errors.push(`${postcodeLabel} is required.`);
      } else if (country === "uk") {
        const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
        if (!ukPostcodeRegex.test(pc)) {
          errors.push("Please enter a valid UK postcode (e.g. SW1A 1AA).");
        }
      } else if (country === "us") {
        const usZipRegex = /^\d{5}(-\d{4})?$/;
        if (!usZipRegex.test(formData.postcode.trim())) {
          errors.push("Please enter a valid US ZIP code (e.g. 12345 or 12345-6789).");
        }
      } else if (country === "canada") {
        const canadaPostalRegex = /^[A-Z]\d[A-Z]\d[A-Z]\d$/i;
        if (!canadaPostalRegex.test(pc.replace(/\s/g, ""))) {
          errors.push("Please enter a valid Canadian postal code (e.g. K1A 0B1).");
        }
      }
      if (!formData.address.trim()) {
        errors.push("Address is required.");
      } else if (formData.address.trim().length < 10) {
        errors.push("Please enter a full address (at least 10 characters).");
      }
    }
    const days = Object.keys(formData.availability);
    for (const day of days) {
      if (!formData.availability[day].enabled) continue;
      const a = formData.availability[day];
      const hasMorning = a.s1_start && a.s1_end;
      const hasAfternoon = a.s2_start && a.s2_end;
      const hasEvening = a.s3_start && a.s3_end;
      if (!hasMorning && !hasAfternoon && !hasEvening) {
        errors.push(`${day}: choose at least one slot (Morning, Afternoon or Evening) and set both Start and End times.`);
      }
      if (hasMorning && a.s1_end <= a.s1_start) {
        errors.push(`${day} Morning: End time must be after Start time.`);
      }
      if (hasAfternoon && a.s2_end <= a.s2_start) {
        errors.push(`${day} Afternoon: End time must be after Start time.`);
      }
      if (hasEvening && a.s3_end <= a.s3_start) {
        errors.push(`${day} Evening: End time must be after Start time.`);
      }
    }
    return errors;
  };

  const toggleExpType = (type) => {
    const current = formData.experienceTypes;
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    updateField("experienceTypes", updated);
  };

  // --- Fixed: toggleOtherType logic ---
  const toggleOtherType = (type) => {
    const current = formData.otherExperienceTypes;
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    updateField("otherExperienceTypes", updated);
  };

  const updateAvailability = (day, field, value) => {
    setFormData((prev) => {
      const next = { ...prev.availability[day], [field]: value };
      if (field === "s1_start" || field === "s2_start" || field === "s3_start") {
        const endKey = field.replace("_start", "_end");
        if (next[endKey] && value && next[endKey] <= value) next[endKey] = "";
      }
      return {
        ...prev,
        availability: { ...prev.availability, [day]: next },
      };
    });
  };

  const updateEligibility = (field) => {
    setFormData((prev) => ({
      ...prev,
      eligibility: { ...prev.eligibility, [field]: !prev.eligibility[field] },
    }));
  };

  const availabilityOnlyUpdate =
    myApplication?.status === "approved" && requestUpdate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Rate limit: max 3 submissions per minute
    const rl = rateLimit("apply-submit", 3, 60000);
    if (!rl.allowed) {
      const secs = Math.ceil(rl.retryAfterMs / 1000);
      setSubmitError(`Too many attempts. Please wait ${secs} seconds before trying again.`);
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      return;
    }

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setSubmitError(validationErrors.join(" "));
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      return;
    }
    setSubmitLoading(true);
    if (!availabilityOnlyUpdate) {
      const { data: taken } = await supabase.rpc("check_application_email_phone_taken", {
        check_email: formData.email.trim(),
        check_phone: formData.phone,
      });
      if (taken) {
        setSubmitLoading(false);
        setSubmitError(
          "This email or phone number is already used on another account's application. Please use the email and phone for the account you're logged in with."
        );
        requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
        return;
      }
    }
    let referrerId = null;
    // One referral per person: if this user already has any application with a referrer, keep that referrer (ignore new ref)
    if (availabilityOnlyUpdate && myApplication?.referrer_id) {
      referrerId = myApplication.referrer_id;
    } else {
      const { data: prevWithRef } = await supabase
        .from("applications")
        .select("referrer_id")
        .eq("user_id", user.id)
        .not("referrer_id", "is", null)
        .limit(1)
        .maybeSingle();
      if (prevWithRef?.referrer_id) {
        referrerId = prevWithRef.referrer_id;
      } else {
        const codeToUse = getEffectiveReferralCode();
        if (codeToUse && !availabilityOnlyUpdate) {
          const { data: referrer } = await supabase.rpc("get_referrer_by_referral_code", {
            p_code: codeToUse,
          }).maybeSingle();
          if (referrer?.id) referrerId = referrer.id;
        }
      }
    }
    // Sanitise all free-text fields before storing
    const sanitisedForm = sanitizeFormData(formData);

    // Approved cleaner can only update availability; keep rest from existing application
    const payloadFormData = availabilityOnlyUpdate
      ? { ...myApplication.form_data, availability: sanitisedForm.availability }
      : { ...sanitisedForm, email: user.email };
    const { data: inserted, error } = await supabase
      .from("applications")
      .insert({
        form_data: payloadFormData,
        referrer_id: availabilityOnlyUpdate
          ? (myApplication?.referrer_id ?? null)
          : referrerId,
        user_id: user.id,
        status: "pending",
      })
      .select("id, status, created_at")
      .single();
    setSubmitLoading(false);
    if (error) {
      setSubmitError(error.message || "Failed to submit. Please try again.");
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      return;
    }
    if (inserted?.id && referrerId && !availabilityOnlyUpdate) {
      await supabase.rpc("ensure_referral_for_application", { p_application_id: inserted.id });
    }
    setMyApplication(inserted ? { ...inserted, form_data: formData } : null);
    setIsSubmitted(true);
    if (requestUpdate) setRequestUpdate(false);
    window.scrollTo(0, 0);
  };

  const appStatus = myApplication?.status || "pending";
  const showForm =
    !myApplication ||
    (appStatus === "approved" && requestUpdate) ||
    (appStatus === "rejected" && requestUpdate);
  const showPending = !!myApplication && appStatus === "pending" && !isSubmitted;
  const showApproved = !!myApplication && appStatus === "approved" && !requestUpdate;
  const showRejected = !!myApplication && appStatus === "rejected" && !requestUpdate;

  const handleRequestUpdate = () => {
    const fd = myApplication?.form_data || {};
    setFormData((prev) => ({
      ...prev,
      ...fd,
      availability: { ...prev.availability, ...(fd.availability || {}) },
      eligibility: { ...prev.eligibility, ...(fd.eligibility || {}) },
    }));
    setRequestUpdate(true);
  };

  if (authLoading || !user || isAdmin || loadingMyApp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#448cff]" size={40} />
      </div>
    );
  }

  return (
    <div className="font-jakarta bg-[#fcfdfe]">
      <Navbar />

      <section className="relative py-20 bg-white border-b border-gray-100 font-jakarta text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <span className="inline-block px-5 py-2 rounded-full border border-blue-500/20 bg-blue-50 text-[#448cff] text-[11px] font-black uppercase tracking-[0.3em]">
              {isSubmitted
                ? "Application Complete"
                : showApproved
                  ? "Approved"
                  : showPending
                    ? "Under Review"
                    : showRejected
                      ? "Not Approved"
                      : availabilityOnlyUpdate
                        ? "Update availability"
                        : "Recruitment Portal"}
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-[#1e293b] uppercase tracking-tight leading-tight">
            {isSubmitted ? (
              <>
                Thank <span className="text-[#448cff]">You!</span>
              </>
            ) : showApproved ? (
              <>
                You are <span className="text-[#448cff]">approved</span>
              </>
            ) : showPending ? (
              <>
                Application <span className="text-[#448cff]">under review</span>
              </>
            ) : showRejected ? (
              <>
                Application <span className="text-red-600">not approved</span>
              </>
            ) : availabilityOnlyUpdate ? (
              <>
                Update your <span className="text-[#448cff]">availability</span>
              </>
            ) : (
              <>
                Job <span className="text-[#448cff]">application</span>
              </>
            )}
          </h1>
          {availabilityOnlyUpdate && (
            <p className="mt-6 text-slate-500 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
              Change the days and times you can work. Submit to send for review.
            </p>
          )}
          {(showForm || !myApplication) &&
            !isSubmitted &&
            !showRejected &&
            !availabilityOnlyUpdate && (
              <p className="mt-8 text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed opacity-90">
                Join {location}{locationPostcodes ? ` (${locationPostcodes})` : ""}'s most progressive cleaning team. We value
                excellence, reliability, and hard work.
              </p>
            )}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20 min-h-[50vh]">
        {isSubmitted ? (
          <div className="max-w-3xl mx-auto animate-in zoom-in-95 duration-700">
            <div className="bg-white border border-gray-400 rounded-sm p-12 text-center shadow-xl shadow-blue-100/20">
              <div className="w-24 h-24 bg-blue-50 text-[#448cff] rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-100">
                <CheckCircle2 size={48} strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">
                Application Submitted Successfully
              </h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10">
                Thanks for submitting your details. We have received your
                application and our recruitment team will review it.
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-[#0f1216] text-white px-10 py-4 rounded-sm font-black uppercase tracking-widest text-sm hover:bg-[#448cff] transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : showPending ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-100">
                <Clock size={40} strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">
                We are checking your profile
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-md mx-auto">
                Your application has been received. Our team will review your
                details and get back to you. You will see an approval status
                here once confirmed.
              </p>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-[#448cff] text-white px-8 py-3 rounded-sm font-black uppercase text-sm hover:bg-blue-700 transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : showApproved ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-green-200 rounded-xl p-12 text-center shadow-sm bg-green-50/30">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200">
                <CheckCircle2 size={40} strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">
                Confirmed — you are approved
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-md mx-auto">
                Your profile has been approved. You can request an update to
                your details below; any changes will need to be reviewed and
                approved again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={handleRequestUpdate}
                  className="bg-[#448cff] text-white px-8 py-3 rounded-sm font-black uppercase text-sm hover:bg-blue-700 transition-all"
                >
                  Request an update
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="border border-gray-300 text-slate-700 px-8 py-3 rounded-sm font-black uppercase text-sm hover:bg-slate-50 transition-all"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        ) : showRejected ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-red-200 rounded-xl p-12 text-center shadow-sm bg-red-50/30">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-200">
                <XCircle size={40} strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">
                Application not approved
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-md mx-auto">
                Unfortunately your application was not approved this time. You
                can submit a new application below if your details have changed,
                and we will review it again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={handleRequestUpdate}
                  className="bg-[#448cff] text-white px-8 py-3 rounded-sm font-black uppercase text-sm hover:bg-blue-700 transition-all"
                >
                  Submit new application
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="border border-gray-300 text-slate-700 px-8 py-3 rounded-sm font-black uppercase text-sm hover:bg-slate-50 transition-all"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        ) : showForm ? (
          <div
            className={
              availabilityOnlyUpdate
                ? "grid grid-cols-1 gap-16"
                : "grid grid-cols-1 lg:grid-cols-12 gap-16"
            }
          >
            {!availabilityOnlyUpdate && (
              <div className="hidden lg:block lg:col-span-4 lg:order-first space-y-8 sticky top-32 h-fit">
                <div className="bg-white border border-gray-300 p-8 rounded-sm shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 border-b border-gray-100 pb-4">
                    Application Progress
                  </h3>
                  <nav className="space-y-6">
                    <StepLink
                      number="01"
                      label="Personal Details"
                      active={activeSection === "section-1"}
                    />
                    <StepLink
                      number="02"
                      label="Experience & Skills"
                      active={activeSection === "section-2"}
                    />
                    <StepLink
                      number="03"
                      label="Weekly Availability"
                      active={activeSection === "section-3"}
                    />
                    <StepLink
                      number="04"
                      label="Eligibility Check"
                      active={activeSection === "section-4"}
                    />
                    <StepLink
                      number="05"
                      label="Standards"
                      active={activeSection === "section-5"}
                    />
                  </nav>
                </div>
              </div>
            )}

            <div
              className={
                availabilityOnlyUpdate
                  ? "w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6"
                  : "lg:col-span-8"
              }
            >
              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                  {submitError}
                </div>
              )}
              {availabilityOnlyUpdate && (
                <div className="mb-8 p-5 bg-blue-50/80 border border-blue-200 rounded-xl text-slate-700 text-sm font-medium leading-relaxed">
                  <p className="max-w-none">
                    You can only update your{" "}
                    <strong className="text-blue-800">
                      weekly availability
                    </strong>{" "}
                    here. Other details (name, experience, etc.) cannot be
                    changed.
                  </p>
                </div>
              )}
              <form
                className={
                  availabilityOnlyUpdate
                    ? "space-y-8 pb-16"
                    : "space-y-24 pb-32"
                }
                onSubmit={handleSubmit}
              >
                {availabilityOnlyUpdate ? null : (
                  <>
                    {/* SECTION 1 */}
                    <section id="section-1" className="space-y-10 scroll-mt-32">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-[#448cff] rounded-sm flex items-center justify-center font-black text-xl border border-blue-100">
                          01
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                          Personal Details
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputGroup
                          label="First Name *"
                          value={formData.firstName}
                          onChange={(v) => updateField("firstName", v)}
                          placeholder="John"
                          maxLength={100}
                        />
                        <InputGroup
                          label="Middle Name"
                          value={formData.middleName}
                          onChange={(v) => updateField("middleName", v)}
                          placeholder="Optional"
                          maxLength={100}
                        />
                        <InputGroup
                          label="Surname *"
                          value={formData.surname}
                          onChange={(v) => updateField("surname", v)}
                          placeholder="Doe"
                          maxLength={100}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            Your Gender (Optional)
                          </label>
                          <div className="relative">
                            <select
                              className="w-full p-4 border border-gray-400 rounded-sm outline-none focus:border-[#448cff] bg-white font-bold text-slate-400 appearance-none cursor-pointer"
                              value={formData.gender}
                              onChange={(e) =>
                                updateField("gender", e.target.value)
                              }
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                            <ChevronRight
                              size={16}
                              className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                            />
                          </div>
                        </div>
                        <InputGroup
                          label={`Phone Number * (${country === "uk" ? "UK" : country === "us" ? "US" : "Canada"})`}
                          value={formData.phone}
                          onChange={updatePhone}
                          type="tel"
                          inputMode="numeric"
                          placeholder={phonePlaceholder}
                          helper={phoneHelper}
                          maxLength={20}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            Email Address * (your login email)
                          </label>
                          <input
                            type="email"
                            readOnly
                            value={user?.email ?? ""}
                            className="w-full p-4 border border-gray-400 rounded-sm outline-none bg-slate-50 font-bold text-slate-700 cursor-not-allowed"
                          />
                          <p className="text-xs text-slate-500 font-medium">
                            Your application uses your account email only. {postcodeLabel} and phone number required for your region.
                          </p>
                        </div>
                        <InputGroup
                          label={`${postcodeLabel} *`}
                          value={formData.postcode}
                          onChange={updatePostcode}
                          placeholder={postcodePlaceholder}
                          maxLength={12}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                          Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value.trimStart() }))}
                          placeholder={addressPlaceholder}
                          className="w-full p-4 border border-gray-400 rounded-sm outline-none focus:border-[#448cff] font-medium text-slate-800 placeholder-slate-400"
                          maxLength={500}
                        />
                        <p className="text-xs text-slate-500 font-medium">
                          Your full residential address (street, building, city). Required for your application.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            Referral code (optional)
                          </label>
                          <input
                            type="text"
                            value={formData.referralCode}
                            onChange={(e) => setFormData((prev) => ({ ...prev, referralCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12) }))}
                            placeholder="e.g. ABC12XYZ (from a friend or colleague)"
                            className="w-full p-4 border border-gray-400 rounded-sm outline-none focus:border-[#448cff] font-medium text-slate-800 placeholder-slate-400"
                          />
                          <p className="text-xs text-slate-500 font-medium">
                            If someone referred you, enter their referral code here. You can find your own code on the Refer & Earn page after signing in.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* SECTION 2 */}
                    <section id="section-2" className="space-y-10 scroll-mt-32">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-[#448cff] rounded-sm flex items-center justify-center font-black text-xl border border-blue-100">
                          02
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                          Experience & Skills
                        </h2>
                      </div>
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            Experience Level *
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                              "Less than 6 months",
                              "More than 6 months",
                              "More than 2 years",
                            ].map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() =>
                                  updateField("experienceLevel", lvl)
                                }
                                className={`p-4 border-2 rounded-sm font-black uppercase text-[11px] tracking-widest transition-all ${formData.experienceLevel === lvl ? "border-[#448cff] bg-blue-50 text-[#448cff]" : "border-gray-400 text-slate-400 hover:border-gray-400"}`}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-6">
                          <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
                            Cleaning Types *
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                              "Residential",
                              "End of Tenancy",
                              "Airbnb",
                              "Commercial",
                              "Other",
                            ].map((type) => (
                              <div
                                key={type}
                                onClick={() => toggleExpType(type)}
                                className={`flex items-center gap-3 p-3 border rounded-sm cursor-pointer transition-all ${formData.experienceTypes.includes(type) ? "border-[#448cff] bg-blue-50" : "border-gray-300"}`}
                              >
                                <div
                                  className={`w-4 h-4 border flex items-center justify-center ${formData.experienceTypes.includes(type) ? "bg-[#448cff] border-[#448cff]" : "border-gray-400"}`}
                                >
                                  {formData.experienceTypes.includes(type) && (
                                    <Check
                                      size={14}
                                      className="text-white"
                                      strokeWidth={4}
                                    />
                                  )}
                                </div>
                                <span className="text-xs font-bold text-slate-600">
                                  {type}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* --- CORRECTED: "Other" Dropdown Box --- */}
                          {formData.experienceTypes.includes("Other") && (
                            <div className="mt-4 p-6 bg-slate-50 border border-gray-400 rounded-sm animate-in fade-in slide-in-from-top-2 duration-300">
                              <label className="text-[10px] font-black uppercase text-[#448cff] tracking-widest mb-4 block">
                                Select specialized services you can perform:
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                  "Carpet cleaning",
                                  "Window cleaning",
                                  "Oven cleaning",
                                  "Upholstery cleaning",
                                  "Office cleaning",
                                  "Gutter cleaning",
                                  "Pressure washing",
                                  "Pavement cleaning",
                                ].map((subType) => (
                                  <CheckboxItem
                                    key={subType}
                                    label={subType}
                                    checked={formData.otherExperienceTypes.includes(
                                      subType,
                                    )}
                                    onChange={() => toggleOtherType(subType)}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  </>
                )}

                <section
                  id="section-3"
                  className={`scroll-mt-32 ${availabilityOnlyUpdate ? "bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8 lg:p-10" : "space-y-10"}`}
                >
                  <div
                    className={`flex items-center gap-4 ${availabilityOnlyUpdate ? "mb-6 lg:mb-8" : ""}`}
                  >
                    {!availabilityOnlyUpdate && (
                      <div className="w-12 h-12 bg-blue-50 text-[#448cff] rounded-lg flex items-center justify-center font-black text-xl border border-blue-100 shrink-0">
                        03
                      </div>
                    )}
                    <div className="min-w-0">
                      <h2
                        className={`font-black text-slate-900 tracking-tight ${availabilityOnlyUpdate ? "text-xl sm:text-2xl mb-1" : "text-2xl uppercase"}`}
                      >
                        {availabilityOnlyUpdate
                          ? "Weekly availability"
                          : "Availability"}
                      </h2>
                      <p className="text-slate-600 text-sm md:text-base">
                        {availabilityOnlyUpdate
                          ? "Tick the days you can work and set your time slots. Submit when done."
                          : "Please update your availability in case of temporary unavoidable reasons"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={
                      availabilityOnlyUpdate ? "space-y-4" : "space-y-4"
                    }
                  >
                    {Object.keys(formData.availability).map((day) => (
                      <div
                        key={day}
                        className={`border rounded-xl transition-all duration-200 ${formData.availability[day].enabled ? "border-[#448cff]/30 bg-white shadow-sm" : "border-gray-200 bg-slate-50/80"}`}
                      >
                        <div
                          className={`flex justify-between items-center p-4 sm:p-5 ${formData.availability[day].enabled ? "bg-slate-50/80 border-b border-gray-100 rounded-t-xl" : ""}`}
                        >
                          <span className="font-bold text-slate-800 text-sm md:text-base shrink-0">
                            {day}
                          </span>
                          <label className="flex items-center gap-3 cursor-pointer select-none shrink-0">
                            <input
                              type="checkbox"
                              className="w-5 h-5 accent-[#448cff] cursor-pointer rounded border-gray-300"
                              checked={formData.availability[day].enabled}
                              onChange={() =>
                                updateAvailability(
                                  day,
                                  "enabled",
                                  !formData.availability[day].enabled,
                                )
                              }
                            />
                            <span className="text-sm font-semibold text-slate-600">
                              Available
                            </span>
                          </label>
                        </div>

                        {formData.availability[day].enabled && (
                          <div
                            className={
                              availabilityOnlyUpdate
                                ? "p-4 sm:p-5 lg:p-6 space-y-5"
                                : "p-4 sm:p-5 lg:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8"
                            }
                          >
                            {[
                              { id: 1, label: "Morning" },
                              { id: 2, label: "Afternoon" },
                              { id: 3, label: "Evening" },
                            ].map((shift) => {
                              const filteredTimes = timeOptions.filter((t) => {
                                const hour = parseInt(t.split(":")[0]);
                                if (shift.id === 1)
                                  return hour >= 7 && hour <= 12;
                                if (shift.id === 2)
                                  return hour >= 12 && hour <= 17;
                                if (shift.id === 3)
                                  return hour >= 17 && hour <= 20;
                                return true;
                              });

                              return (
                                <div
                                  key={shift.id}
                                  className="space-y-2 min-w-0"
                                >
                                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    {shift.label}
                                  </p>
                                  <div className="flex items-center border border-gray-300 rounded-lg divide-x divide-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#448cff]/20 focus-within:border-[#448cff]">
                                    <select
                                      className="flex-1 min-w-0 p-3 text-sm font-semibold outline-none appearance-none text-center bg-white cursor-pointer text-slate-800"
                                      value={
                                        formData.availability[day][
                                          `s${shift.id}_start`
                                        ]
                                      }
                                      onChange={(e) =>
                                        updateAvailability(
                                          day,
                                          `s${shift.id}_start`,
                                          e.target.value,
                                        )
                                      }
                                    >
                                      <option value="">Start</option>
                                      {filteredTimes.map((t) => (
                                        <option key={t} value={t}>
                                          {t}
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      className="flex-1 min-w-0 p-3 text-sm font-semibold outline-none appearance-none text-center bg-white cursor-pointer text-slate-800"
                                      value={
                                        formData.availability[day][
                                          `s${shift.id}_end`
                                        ]
                                      }
                                      onChange={(e) =>
                                        updateAvailability(
                                          day,
                                          `s${shift.id}_end`,
                                          e.target.value,
                                        )
                                      }
                                    >
                                      <option value="">End</option>
                                      {filteredTimes
                                        .filter(
                                          (t) =>
                                            !formData.availability[day][`s${shift.id}_start`] ||
                                            t > formData.availability[day][`s${shift.id}_start`]
                                        )
                                        .map((t) => (
                                          <option key={t} value={t}>
                                            {t}
                                          </option>
                                        ))}
                                    </select>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {!availabilityOnlyUpdate && (
                  <>
                    {/* SECTION 4 */}
                    <section id="section-4" className="space-y-10 scroll-mt-32">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-[#448cff] rounded-sm flex items-center justify-center font-black text-xl border border-blue-100">
                          04
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                          Eligibility
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CheckboxItem
                          label="I have the right to work in the UK"
                          checked={formData.eligibility.workRights}
                          onChange={() => updateEligibility("workRights")}
                        />
                        <CheckboxItem
                          label="I have a UK bank account"
                          checked={formData.eligibility.bankAccount}
                          onChange={() => updateEligibility("bankAccount")}
                        />
                        <CheckboxItem
                          label="I understand I will be self-employed"
                          checked={formData.eligibility.selfEmployed}
                          onChange={() => updateEligibility("selfEmployed")}
                        />
                        <CheckboxItem
                          label="I do not have a criminal record/police convictions"
                          checked={formData.eligibility.cleanRecord}
                          onChange={() => updateEligibility("cleanRecord")}
                        />
                      </div>
                    </section>

                    {/* SECTION 5 */}
                    <section id="section-5" className="space-y-10 scroll-mt-32">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-[#448cff] rounded-sm flex items-center justify-center font-black text-xl border border-blue-100">
                          05
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                          Excellence Standards
                        </h2>
                      </div>
                      <div className="flex items-start gap-6 bg-slate-900 p-8 md:p-12 rounded-sm relative overflow-hidden group border border-gray-400">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#448cff]/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10 shrink-0 mt-1">
                          <Sparkles size={28} className="text-[#448cff]" />
                        </div>
                        <div className="relative z-10 space-y-6">
                          <p className="text-[16px] text-slate-300 leading-relaxed font-medium italic">
                            "We won’t sugar-coat it: this role involves physical
                            work and attention to detail. If you take pride in
                            doing a job well, you’ll fit right in!"
                          </p>
                          <p className="text-[16px] text-white leading-relaxed font-black uppercase tracking-wide">
                            <span className="text-[#448cff]">Important:</span>{" "}
                            You will need to happily reclean areas of property
                            free of charge if the customer is not 100%
                            satisfied.
                          </p>
                        </div>
                      </div>
                    </section>
                  </>
                )}

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-[#448cff] text-white py-6 rounded-sm font-black uppercase tracking-[0.3em] text-lg hover:bg-blue-700 shadow-2xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {submitLoading
                    ? "Submitting..."
                    : availabilityOnlyUpdate
                      ? "Submit availability update"
                      : "Submit Application"}
                </button>
              </form>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

// --- SUB-COMPONENTS ---
const StepLink = ({ number, label, active }) => (
  <div className="flex items-center gap-4 transition-all duration-300 transform">
    <span
      className={`text-[10px] font-black tracking-widest transition-colors duration-300 ${active ? "text-[#448cff] scale-125" : "text-slate-300"}`}
    >
      {number}
    </span>
    <span
      className={`text-sm font-bold uppercase tracking-tight transition-all duration-300 ${active ? "text-slate-900 translate-x-2 border-l-2 border-[#448cff] pl-2" : "text-slate-400"}`}
    >
      {label}
    </span>
  </div>
);

const InputGroup = ({ label, placeholder, value, onChange, type = "text", inputMode, helper, maxLength }) => (
  <div className="space-y-2 w-full">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
      {label}
    </label>
    <input
      type={type}
      inputMode={inputMode}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
      className="w-full p-4 border border-gray-400 rounded-sm outline-none focus:border-[#448cff] transition-all font-bold text-slate-700 bg-white"
    />
    {helper && <p className="text-xs text-slate-500 font-medium">{helper}</p>}
  </div>
);

const CheckboxItem = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-4 p-5 border border-gray-400 rounded-sm cursor-pointer hover:bg-blue-50 transition-all group bg-white">
    <div
      className={`w-6 h-6 border flex items-center justify-center transition-all ${checked ? "bg-[#448cff] border-[#448cff]" : "border-gray-400 bg-white"}`}
    >
      {checked && <Check size={16} className="text-white" strokeWidth={4} />}
    </div>
    <span
      className={`font-bold text-sm transition-colors ${checked ? "text-slate-900 font-black" : "text-slate-600"}`}
    >
      {label}
    </span>
    <input
      type="checkbox"
      className="hidden"
      checked={checked}
      onChange={onChange}
    />
  </label>
);

export default Apply;
