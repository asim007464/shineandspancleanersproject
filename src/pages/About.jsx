import React, { useEffect } from "react";
import {
  Check,
  Clock,
  Wallet,
  Dumbbell,
  Star,
  Smartphone,
  Briefcase,
  User,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../Components/Homecomponents/Navbar";
import Footer from "../Components/Homecomponents/Footer";
import { useSiteSettings } from "../contexts/SiteSettingsContext";

const About = () => {
  const { location, locationPostcodes, currencySymbol } = useSiteSettings();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-jakarta bg-[#fcfdfe]">
      <Navbar />

      {/* --- HERO HEADER --- */}
      <section className="bg-white py-20 text-center font-jakarta">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main Title: Dark text + Brand Blue text */}
          <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] mb-2 leading-tight">
            About the <span className="text-[#448cff]">Role</span>
          </h1>

          {/* Description: Matching the font size and color from your screenshot */}
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto opacity-90">
            Are you a dedicated cleaning professional with a passion for
            excellence? We are seeking energetic and reliable self-employed
            <i>Cleaners</i> to join our progressive team <i>across</i>{" "}
            {location}
            {locationPostcodes ? ` (${locationPostcodes})` : ""}.
          </p>
        </div>
      </section>
      <main className="max-w-7xl mx-auto px-6  space-y-32">
        {/* --- CENTERED MISSION SECTION --- */}
        <section className=" bg-[#fcfdfe]">
          <div className="max-w-8xl mx-auto px-6">
            <div className="bg-white p-0 md:px-16 md:pb-12 md:pt-8 border border-gray-100 rounded-sm shadow-[0_20px_50px_rgba(68,140,255,0.1)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
              {/* Decorative background element */}

              {/* Header */}
              <div className="relative flex flex-col items-center text-center mb-16 ">
                {/* --- 1. Background "Watermark" Text (Very subtle) --- */}
                <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[80px] md:text-[120px] font-black text-slate-50 select-none tracking-widest z-0 opacity-50">
                  PURPOSE
                </span>

                {/* --- 2. Professional Icon Backdrop --- */}
                <div className="relative z-10 mb-8"></div>

                {/* --- 3. Refined Typography --- */}
                <div className="relative z-10">
                  <p className="text-[#448cff] text-xs font-black uppercase tracking-[0.4em] mb-2">
                    Core Values
                  </p>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#1e293b] leading-none">
                    Our <span className="text-[#448cff]">Mission</span>
                  </h2>

                  {/* --- 4. Modern Decorative Line --- */}
                  <div className="flex items-center justify-center gap-3 mt-6">
                    <div className="w-8 h-[2px] bg-gray-200"></div>
                    <div className="w-3 h-3 border-2 border-[#448cff] rounded-full"></div>
                    <div className="w-8 h-[2px] bg-gray-200"></div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                {/* Quote Decoration */}
                <span className="absolute -left-4 -top-4 text-6xl text-slate-100 font-serif leading-none select-none">
                  “
                </span>

                <p className="text-slate-600 font-medium text-lg md:text-xl leading-[1.9]  text-center px-4">
                  Our mission is to deliver consistently exceptional cleaning,
                  without exception. Every job must be completed thoroughly,
                  correctly, and to{" "}
                  <i>
                    our standards. Quality is essential, and anything less is
                    unacceptable.
                  </i>
                  Anything less is unacceptable. Independent contractors are
                  expected to clean with precision, discipline, and full
                  attention to detail.{" "}
                  <i>No area is overlooked. No task is rushed.</i> Each space
                  must be left in <i>noticeably</i> better condition than it was
                  found. We clean safely and responsibly using approved
                  eco-friendly products. Professional conduct, punctuality, and
                  reliability are required at all times. Contractors are fully
                  accountable for the quality of their work, including
                  correcting any deficiencies. Contractors who consistently meet
                  <i>quality expectations</i> and demonstrate pride in their
                  work are prioritized for ongoing assignments. Work that fails
                  to meet expectations is documented and addressed. Continued
                  substandard performance will result in removal from active
                  work.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* --- SECTION 2: BENEFITS (4-COLUMN INTERACTIVE) --- */}
        <div className="space-y-16">
          <div className="text-center">
            <h2 className="text-3xl font-black uppercase text-slate-900">
              Benefits of Joining
            </h2>
            <div className="w-16 h-1 bg-[#448cff] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <InfoCard
              icon={<Wallet size={24} />}
              title="Top Pay"
              desc={`Upto ${currencySymbol}800/week + tips. Get paid the same day you do cleaning.`}
            />
            <InfoCard
              icon={<Dumbbell size={24} />}
              title="Gym Access"
              desc="Enjoy great perks including a free gym membership to stay healthy."
            />
            <InfoCard
              icon={<Clock size={24} />}
              title="Flexible Scheduling"
              desc="Control your schedule. Tell us the hours you want to work."
            />
            <InfoCard
              icon={<Star size={24} />}
              title="Team Support"
              desc="Guidance, training, and a positive work culture where you are valued."
            />
          </div>
        </div>

        {/* --- SECTION 3: RESPONSIBILITIES & WHAT WE'RE LOOKING FOR --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Left: Key Responsibilities (Takes 5 columns) */}
          <div className="lg:col-span-5 space-y-10">
            <h3 className="text-2xl font-black uppercase text-slate-900  border-gray-100 pb-4 tracking-tight">
              Key Responsibilities
            </h3>
            <ul className="space-y-8">
              {/* <ListItem text="Clean homes / offices to an exceptional standard (dusting, vacuuming, mopping, etc.)." />
              <ListItem text="Deliver a “wow” factor with every clean." />
              <ListItem text="Maintain professionalism: arrive on time, well-groomed, and in appropriate attire." />
              <ListItem text="Work flexibly and adapt to each client’s needs." />
              <ListItem text="Ensure reliability and consistency in your work quality." />
              <ListItem text="If a client is unhappy with cleaning, you will have to freely reclean the areas of the property highlighted by the customer." /> */}
              <ListItem text="Thorough, detail-focused cleaning on every job, not just visible areas." />
              <ListItem text="Consistent quality, regardless of job size or frequency." />
              <ListItem text="Professional conduct in client spaces, including punctuality and respect." />
              <ListItem text="Proper use of eco-friendly products and safe cleaning practices." />
              <ListItem text="Reliable attendance and communication." />
              <ListItem text="Accountability for results, including correcting missed or substandard work." />
              <ListItem text="Pride in workmanship and a willingness to meet high expectations." />
              <ListItem text="Contractors who consistently meet these standards are supported and prioritized. Those who do not may not be offered continued work." />
            </ul>
          </div>

          {/* Right: What We're Looking For (Takes 7 columns with 2x2 cards) */}
          <div className="lg:col-span-7 space-y-10">
            <h3 className="text-2xl font-black uppercase text-slate-900  border-gray-100 pb-4 tracking-tight">
              What We Expect From Our Cleaners
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoCard
                icon={<Smartphone size={22} />}
                title="Smartphone"
                desc="Must own for scheduling and communication."
                small={true}
              />
              <InfoCard
                icon={<Briefcase size={22} />}
                title="Self-Employed"
                desc="Must provide your own equipment and liability insurance."
                small={true}
              />
              <InfoCard
                icon={<User size={22} />}
                title="Personal Quality"
                desc="Energetic, physically fit, and polite manners."
                small={true}
              />
              <InfoCard
                icon={<ShieldCheck size={22} />}
                title="Appearance"
                desc="Clean, tidy, and well-dressed to reflect premium service."
                small={true}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// --- REUSABLE SUB-COMPONENTS ---

/**
 * InfoCard: Used for both Benefits and Requirements
 * Features: hover-lift, blue-glow shadow, icon color flip
 */
const InfoCard = ({ icon, title, desc, highlight, small }) => (
  <div
    className={`bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 group ${small ? "p-6" : "p-8"}`}
  >
    {/* Icon box with rounded-2xl to match your image */}
    <div
      className={`${small ? "w-12 h-12 mb-6" : "w-14 h-14 mb-8"} rounded-2xl flex items-center justify-center transition-colors duration-300 ${
        highlight
          ? "bg-[#448cff] text-white shadow-lg shadow-blue-100"
          : "bg-blue-50 text-[#448cff] group-hover:bg-[#448cff] group-hover:text-white"
      }`}
    >
      {icon}
    </div>
    <h4
      className={`font-black uppercase text-slate-900 tracking-tight mb-3 ${small ? "text-sm" : "text-lg"}`}
    >
      {title}
    </h4>
    <p
      className={`text-slate-500 font-medium leading-relaxed ${small ? "text-xs" : "text-[15px]"}`}
    >
      {desc}
    </p>
  </div>
);

/**
 * ListItem: Checkmark in a circular border
 */
const ListItem = ({ text }) => (
  <li className="flex gap-5 items-start group">
    <div className="flex-shrink-0 mt-1">
      <div className="w-6 h-6 rounded-full border-2 border-[#448cff]/30 flex items-center justify-center group-hover:border-[#448cff] transition-colors">
        <Check size={14} className="text-[#448cff]" strokeWidth={4} />
      </div>
    </div>
    <span className="text-[15px] font-bold text-slate-700 leading-snug">
      {text}
    </span>
  </li>
);

export default About;
