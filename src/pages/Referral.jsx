import React, { useEffect, useState } from "react";
import { Gift, Info, Loader2, UserCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Homecomponents/Navbar";
import Footer from "../Components/Homecomponents/Footer";
import { useAuth } from "../contexts/AuthContext";
import { useSiteSettings } from "../contexts/SiteSettingsContext";
import { supabase } from "../lib/supabase";

const Referral = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { location, locationPostcodes } = useSiteSettings();
  const [myReferrals, setMyReferrals] = useState([]);
  const [referralsLoading, setReferralsLoading] = useState(true);

  // Require login to see referral code (you must be logged in to refer)
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent("/referral")}`, {
        replace: true,
        state: { requireLogin: true, from: "referral" },
      });
      return;
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!user?.id) {
      queueMicrotask(() => {
        setMyReferrals([]);
        setReferralsLoading(false);
      });
      return;
    }
    let cancelled = false;
    queueMicrotask(() => setReferralsLoading(true));
    (async () => {
      const { data: refs, error: refError } = await supabase
        .from("referrals")
        .select("id, referred_user_id, status, days_worked, referred_application_status, created_at")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (refError || !refs?.length) {
        setMyReferrals([]);
        setReferralsLoading(false);
        return;
      }
      const { data: referredProfiles } = await supabase.rpc("get_my_referred_profiles");
      const profileMap = new Map((referredProfiles || []).map((p) => [p.referred_user_id, { full_name: p.full_name, email: p.email }]));
      setMyReferrals(refs.map((r) => ({ ...r, referred: profileMap.get(r.referred_user_id) || null })));
      setReferralsLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#448cff]" size={40} />
      </div>
    );
  }

  const referralCode = (profile?.referral_code || "").toUpperCase();

  const copyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      alert("Referral code copied to clipboard!");
    }
  };

  return (
    <div className="font-jakarta bg-white">
      <Navbar />

      {/* --- Header (Matches your Contact/About style) --- */}
      <section className="bg-white py-20 text-center border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] mb-4 uppercase tracking-tight leading-tight">
            Refer & <span className="text-[#448cff]">Earn £25</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed opacity-90">
            <i>Help</i> our professional team and get rewarded. Share your
            unique referral code with cleaners <i>across</i> {location}{locationPostcodes ? ` (${locationPostcodes})` : ""}.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Side: Process */}
          <div className="space-y-12">
            <h2 className="text-3xl font-black uppercase text-slate-900 border-l-4 border-[#448cff] pl-6">
              How it works
            </h2>
            <div className="space-y-8">
              <Step
                number="01"
                title="Share Your Code"
                desc="Share your unique referral code with cleaners you know (e.g. by WhatsApp or text)."
              />
              <Step
                number="02"
                title="They Enter It When Applying"
                desc="When they apply on the website, they enter your code in the optional &quot;Referral code&quot; field."
              />
              <Step
                number="03"
                title="They Get Approved & Work"
                desc={`Once approved, they work with our elite ${location}${locationPostcodes ? ` (${locationPostcodes})` : ""} team.`}
              />
              <Step
                number="04"
                title="Earn Your Bonus"
                desc="After they complete 2 months of high-quality service, you receive £25."
              />
            </div>
          </div>

          {/* Right Side: Your referral code */}
          <div className="bg-slate-50 md:p-10 p-4 border border-gray-300 rounded-sm shadow-xl shadow-blue-100/20 text-center">
            <Gift className="mx-auto text-[#448cff] mb-6" size={48} />
            <h3 className="text-xl font-black uppercase text-slate-900 mb-4">
              Your referral code
            </h3>
            <p className="text-sm text-slate-500 font-medium mb-4">
              {user ? "Share this code with cleaners you know. When they apply, they enter it in the optional referral code field on the application form." : "Sign in or sign up to see your unique referral code."}
            </p>
            {user && referralCode ? (
              <>
                <div className="flex items-center gap-2 bg-white p-4 border-2 border-[#448cff]/30 rounded-sm mb-6">
                  <span className="flex-1 text-2xl font-black tracking-[0.3em] text-slate-800 select-all">
                    {referralCode}
                  </span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="bg-[#448cff] text-white px-6 py-3 rounded-sm font-black uppercase text-xs hover:bg-blue-700 transition-all shrink-0"
                  >
                    Copy code
                  </button>
                </div>
                <p className="text-xs text-slate-400 font-medium mb-4">
                  One referral counts per person. You can see who joined with your code and their progress below.
                </p>
              </>
            ) : !user ? (
              <div className="flex flex-col gap-4">
                <Link
                  to="/login"
                  className="bg-[#448cff] text-white px-8 py-4 rounded-sm font-black uppercase text-sm hover:bg-blue-700 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="border border-gray-400 text-slate-700 px-8 py-4 rounded-sm font-black uppercase text-sm hover:bg-slate-50 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Loading your code…</p>
            )}

            <div className="flex items-start gap-3 text-left bg-blue-50 p-4 border border-blue-100">
              <Info size={18} className="text-[#448cff] shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Bonus is paid only if the referred cleaner maintains 100%
                customer satisfaction for a continuous period of 2 months.
              </p>
            </div>
          </div>
        </div>

        {/* People you referred */}
        <div className="mt-20 border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-black uppercase text-slate-900 mb-6 flex items-center gap-2">
            <UserCheck className="text-[#448cff]" size={28} />
            People you referred
          </h2>
          {referralsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[#448cff]" size={32} />
            </div>
          ) : myReferrals.length === 0 ? (
            <p className="text-slate-500 font-medium py-8">
              No one has used your code yet. Share your code above — when someone applies and enters your code, they’ll appear here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-xs font-black uppercase text-slate-500">Name</th>
                    <th className="px-4 py-3 text-xs font-black uppercase text-slate-500">Email</th>
                    <th className="px-4 py-3 text-xs font-black uppercase text-slate-500">Progress</th>
                    <th className="px-4 py-3 text-xs font-black uppercase text-slate-500">Days working</th>
                    <th className="px-4 py-3 text-xs font-black uppercase text-slate-500">Referred</th>
                  </tr>
                </thead>
                <tbody>
                  {myReferrals.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100 last:border-b-0 hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {r.referred?.full_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-sm">{r.referred?.email || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          r.referred_application_status === "approved" ? "bg-green-100 text-green-800" :
                          r.referred_application_status === "rejected" ? "bg-red-100 text-red-800" :
                          "bg-amber-100 text-amber-800"
                        }`}>
                          {r.referred_application_status === "approved" ? "Working" :
                            r.referred_application_status === "rejected" ? "Rejected" : "Waiting for approval"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{r.days_worked ?? 0}</td>
                      <td className="px-4 py-3 text-slate-500 text-sm">
                        {r.created_at ? new Date(r.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Step = ({ number, title, desc }) => (
  <div className="flex gap-6">
    <span className="text-4xl font-black text-[#448cff]/20">{number}</span>
    <div>
      <h4 className="text-lg font-black uppercase text-slate-900 mb-1">
        {title}
      </h4>
      <p className="text-slate-500 font-medium text-[15px]">{desc}</p>
    </div>
  </div>
);

export default Referral;
