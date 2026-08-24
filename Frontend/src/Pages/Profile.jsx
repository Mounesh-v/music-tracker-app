import { useAuth } from "../Context/AuthContext";
import { usePlayer } from "../Context/PlayerContext";
import { LogOut, Music, Clock, Heart, User } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const { recentlyPlayed } = usePlayer();

  return (
    <div className="min-h-screen px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5FD0B3] mb-1.5">
            Account
          </p>
          <h1 className="font-display text-xl md:text-3xl font-bold text-white">
            Your Profile
          </h1>
        </div>

        <div
          className="rounded-3xl p-6 md:p-8 mb-6 md:mb-8"
          style={{
            background: "#111318",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-4 md:gap-5 mb-6">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#5FD0B3]/15 flex items-center justify-center">
              <User className="w-7 h-7 md:w-8 md:h-8 text-[#5FD0B3]" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-display font-bold text-white">
                {user?.name || "Vibe Lover"}
              </h2>
              <p className="text-sm text-[#9CA3AF]">{user?.email || "user@vibetune.com"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: Music, label: "Songs Played", value: recentlyPlayed.length },
              { icon: Clock, label: "Hours Listened", value: Math.floor(recentlyPlayed.length * 3.5) },
              { icon: Heart, label: "Liked Songs", value: 0 },
              { icon: User, label: "Member Since", value: "2026" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-3 md:p-4 rounded-2xl bg-[#15171E] border border-white/[0.06]"
              >
                <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-[#5FD0B3] mb-2" />
                <p className="text-base md:text-lg font-display font-bold text-white">{stat.value}</p>
                <p className="text-[10px] md:text-[11px] text-[#5C6370]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-[#9CA3AF] hover:text-red-400 hover:bg-red-500/10 border border-white/[0.06] hover:border-red-500/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
