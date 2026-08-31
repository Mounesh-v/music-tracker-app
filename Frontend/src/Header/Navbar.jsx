import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Music,
  Home,
  BarChart3,
  Grid3X3,
  Headphones,
  Library,
  Heart,
  LogIn,
  Search,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";

const drawerNavItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/tracks", icon: BarChart3, label: "Top Charts" },
  { to: "/songs", icon: Grid3X3, label: "Categories" },
  { to: "/devotional", icon: Headphones, label: "Devotional" },
  { to: "/m/library", icon: Library, label: "Your Library" },
];

const drawerLibraryItems = [
  { to: "/m/library/liked", icon: Heart, label: "Liked Songs" },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const { user } = useAuth();

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "";
  const userName = user?.name || "";

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const closeDrawer = () => {
    setClosing(true);
    setTimeout(() => {
      setDrawerOpen(false);
      setClosing(false);
    }, 250);
  };

  const handleNavClick = () => {
    closeDrawer();
  };

  return (
    <>
      {/* Mobile Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-14 lg:hidden flex items-center justify-between px-4 border-b border-white/[0.06]"
        style={{
          background: "rgba(8,13,18,0.92)",
          backdropFilter: "blur(20px)",
        }}
      >
        {user ? (
          <button
            onClick={() => {
              setDrawerOpen(true);
              setClosing(false);
            }}
            className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-white/[0.06] transition-all"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-9" />
        )}

        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#5FD0B3] flex items-center justify-center">
            <Music className="w-4 h-4 text-[#080D12]" />
          </div>
          <span className="font-display text-base font-bold">
            <span className="text-white">Vibe</span>
            <span className="text-[#5FD0B3]">Tune</span>
          </span>
        </Link>

        {user ? (
          <Link
            to="/m/profile"
            className="w-8 h-8 rounded-full bg-[#5FD0B3]/15 flex items-center justify-center text-[#5FD0B3] text-xs font-bold"
          >
            {userInitial}
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-[#5FD0B3] text-[#080D12]"
          >
            <LogIn className="w-3.5 h-3.5" />
            Login
          </Link>
        )}
      </header>

      {/* Mobile Drawer */}
      {drawerOpen && user && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className={`absolute inset-0 bg-black/60 ${closing ? "animate-fade-out" : "animate-fade-in"}`}
            onClick={closeDrawer}
          />
          <nav
            className={`absolute top-0 left-0 bottom-0 w-[80%] max-w-[320px] flex flex-col bg-[#0A0C11] border-r border-white/[0.06] shadow-2xl ${
              closing ? "animate-slide-out-left" : "animate-slide-in-left"
            }`}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#5FD0B3] flex items-center justify-center">
                  <Music className="w-4 h-4 text-[#080D12]" />
                </div>
                <span className="font-display text-base font-bold">
                  <span className="text-white">Vibe</span>
                  <span className="text-[#5FD0B3]">Tune</span>
                </span>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-xl text-[#5C6370] hover:text-white hover:bg-white/[0.06] transition-all"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 px-3">
              <div className="space-y-0.5 mb-4">
                {drawerNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-[#5FD0B3]/10 text-[#5FD0B3]"
                          : "text-[#9CA3AF] hover:text-[#F0F2F5] hover:bg-white/[0.04]"
                      }`
                    }
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <div className="mx-3 my-3 h-px bg-white/[0.06]" />

              <div>
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#5C6370]">
                  Your Music
                </p>
                <div className="space-y-0.5">
                  {drawerLibraryItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-[#5FD0B3]/10 text-[#5FD0B3]"
                            : "text-[#9CA3AF] hover:text-[#F0F2F5] hover:bg-white/[0.04]"
                        }`
                      }
                    >
                      <item.icon className="w-[18px] h-[18px]" />
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {/* <div className="p-4 border-t border-white/[0.06]">
              <div
                className="relative rounded-2xl overflow-hidden p-4"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(95,208,179,0.12), rgba(58,158,133,0.06))",
                  border: "1px solid rgba(95,208,179,0.15)",
                }}
              >
                <p className="text-sm font-display font-bold text-white mb-0.5">
                  Good music.
                </p>
                <p className="text-sm font-display font-bold text-white mb-1">
                  Great vibes.
                </p>
                <p className="text-[11px] text-[#9CA3AF] mb-3">
                  Handpicked songs for every mood.
                </p>
                <button
                  onClick={handleNavClick}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#5FD0B3] text-[#080D12] hover:brightness-110 transition-all duration-150 active:scale-95"
                >
                  Explore Now
                </button>
              </div>
            </div> */}
          </nav>
        </div>
      )}

      {/* Desktop Top Navigation */}
      <header
        className={`hidden lg:flex fixed top-0 right-0 z-50 h-16 items-center justify-between px-8 border-b border-white/[0.06] ${
          user ? "left-[260px]" : "left-0"
        }`}
        style={{
          background: "rgba(8,13,18,0.85)",
          backdropFilter: "blur(20px)",
        }}
      >
        {!user && (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#5FD0B3] flex items-center justify-center">
              <Music className="w-5 h-5 text-[#080D12]" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              <span className="text-white">Vibe</span>
              <span className="text-[#5FD0B3]">Tune</span>
            </span>
          </div>
        )}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08] hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-[#5FD0B3]/15 flex items-center justify-center text-[#5FD0B3] text-xs font-bold">
                {userInitial}
              </div>
              <div className="hidden xl:block">
                <p className="text-sm font-medium text-white leading-none">
                  {userName}
                </p>
              </div>
              <svg
                className="w-4 h-4 text-[#5C6370]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#5FD0B3] text-[#080D12] hover:brightness-110 active:scale-95 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              Login
            </Link>
          )}
        </div>
      </header>
    </>
  );
}
