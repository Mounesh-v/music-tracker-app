import { createContext, useContext, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { X, Headphones, Music } from "lucide-react";

const LoginPopupContext = createContext(null);

export function LoginPopupProvider({ children }) {
  const [show, setShow] = useState(false);
  const [subtitle, setSubtitle] = useState("Sign in to play songs, search music, and build your library.");

  const openLogin = useCallback((customSubtitle) => {
    setSubtitle(customSubtitle || "Sign in to play songs, search music, and build your library.");
    setShow(true);
  }, []);
  const closeLogin = useCallback(() => setShow(false), []);

  return (
    <LoginPopupContext.Provider value={{ openLogin, closeLogin, show, subtitle }}>
      {children}
    </LoginPopupContext.Provider>
  );
}

export const useLoginPopup = () => {
  const ctx = useContext(LoginPopupContext);
  if (!ctx) throw new Error("useLoginPopup must be used within LoginPopupProvider");
  return ctx;
};

export function LoginPopupRenderer() {
  const { show, closeLogin, subtitle } = useContext(LoginPopupContext);
  if (!show) return null;
  return <LoginPopup onClose={closeLogin} subtitle={subtitle} />;
}

function LoginPopup({ onClose, subtitle }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(8,13,18,0.88)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl p-8 text-center"
        style={{
          background: "#111318",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#5C6370] hover:text-white hover:bg-white/[0.06] transition-all"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-[#5FD0B3] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#5FD0B3]/20">
          <Headphones className="w-8 h-8 text-[#080D12]" />
        </div>

        <h2 className="font-display text-xl font-bold text-white mb-2">
          Login to VibeTune
        </h2>
        <p className="text-sm text-[#9CA3AF] mb-6 leading-relaxed">
          {subtitle}
        </p>

        <div className="flex items-center justify-center gap-1.5 mb-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="waveform-bar"
              data-active="true"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>

        <Link
          to="/login"
          onClick={onClose}
          className="block w-full py-3 rounded-xl text-sm font-semibold bg-[#5FD0B3] text-[#080D12] hover:brightness-110 active:scale-[0.98] transition-all duration-150 mb-3"
        >
          Sign In
        </Link>

        <p className="text-xs text-[#5C6370]">
          Don&apos;t have an account?{" "}
          <Link to="/signup" onClick={onClose} className="text-[#5FD0B3] hover:underline font-medium">
            Sign up
          </Link>
        </p>

        <div className="flex items-center justify-center gap-2 mt-5 pt-5 border-t border-white/[0.06]">
          <Music className="w-3.5 h-3.5 text-[#5C6370]" />
          <span className="text-[11px] text-[#5C6370]">Vibe with Your Favorite Songs</span>
        </div>
      </div>
    </div>
  );
}
