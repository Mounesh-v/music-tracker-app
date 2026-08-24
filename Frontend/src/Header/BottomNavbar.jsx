import { NavLink } from "react-router-dom";
import { Home, Search, Library, BarChart3, User } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/m/search", icon: Search, label: "Search" },
  { to: "/m/library", icon: Library, label: "Library", featured: true },
  { to: "/tracks", icon: BarChart3, label: "Charts" },
  { to: "/m/profile", icon: User, label: "Profile" },
];

export default function BottomNavbar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-white/[0.06]"
      style={{ background: "rgba(8,13,18,0.95)", backdropFilter: "blur(20px)" }}
    >
      <div className="flex items-end justify-around px-2 pt-2 pb-2">
        {navItems.map((item) =>
          item.featured ? (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative flex flex-col items-center -mt-7 min-w-[56px]"
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-full border-4 transition-all duration-300 ${
                      isActive
                        ? "scale-105"
                        : "scale-100"
                    }`}
                    style={{
                      background: isActive
                        ? "linear-gradient(160deg, #6FE3C4 0%, #4CB89E 100%)"
                        : "linear-gradient(160deg, #1A2129 0%, #10161C 100%)",
                      borderColor: "#080D12",
                      boxShadow: isActive
                        ? "0 8px 20px -4px rgba(95,208,179,0.55), 0 0 0 1px rgba(95,208,179,0.15)"
                        : "0 6px 16px -4px rgba(0,0,0,0.5)",
                    }}
                  >
                    <item.icon
                      className={`w-6 h-6 transition-colors duration-300 ${
                        isActive ? "text-[#0A1410]" : "text-[#5FD0B3]"
                      }`}
                      strokeWidth={isActive ? 2.4 : 2}
                    />
                  </div>
                  <span
                    className={`mt-1.5 text-[10px] font-semibold tracking-wide transition-colors duration-200 ${
                      isActive ? "text-[#5FD0B3]" : "text-[#5C6370]"
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ) : (
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
          )
        )}
      </div>
    </nav>
  );
}
