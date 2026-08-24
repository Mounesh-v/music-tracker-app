import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Headphones } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#5FD0B3] flex items-center justify-center animate-pulse-glow">
            <Headphones className="w-6 h-6 text-[#080A0F]" />
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
    return <Navigate to="/login" replace />;
  }

  return children;
}
