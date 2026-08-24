import {
  Bell,
  Settings,
  User,
  Crown,
  ChevronRight,
  Shield,
  Download,
  Play,
  BellRing,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";

const SETTINGS = [
  { icon: User, label: "Account" },
  { icon: Play, label: "Playback" },
  { icon: Download, label: "Downloads" },
  { icon: Shield, label: "Privacy" },
  { icon: BellRing, label: "Notifications" },
  { icon: HelpCircle, label: "Help & Support" },
];

export default function MobileProfile() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen pb-40">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h1 className="font-display text-2xl font-bold text-white">Profile</h1>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-white/[0.06] transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#5FD0B3]" />
          </button>
          <button className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-white/[0.06] transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-4 mb-5">
        <div
          className="rounded-2xl p-5 border border-white/[0.06]"
          style={{ background: "#11131A" }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-[#5FD0B3]/15 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-[#5FD0B3]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-display font-bold text-white truncate">
                {user?.name || "Vibe Lover"}
              </h2>
              <p className="text-sm text-[#5C6370] truncate">{user?.email || "user@vibetune.com"}</p>
            </div>
          </div>
          <button className="w-full py-2.5 rounded-xl text-xs font-semibold border border-[#5FD0B3]/30 text-[#5FD0B3] hover:bg-[#5FD0B3]/10 transition-all">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-5">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Playlists", value: 12 },
            { label: "Liked", value: 124 },
            { label: "Following", value: 48 },
            { label: "Followers", value: 312 },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-display font-bold text-[#5FD0B3]">{stat.value}</p>
              <p className="text-[10px] text-[#5C6370]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Upsell */}
      <div className="px-4 mb-5">
        <div
          className="relative rounded-2xl p-4 border border-[#5FD0B3]/20 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(95,208,179,0.12), rgba(58,158,133,0.06))",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5FD0B3]/20 flex items-center justify-center flex-shrink-0">
              <Crown className="w-5 h-5 text-[#5FD0B3]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display font-bold text-white">VibeTune Premium</p>
              <p className="text-[11px] text-[#9CA3AF]">Unlock unlimited downloads & no ads</p>
            </div>
            <button className="px-4 py-2 rounded-xl text-[11px] font-semibold bg-[#5FD0B3] text-[#080D12] flex-shrink-0 active:scale-95 transition-all">
              Go Premium
            </button>
          </div>
          <ChevronRight className="absolute top-4 right-4 w-4 h-4 text-[#5C6370] opacity-50" />
        </div>
      </div>

      {/* Settings List */}
      <div className="px-4">
        <div
          className="rounded-2xl border border-white/[0.06] overflow-hidden"
          style={{ background: "#11131A" }}
        >
          {SETTINGS.map((item, i) => (
            <div key={item.label}>
              {i > 0 && <div className="h-px bg-white/[0.04] ml-14" />}
              <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#1A2129] flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-[#5C6370]" />
                </div>
                <span className="flex-1 text-sm font-medium text-white text-left">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-[#5C6370]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <div className="px-4 mt-5">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/[0.06] text-sm font-medium text-[#9CA3AF] hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
