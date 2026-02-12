import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, Eye, EyeOff, Info } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useSiteSettings } from "../contexts/SiteSettingsContext";
import { rateLimit } from "../lib/security";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectRaw = searchParams.get("redirect") || "/";
  // React Router expects a path; full URLs (e.g. http://localhost:5173/apply?ref=...) break routing
  const redirectTo = redirectRaw.startsWith("http://") || redirectRaw.startsWith("https://")
    ? (() => {
        try {
          const u = new URL(redirectRaw);
          return u.pathname + u.search;
        } catch {
          return "/";
        }
      })()
    : redirectRaw;
  const requireLoginState = location.state?.requireLogin ? location.state : null;
  // Show "log in first" when coming from Apply/Referral (state) or from nav link (redirect param)
  const fromApply = requireLoginState?.from === "apply" || redirectTo === "/apply" || redirectTo.startsWith("/apply?");
  const fromReferral = requireLoginState?.from === "referral" || redirectTo === "/referral";
  const showRequireLoginAlert = fromApply || fromReferral;
  const { user, loading: authLoading, signIn } = useAuth();
  const { logoUrl } = useSiteSettings();
  const logoSrc = logoUrl || "/websitelogo.png";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && user) navigate(redirectTo, { replace: true });
  }, [user, authLoading, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Rate limit: max 5 login attempts per minute
    const rl = rateLimit("login-submit", 5, 60000);
    if (!rl.allowed) {
      const secs = Math.ceil(rl.retryAfterMs / 1000);
      setError(`Too many login attempts. Please wait ${secs} seconds.`);
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const msg = err.message || "";
      if (msg.toLowerCase().includes("email not confirmed")) {
        setError("Please verify your email first. Check your inbox for the confirmation link, then try again.");
      } else {
        setError(msg || "Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#448cff]" size={32} />
      </div>
    );
  }
  if (user) return null;

  const loginBgImage = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200";

  return (
    <div className="flex min-h-screen lg:h-screen w-full bg-white font-jakarta overflow-x-hidden">
      <div className="relative hidden w-1/2 lg:block min-h-screen overflow-hidden">
        <img
          src={loginBgImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0f1216]/50" />
        <div className="absolute left-10 top-10 z-10">
          <Link to="/">
            <img src={logoSrc} className="w-[120px] h-auto object-contain" alt="Shine & Span" />
          </Link>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 md:px-24 overflow-y-auto py-10">
        <div className="lg:hidden mb-8">
          <Link to="/">
            <img src={logoSrc} alt="Shine & Span" className="w-[120px] h-auto object-contain" />
          </Link>
        </div>
        <button
          onClick={() => navigate("/")}
          className="mb-4 inline-flex items-center text-gray-400 font-bold hover:text-[#448cff] transition-all w-fit"
        >
          <ArrowLeft className="mr-2" size={18} /> Back
        </button>

        <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Sign In</h1>

        {showRequireLoginAlert && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-sm flex items-start gap-3 text-blue-800">
            <Info className="shrink-0 mt-0.5" size={20} />
            <p className="text-sm font-medium">
              {fromApply
                ? "Please sign in or create an account first to access the Apply page."
                : fromReferral
                  ? "Please sign in or create an account first to access the Refer & Earn page."
                  : "Please sign in or create an account first to access this page."}
            </p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
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
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-gray-400 rounded-sm outline-none focus:border-[#448cff] font-bold text-slate-700 bg-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#448cff]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex justify-end pt-1">
              <Link
                to="/forgot-password"
                className="text-[10px] font-black uppercase text-[#448cff] tracking-widest hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#448cff] text-white py-4 rounded-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Access Portal"}
          </button>
        </form>

        <div className="mt-10 text-center space-y-3">
          <p className="text-sm text-slate-400 font-medium">
            New here?{" "}
            <Link to={redirectTo && redirectTo !== "/" ? redirectTo : "/apply"} className="text-[#448cff] font-black underline">
              Apply Now
            </Link>
          </p>
          <p className="text-sm text-slate-400 font-medium">
            No account?{" "}
            <Link to={redirectTo && redirectTo !== "/" ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : "/signup"} className="text-[#448cff] font-black underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
