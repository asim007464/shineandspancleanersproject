import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { supabase } from "../lib/supabase";

const OTP_COOLDOWN_SECONDS = 60;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Open OTP page from email link: /forgot-password?step=2&email=...
  useEffect(() => {
    const stepParam = searchParams.get("step");
    const emailParam = searchParams.get("email");
    if (stepParam === "2" && emailParam) {
      setStep(2);
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  // 60-second cooldown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const t = setInterval(() => setCooldownSeconds((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldownSeconds]);

  const forgotRedirectUrl = () =>
    `${typeof window !== "undefined" ? window.location.origin : ""}/forgot-password?step=2&email=${encodeURIComponent(email.trim())}`;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false,
          emailRedirectTo: forgotRedirectUrl(),
        },
      });
      if (err) throw err;
      setStep(2);
      setCooldownSeconds(OTP_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
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
        email: email.trim(),
        options: {
          shouldCreateUser: false,
          emailRedirectTo: forgotRedirectUrl(),
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
        email: email.trim(),
        token: otp.trim(),
        type: "email",
      });
      if (err) throw err;
      navigate("/reset-password", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid or expired code. Try again or request a new code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white font-jakarta overflow-hidden">
      <div className="hidden lg:flex w-1/2 bg-[#0f1216] relative items-center justify-center p-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80')",
          }}
        />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 md:px-24 overflow-y-auto">
        <button
          onClick={() => (step === 1 ? navigate("/login") : setStep(1))}
          className="mb-12 inline-flex items-center text-gray-400 font-bold hover:text-[#448cff] transition-all w-fit"
        >
          <ArrowLeft className="mr-2" size={18} /> Back to Login
        </button>

        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Forgot password?</h1>
        <p className="text-slate-500 mb-8 font-medium">
          {step === 1
            ? "Enter your email and we'll send you an 8-digit code. You can request a new code after 60 seconds."
            : `Enter the 8-digit code we sent to ${email}. If you closed this page, use the link in the email to return here.`}
        </p>

        {step === 1 ? (
          <form className="space-y-6" onSubmit={handleSendOtp}>
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm font-medium">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-gray-400 rounded-sm outline-none focus:border-[#448cff] font-bold text-slate-700 bg-white"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#448cff] text-white py-4 rounded-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Send code to email"}
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleVerifyOtp}>
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm font-medium">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">8-digit code</label>
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
              className="w-full bg-[#448cff] text-white py-4 rounded-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify code"}
            </button>
            {cooldownSeconds > 0 ? (
              <p className="text-slate-500 text-sm font-medium">
                Resend code in <span className="font-bold text-[#448cff]">{cooldownSeconds}</span> seconds
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
              onClick={() => { setStep(1); setSearchParams({}); }}
              className="w-full text-slate-500 font-bold text-sm hover:text-[#448cff]"
            >
              Use a different email
            </button>
          </form>
        )}

        <div className="mt-10 text-center">
          <Link to="/login" className="text-sm text-slate-400 font-medium hover:text-[#448cff]">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
