import React, { useState, useEffect } from "react";
import { ShieldCheck, RotateCcw, Check } from "lucide-react";
import { rateLimit } from "../lib/security";

const WebsiteGuard = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState(false);
  const [target, setTarget] = useState({ name: "Vacuum Cleaner", id: 1 });
  const [shuffledImages, setShuffledImages] = useState([]);

  // Cleaning related images
  const images = [
    {
      id: 1,
      name: "Vacuum Cleaner",
      url: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&q=80",
    },
    {
      id: 2,
      name: "Cleaning Spray",
      url: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xlYW5pbmclMjBzcHJheXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 3,
      name: "Broom",
      url: "https://plus.unsplash.com/premium_photo-1664443944967-75316b3d2987?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnJvb218ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 4,
      name: "Bucket & Mop",
      url: "https://plus.unsplash.com/premium_photo-1677529007590-0c51011f3650?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QnVja2V0JTIwJTI2JTIwTW9wfGVufDB8fDB8fHww",
    },
  ];

  useEffect(() => {
    const verified = sessionStorage.getItem("site_verified_img");
    if (verified) {
      setIsVerified(true);
    } else {
      shuffleTarget();
    }
  }, []);

  const shuffleTarget = () => {
    const randomImg = images[Math.floor(Math.random() * images.length)];
    setTarget({ name: randomImg.name, id: randomImg.id });
    setShuffledImages([...images].sort(() => Math.random() - 0.5));
    setSelectedId(null);
    setError(false);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    // Rate limit guard verification attempts
    const rl = rateLimit("guard-verify", 10, 60000);
    if (!rl.allowed) {
      setError(true);
      return;
    }
    if (selectedId === target.id) {
      sessionStorage.setItem("site_verified_img", "true");
      setIsVerified(true);
    } else {
      setError(true);
    }
  };

  if (isVerified) return children;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0f1216] flex items-center justify-center font-jakarta px-6">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#448cff]/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10 w-full max-w-[450px] bg-white p-8 border border-gray-400 rounded-sm shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-[#448cff] rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
            Security Check
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Select the{" "}
            <span className="text-[#448cff] font-black">{target.name}</span> to
            enter.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          {/* Image Grid — shuffled order to prevent position guessing */}
          <div className="grid grid-cols-2 gap-3">
            {(shuffledImages.length ? shuffledImages : images).map((img) => (
              <div
                key={img.id}
                onClick={() => {
                  setSelectedId(img.id);
                  setError(false);
                }}
                className={`relative h-28 cursor-pointer overflow-hidden border-4 transition-all duration-200 ${
                  selectedId === img.id
                    ? "border-[#448cff] scale-[0.98]"
                    : "border-transparent hover:border-slate-200"
                }`}
              >
                <img
                  src={img.url}
                  alt="cleaning-tool"
                  className="w-full h-full object-cover"
                />

                {/* Checkmark overlay for selected item */}
                {selectedId === img.id && (
                  <div className="absolute inset-0 bg-[#448cff]/30 flex items-center justify-center animate-in fade-in zoom-in-50">
                    <div className="bg-white rounded-full p-1 shadow-lg">
                      <Check
                        size={18}
                        className="text-[#448cff]"
                        strokeWidth={4}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {error && (
            <p className="text-[10px] font-black text-red-500 uppercase text-center tracking-widest animate-bounce">
              Incorrect selection. Please try again.
            </p>
          )}

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={shuffleTarget}
              className="px-5 border border-gray-400 rounded-sm hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900"
            >
              <RotateCcw size={20} />
            </button>
            <button
              type="submit"
              disabled={!selectedId}
              className={`flex-1 py-4 rounded-sm font-black uppercase tracking-[0.2em] text-sm transition-all shadow-lg ${
                selectedId
                  ? "bg-[#448cff] text-white hover:bg-blue-600 shadow-blue-500/20"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }`}
            >
              Verify & Access
            </button>
          </div>
        </form>

        <div className="mt-8 text-center opacity-30 italic text-[10px] font-bold uppercase tracking-[0.3em]">
          ShineSpan Secure Entry
        </div>
      </div>
    </div>
  );
};

export default WebsiteGuard;
