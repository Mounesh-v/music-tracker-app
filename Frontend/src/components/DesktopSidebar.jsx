import { NavLink } from "react-router-dom";
import { usePlayer } from "../Context/PlayerContext";
import { useAuth } from "../Context/AuthContext";
import {
  Home,
  Search,
  BarChart3,
  Grid3X3,
  Radio,
  Library,
  Heart,
  Clock,
  ListMusic,
  Music,
} from "lucide-react";

const PROMO_IMAGE =
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/tracks", icon: BarChart3, label: "Top Charts" },
  { to: "/songs", icon: Grid3X3, label: "Categories" },
  { to: "/radio", icon: Radio, label: "Radio" },
  { to: "/m/library", icon: Library, label: "Your Library" },
];

const libraryItems = [
  { to: "/m/library/liked", icon: Heart, label: "Liked Songs" },
  { to: "/m/library/albums", icon: ListMusic, label: "Albums" },
  { to: "/m/library/singers", icon: Clock, label: "Singers" },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-[#5FD0B3]/10 text-[#5FD0B3]"
      : "text-[#9CA3AF] hover:text-[#F0F2F5] hover:bg-white/[0.04]"
  }`;

export default function DesktopSidebar() {
  const { recentlyPlayed } = usePlayer();
  const { user } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 bg-[#0A0C11] border-r border-white/[0.06] overflow-y-auto scrollbar-hide">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-[#5FD0B3] flex items-center justify-center">
            <Music className="w-5 h-5 text-[#080D12]" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            <span className="text-white">Vibe</span>
            <span className="text-[#5FD0B3]">Tune</span>
          </span>
        </div>
        <p className="text-[11px] text-[#5C6370] font-medium tracking-wide mt-1 ml-[46px]">
          Vibe with Your Favorite Songs
        </p>
      </div>

      <nav className="px-4 space-y-0.5">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass}>
            <item.icon className="w-[18px] h-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mx-5 my-4 h-px bg-white/[0.06]" />

      <div className="px-4">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#5C6370]">
          Your Music
        </p>
        <div className="space-y-0.5">
          {libraryItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="mx-5 my-4 h-px bg-white/[0.06]" />

      {user && recentlyPlayed.length > 0 && (
        <div className="px-4 mb-4">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#5C6370]">
            Recently Played
          </p>
          <div className="space-y-0.5">
            {recentlyPlayed.slice(0, 4).map((track) => (
              <div
                key={track.id || track._id}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                {track.image && (
                  <img
                    src={track.image}
                    alt=""
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#F0F2F5] truncate">
                    {track.songName || track.title || track.name}
                  </p>
                  <p className="text-[10px] text-[#5C6370] truncate">
                    {track.singer || track.artist || "Unknown"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto p-4">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={PROMO_IMAGE}
            alt="Musician"
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C11] via-[#0A0C11]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-sm font-display font-bold text-white mb-0.5">
              Good music.
            </p>
            <p className="text-sm font-display font-bold text-white mb-1">
              Great vibes.
            </p>
            <p className="text-[11px] text-[#9CA3AF] mb-3">
              Handpicked songs for every mood.
            </p>
            <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#5FD0B3] text-[#080D12] hover:brightness-110 transition-all duration-150 active:scale-95">
              Explore Now
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
