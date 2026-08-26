import { useState, useEffect } from "react";
import {
  User,
  ChevronRight,
  Shield,
  HelpCircle,
  LogOut,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { getLikedSongs } from "../Service/songApi";

const SETTINGS = [
  { icon: Heart, label: "Liked Songs", route: "/m/library/liked" },
  { icon: Shield, label: "Privacy", route: "/privacy" },
  { icon: HelpCircle, label: "Help & Support", route: "/help-support" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [likedCount, setLikedCount] = useState(0);

  useEffect(() => {
    const fetchLikedCount = async () => {
      try {
        const data = await getLikedSongs();
        setLikedCount((data.likedSongs || []).length);
      } catch (error) {
        console.error("Error fetching liked songs:", error);
      }
    };
    fetchLikedCount();
  }, []);

  return (
    <div className="min-h-screen pb-40">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h1 className="font-display text-2xl font-bold text-white">Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="px-4 mb-5">
        <div
          className="rounded-2xl p-5 border border-white/[0.06]"
          style={{ background: "#11131A" }}
        >
          <div className="flex items-center gap-4 mb-4">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt=""
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#5FD0B3]/15 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-[#5FD0B3]" />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-lg font-display font-bold text-white truncate">
                {user?.name || "User"}
              </h2>
              <p className="text-sm text-[#5C6370] truncate">
                {user?.email || ""}
              </p>
              {user?.bio && (
                <p className="text-xs text-[#9CA3AF] truncate mt-0.5">{user.bio}</p>
              )}
            </div>
          </div>
          <button className="w-full py-2.5 rounded-xl text-xs font-semibold border border-[#5FD0B3]/30 text-[#5FD0B3] hover:bg-[#5FD0B3]/10 transition-all">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center rounded-2xl p-3 border border-white/[0.06]" style={{ background: "#11131A" }}>
            <p className="text-lg font-display font-bold text-[#5FD0B3]">{likedCount}</p>
            <p className="text-[10px] text-[#5C6370]">Liked Songs</p>
          </div>
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
              <button
                onClick={() => item.route && navigate(item.route)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#1A2129] flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-[#5C6370]" />
                </div>
                <span className="flex-1 text-sm font-medium text-white text-left">
                  {item.label}
                </span>
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
