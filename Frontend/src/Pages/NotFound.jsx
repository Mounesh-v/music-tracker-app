import { Link } from "react-router-dom";
import { Headphones, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-3xl bg-[#5FD0B3]/10 flex items-center justify-center mx-auto mb-6">
          <Headphones className="w-10 h-10 text-[#5FD0B3]" />
        </div>

        <h1 className="font-display text-6xl font-bold text-white mb-2">404</h1>
        <h2 className="font-display text-xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-sm text-[#9CA3AF] mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to the music.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#5FD0B3] text-[#080D12] hover:brightness-110 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            to="/search"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.06] text-white hover:bg-white/[0.1] active:scale-95 transition-all border border-white/[0.06]"
          >
            <Search className="w-4 h-4" />
            Search
          </Link>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-10">
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
