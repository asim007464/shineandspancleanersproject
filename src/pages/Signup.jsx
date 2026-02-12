import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Home as HomeIcon, Loader2, Mail } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useSiteSettings } from "../contexts/SiteSettingsContext";
import { supabase } from "../lib/supabase";
import { rateLimit } from "../lib/security";

const OTP_COOLDOWN_SECONDS = 60;

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isSigningUpRef = useRef(false);
  const { user, loading: authLoading, signUp, signOut } = useAuth();
  const { location, logoUrl } = useSiteSettings();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSentTo, setOtpSentTo] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const redirectToRef = useRef("");

  // Strong password: at least 8 chars, one letter, one number
  const isStrongPassword = (p) =>
    p.length >= 8 && /[A-Za-z]/.test(p) && /\d/.test(p);
  const passwordRequirements =
    "Use a strong password: at least 8 characters, including a letter and a number.";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Preserve redirect param (e.g. /apply?ref=CODE) so it survives step changes and email OTP redirect
  useEffect(() => {
    const r = searchParams.get("redirect") || "";
    if (r) redirectToRef.current = r;
  }, [searchParams]);

  // Open OTP page from email link: /signup?step=3&email=...
  useEffect(() => {
    const stepParam = searchParams.get("step");
    const emailParam = searchParams.get("email");
    if (stepParam === "3" && emailParam) {
      const decoded = decodeURIComponent(emailParam);
      setStep(3);
      setEmail(decoded);
      setOtpSentTo(decoded);
    }
  }, [searchParams]);

  const redirectTo =
    searchParams.get("redirect") || redirectToRef.current || "";

  useEffect(() => {
    if (!authLoading && user && !isSigningUpRef.current) {
      navigate(redirectTo && redirectTo !== "/" ? redirectTo : "/", {
        replace: true,
      });
    }
  }, [user, authLoading, navigate, redirectTo]);

  // 60-second cooldown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const t = setInterval(
      () => setCooldownSeconds((s) => (s <= 1 ? 0 : s - 1)),
      1000,
    );
    return () => clearInterval(t);
  }, [cooldownSeconds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Rate limit: max 3 signups per 2 minutes
    const rl = rateLimit("signup-submit", 3, 120000);
    if (!rl.allowed) {
      const secs = Math.ceil(rl.retryAfterMs / 1000);
      setError(`Too many attempts. Please wait ${secs} seconds.`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!isStrongPassword(password)) {
      setError(
        "Use a strong password: at least 8 characters, including a letter and a number.",
      );
      return;
    }
    isSigningUpRef.current = true;
    setLoading(true);
    setError("");
    try {
      const fullName = [firstName, lastName].filter(Boolean).join(" ");
      await signUp(email, password, fullName || email);
      await signOut();
      setStep(2);
    } catch (err) {
      setError(err.message || "Sign up failed. Try again.");
      isSigningUpRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  const otpRedirectUrl = (emailForUrl, includeRedirect = true) => {
    const base = `${typeof window !== "undefined" ? window.location.origin : ""}/signup?step=3&email=${encodeURIComponent(emailForUrl)}`;
    const redirect = includeRedirect ? redirectToRef.current || redirectTo : "";
    return redirect ? `${base}&redirect=${encodeURIComponent(redirect)}` : base;
  };

  const handleSendOtpToEmail = async () => {
    setError("");
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: otpRedirectUrl(email),
        },
      });
      if (err) throw err;
      setOtpSentTo(email);
      setStep(3);
      setCooldownSeconds(OTP_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err.message || "Failed to send code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldownSeconds > 0) return;
    setError("");
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email: otpSentTo,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: otpRedirectUrl(otpSentTo),
        },
      });
      if (err) throw err;
      setCooldownSeconds(OTP_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 8) {
      setError("Please enter the 8-digit code we sent you.");
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.verifyOtp({
        email: otpSentTo,
        token: otp.trim(),
        type: "email",
      });
      if (err) throw err;
      await signOut();
      setSuccess(true);
      const savedRedirect = redirectToRef.current || redirectTo;
      const redirectParam = savedRedirect
        ? `?redirect=${encodeURIComponent(savedRedirect)}`
        : "";
      setTimeout(
        () => navigate(`/login${redirectParam}`, { replace: true }),
        1500,
      );
    } catch (err) {
      setError(err.message || "Invalid or expired code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const logoSrc = logoUrl || "/websitelogo.png";

  if (authLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#448cff]" size={32} />
      </div>
    );
  }
  if (user) return null;

  const signupBgImage =
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200";

  return (
    <div className="flex min-h-screen lg:h-screen w-full bg-white font-jakarta overflow-x-hidden">
      <div className="relative hidden w-1/2 lg:block min-h-screen overflow-hidden">
        <img
          src={signupBgImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0f1216]/50" />
        <div className="absolute left-10 top-10 z-10">
          <img
            src={logoSrc}
            className="w-[120px] h-auto object-contain"
            alt="Shine & Span"
          />
        </div>
        <div className="absolute bottom-10 left-10 right-10 z-10">
          <h2 className="text-4xl font-black uppercase mb-4 text-white tracking-tight">
            Join the <span className="text-[#448cff]">Team</span>
          </h2>
          <p className="text-gray-200 text-lg font-medium max-w-md leading-relaxed">
            Create your worker account to manage your profile, set your own
            schedule, and track your same-day payments.
          </p>
          <p className="mt-12 text-xs text-slate-400 font-bold uppercase tracking-widest">
            © 2025 Shine & Span Cleaning Services Ltd
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-10 lg:w-1/2 lg:px-20 bg-white">
        <div className="w-full max-w-[550px]">
          <div className="lg:hidden mb-8">
            <Link to="/">
              <img
                src={logoSrc}
                className="w-[120px] h-auto object-contain"
                alt="Shine & Span"
              />
            </Link>
          </div>
          <div className="flex items-center justify-between mb-8">
            <Link
              to={
                redirectTo
                  ? `/login?redirect=${encodeURIComponent(redirectTo)}`
                  : "/login"
              }
              className="inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#448cff] transition-all"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Login
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-gray-400 rounded-sm text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-[#448cff] hover:text-white hover:border-[#448cff] transition-all"
            >
              <HomeIcon size={14} /> Home
            </Link>
          </div>

          <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-[#1e293b]">
            {step === 1
              ? "Create Account"
              : step === 2
                ? "Verify your account"
                : "Enter code"}
          </h1>
          <p className="text-slate-500 mb-10 font-medium">
            {step === 1 &&
              `Join ${location}'s most professional cleaning network.`}
            {step === 2 &&
              "We'll send an 8-digit code to your email. You can request a new code after 60 seconds."}
            {step === 3 &&
              `Enter the 8-digit code we sent to ${otpSentTo}. If you closed this page, use the link in the email to return here.`}
          </p>

          {success ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <Loader2 className="animate-spin text-[#448cff]" size={40} />
            </div>
          ) : step === 2 ? (
            <div className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSendOtpToEmail}
                  disabled={loading}
                  className="w-full flex items-center gap-3 p-4 border-2 border-gray-300 rounded-sm font-bold text-slate-700 hover:border-[#448cff] hover:bg-blue-50/50 transition-all disabled:opacity-60"
                >
                  <Mail size={22} className="text-[#448cff]" />
                  Send code to my email ({email})
                </button>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-slate-500 font-bold text-sm hover:text-[#448cff]"
              >
                Back to form
              </button>
            </div>
          ) : step === 3 ? (
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  8-digit code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full p-4 border border-gray-400 rounded-sm outline-none focus:border-[#448cff] font-bold text-slate-700 bg-white text-center text-2xl tracking-[0.5em]"
                  placeholder="00000000"
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 8}
                className="w-full mt-6 bg-[#448cff] text-white py-5 rounded-sm font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Verify code"
                )}
              </button>
              {cooldownSeconds > 0 ? (
                <p className="text-slate-500 text-sm font-medium">
                  Resend code in{" "}
                  <span className="font-bold text-[#448cff]">
                    {cooldownSeconds}
                  </span>{" "}
                  seconds
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="w-full text-slate-500 font-bold text-sm hover:text-[#448cff] disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Resend code"}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setStep(2);
                  setSearchParams({});
                }}
                className="w-full text-slate-500 font-bold text-sm hover:text-[#448cff]"
              >
                Send code to a different email
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-4 border border-gray-400 rounded-sm outline-none focus:border-[#448cff] font-bold text-slate-700 bg-white transition-all"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-4 border border-gray-400 rounded-sm outline-none focus:border-[#448cff] font-bold text-slate-700 bg-white transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border border-gray-400 rounded-sm outline-none focus:border-[#448cff] font-bold text-slate-700 bg-white transition-all"
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 border border-gray-400 rounded-sm outline-none focus:border-[#448cff] font-bold text-slate-700 bg-white transition-all"
                  placeholder="••••••••"
                />
                <p className="text-xs text-slate-500 font-medium">
                  {passwordRequirements}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-4 border border-gray-400 rounded-sm outline-none focus:border-[#448cff] font-bold text-slate-700 bg-white transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-[#448cff] text-white py-5 rounded-sm font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Register Account"
                )}
              </button>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Already have an account?{" "}
              <Link
                to={
                  redirectTo
                    ? `/login?redirect=${encodeURIComponent(redirectTo)}`
                    : "/login"
                }
                className="text-[#448cff] font-black underline hover:text-blue-800 transition-colors"
              >
                Sign In here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
