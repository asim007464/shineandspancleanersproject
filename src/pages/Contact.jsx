import React from "react";

import Navbar from "../Components/Homecomponents/Navbar";

import Footer from "../Components/Homecomponents/Footer";
const Contact = () => {
  const topCards = [
    {
      title: "Phone",
      value: "0738 464 7705",
      sub: "Available from 1 PM to 7 PM",
      btn: "Call Now",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
    },
    {
      title: "Email",
      value: "cleaning@shinespan.co.uk",
      btn: "Send Email",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Service Area",
      value: "All over london",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      title: "Business Hours",
      value: "Mon-Sun: 7AM-8PM",
      sub: "",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <Navbar></Navbar>
      <div className="bg-[#fcfdfe] font-jakarta ">
        {/* --- HEADER --- */}
        <section className="py-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] mb-6 tracking-tight">
            Shine <span className="text-[#448cff]"> & </span> Span Cleaning
            Services Ltd
          </h1>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed font-medium max-w-2xl mx-auto">
            Ready to experience professional cleaning services? Get in touch
            with us today for a free quote or to schedule your cleaning service.
          </p>
        </section>

        {/* --- TOP 4 CARDS --- */}
        <section className="max-w-7xl mx-auto px-4 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-2xl hover:shadow-blue-100/60 hover:-translate-y-3 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-blue-50 text-[#448cff] rounded-full flex items-center justify-center mb-6">
                  {card.icon}
                </div>
                <h3 className="text-lg font-black text-[#1e293b] mb-4">
                  {card.title}
                </h3>
                <div className="mb-6 flex-1">
                  <p className="text-gray-500 font-medium text-sm">
                    {card.value}
                  </p>
                  {card.sub && (
                    <p className="text-gray-400 text-xs mt-1">{card.sub}</p>
                  )}
                </div>
                {card.btn && (
                  <button className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-bold text-[#1e293b] hover:border-[#448cff] hover:text-[#448cff] transition-all">
                    {card.btn}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Contact;
