import { NavLink } from "react-router-dom";
import { Home, Search, Library, BarChart3, User } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/songs", icon: Library, label: "Library" },
  { to: "/tracks", icon: BarChart3, label: "Charts" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function BottomNavbar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-white/[0.06]"
      style={{ background: "rgba(8,13,18,0.95)", backdropFilter: "blur(20px)" }}
    >
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[48px] ${
                isActive
                  ? "text-[#5FD0B3]"
                  : "text-[#5C6370] hover:text-[#9CA3AF]"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
