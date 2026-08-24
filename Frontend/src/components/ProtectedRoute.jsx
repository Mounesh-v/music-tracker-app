import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useLoginPopup } from "../Context/LoginPopupContext";
import { Headphones } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { openLogin } = useLoginPopup();

  useEffect(() => {
    if (!loading && !user) {
      openLogin("You need to be logged in to access this page.");
    }
  }, [loading, user, openLogin]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#5FD0B3] flex items-center justify-center animate-pulse-glow">
            <Headphones className="w-6 h-6 text-[#080D12]" />
          </div>
          <div className="flex items-end gap-[3px] h-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="waveform-bar"
                data-active="true"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#5FD0B3]/15 flex items-center justify-center mx-auto mb-4">
            <Headphones className="w-8 h-8 text-[#5FD0B3]" />
          </div>
          <h2 className="font-display text-lg font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-sm text-[#5C6370] mb-4">You need to be logged in to access this page.</p>
          <button
            onClick={() => openLogin("You need to be logged in to access this page.")}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#5FD0B3] text-[#080D12] hover:brightness-110 active:scale-95 transition-all"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return children;
}
