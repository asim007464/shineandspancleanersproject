import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Homecomponents/Navbar";
import Footer from "../Components/Homecomponents/Footer";
import { useSiteSettings } from "../contexts/SiteSettingsContext";

const Home = () => {
  const { location, locationPostcodes } = useSiteSettings();
  return (
    <div className="font-jakarta">
      <Navbar />

      <section className="relative min-h-[90vh] md:py-0 py-10 flex flex-col items-center justify-center bg-[#0f1216] px-4 overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#448cff]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <span className="inline-block px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-[#448cff] text-[13px] font-black uppercase tracking-[0.2em] mb-8">
            Professional Cleaners Wanted – {location}
            {locationPostcodes ? ` (${locationPostcodes})` : ""}
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] mb-8">
            Seeking Energetic & <br />
            <span className="text-[#448cff]">Reliable Cleaners</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-3xl mx-auto">
            Join a progressive cleaning company expanding across {location}. We
            offer flexible daytime hours and the chance to work independently
            while feeling supported by a great team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/apply"
              className="w-full sm:w-auto bg-[#448cff] text-white px-12 py-5 rounded-sm font-black uppercase tracking-widest text-sm hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20"
            >
              Apply Now
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto border border-gray-600 text-white px-12 py-5 rounded-sm font-black uppercase tracking-widest text-sm hover:bg-white hover:text-slate-900 transition-all"
            >
              About the Role
            </Link>
          </div>
        </div>
      </section>

      {/* Our Standards Section */}
      <section className="bg-[#161a1f] py-20 px-4 border-y border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Our <span className="text-[#448cff]">Standards</span>
            </h2>
            <div className="w-20 h-1 bg-[#448cff] mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Standard 1 */}
            <div className="bg-[#0f1216] p-8 rounded-lg border border-gray-800 hover:border-[#448cff]/50 transition-colors">
              <h3 className="text-[#448cff] font-black uppercase tracking-widest text-sm mb-4">
                Excellence
              </h3>
              <p className="text-gray-300 leading-relaxed">
                We strive to deliver exceptional cleaning on every job, every
                time. We expect work to be done thoroughly, correctly, and to
                our standards at every visit. Anything less is not acceptable.
              </p>
            </div>

            {/* Standard 2 */}
            <div className="bg-[#0f1216] p-8 rounded-lg border border-gray-800 hover:border-[#448cff]/50 transition-colors">
              <h3 className="text-[#448cff] font-black uppercase tracking-widest text-sm mb-4">
                Precision
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Attention to detail matters. Corners, edges, and{" "}
                <i>often overlooked areas areas are just as important</i> . We
                expect cleaners to take responsibility for the quality of their
                work and to complete each job properly the first time.
              </p>
            </div>

            {/* Standard 3 */}
            <div className="bg-[#0f1216] p-8 rounded-lg border border-gray-800 hover:border-[#448cff]/50 transition-colors">
              <h3 className="text-[#448cff] font-black uppercase tracking-widest text-sm mb-4">
                Responsibility
              </h3>
              <p className="text-gray-300 leading-relaxed">
                We clean safely and responsibly using eco-friendly products that
                protect clients, their spaces, and your health. Reliability,
                professionalism, and teamwork are required, not optional.
              </p>
            </div>

            {/* Standard 4 */}
            <div className="bg-[#0f1216] p-8 rounded-lg border border-gray-800 hover:border-[#448cff]/50 transition-colors">
              <h3 className="text-[#448cff] font-black uppercase tracking-widest text-sm mb-4">
                Recognition
              </h3>
              <p className="text-gray-300 leading-relaxed">
                <i>
                  {" "}
                  Cleaners who consistently meet our standards and take pride in
                  doing the job right are supported and rewarded. Quality work
                  is noticed. Poor work is addressed.
                </i>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
