import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setReady(true);
    });
    return () => subscription?.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      setSuccess(true);
      await supabase.auth.signOut();
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      setError(err.message || "Could not update password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#448cff]" size={32} />
      </div>
    );
  }

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
        <Link
          to="/login"
          className="mb-12 inline-flex items-center text-gray-400 font-bold hover:text-[#448cff] transition-all w-fit"
        >
          <ArrowLeft className="mr-2" size={18} /> Back to Login
        </Link>

        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Set new password</h1>
        <p className="text-slate-500 mb-8 font-medium">
          Enter your new password below.
        </p>

        {success ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <Loader2 className="animate-spin text-[#448cff]" size={40} />
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm font-medium">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">New password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
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
              <p className="text-xs text-slate-500">At least 8 characters</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Confirm new password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 border border-gray-400 rounded-sm outline-none focus:border-[#448cff] font-bold text-slate-700 bg-white"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#448cff] text-white py-4 rounded-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Update password"}
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

export default ResetPassword;
