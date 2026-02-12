import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { useSiteSettings } from "../../contexts/SiteSettingsContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { location, locationPostcodes, logoUrl, countryDisplayName } =
    useSiteSettings();

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://facebook.com",
      path: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z",
    },
    {
      name: "Twitter",
      url: "https://twitter.com",
      path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
    },
    {
      name: "TikTok",
      url: "https://tiktok.com",
      path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.31-.75.42-1.24 1.25-1.33 2.1-.1.7.1 1.41.53 1.96.44.63 1.14 1.05 1.88 1.2.52.1 1.06.07 1.57-.03.88-.13 1.65-.71 2.09-1.48.29-.46.46-.98.52-1.52.02-3.58-.01-7.16.02-10.74z",
    },
    {
      name: "YouTube",
      url: "https://youtube.com",
      path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10 font-jakarta">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1.5fr] gap-16 mb-16">
        {/* --- COLUMN 1: BRAND & SOCIALS --- */}
        <div className="space-y-8">
          <Link to="/" className="flex items-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Shine & Span"
                className="h-10 w-auto object-contain"
              />
            ) : (
              <span className="text-xl font-black text-[#1e293b] tracking-tight">
                Shine <span className="text-[#448cff]">&</span> Span
              </span>
            )}
          </Link>
          <p className="text-gray-500 text-[15px] leading-relaxed max-w-sm font-medium">
            {location}
            {locationPostcodes ? ` (${locationPostcodes})` : ""}'s premier
            platform for cleaning professionals. <i>offering</i>
            flexible hours, top industry pay, and a supportive community for our
            self-employed team members.
          </p>

          {/* SOCIAL ICONS (STRICTURED TO MATCH YOUR IMAGE) */}
          <div className="flex gap-4">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 shadow-sm hover:bg-[#448cff]  hover:text-[white] hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* --- COLUMN 2: QUICK LINKS --- */}
        <div>
          <h4 className="font-black uppercase text-xs tracking-[0.2em] text-slate-400 mb-8">
            Navigation
          </h4>
          <ul className="space-y-4 font-bold text-slate-700">
            <li>
              <Link to="/" className="hover:text-[#448cff] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-[#448cff] transition-colors"
              >
                Our Mission
              </Link>
            </li>
            <li>
              <Link
                to="/apply"
                className="hover:text-[#448cff] transition-colors"
              >
                Apply to Work
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-[#448cff] transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* --- COLUMN 3: RECRUITMENT INFO --- */}
        <div>
          <h4 className="font-black uppercase text-xs tracking-[0.2em] text-slate-400 mb-8">
            Recruitment
          </h4>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Mail className="text-[#448cff]" size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">
                  Email Us
                </p>
                <p className="text-slate-800 font-bold hover:text-[#448cff] cursor-pointer transition-colors">
                  cleaning@shinespan.co.uk
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Phone className="text-[#448cff]" size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">
                  Phone Number
                </p>
                <p className="text-slate-800 font-bold hover:text-[#448cff] cursor-pointer transition-colors">
                  0738 464 7705{" "}
                  <span className="text-[12px]">(from 1pm till 7pm)</span>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <MapPin className="text-[#448cff]" size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">
                  Location
                </p>
                <p className="text-slate-800 font-bold">
                  22 Watford Road, Wembley, England, HA0 3EP
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM BAR --- */}
      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-400">
        <p>© 2025 Shine & Span Cleaning Services LTD.</p>
        <div className="flex gap-8">
          <Link to="/privacy" className="hover:text-[#448cff]">
            Privacy Policy
          </Link>
          <Link to="/TermsAndConditions" className="hover:text-[#448cff]">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
