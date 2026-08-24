import { motion as Motion } from "framer-motion";
import { Play, Shuffle } from "lucide-react";
import { usePlayer } from "../Context/PlayerContext";

const HERO_IMAGE = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=80";

export default function Hero() {
  const { play } = usePlayer();

  const handlePlayNow = () => {
    play(
      {
        id: "hero-1",
        title: "Midnight Frequency",
        artist: "VibeTune Radio",
        image: HERO_IMAGE,
      },
      []
    );
  };

  return (
    <>
      {/* Desktop Hero */}
      <section className="hidden md:block relative w-full h-[360px] lg:h-[400px] rounded-3xl overflow-hidden mb-10">
        <div className="absolute inset-0 flex">
          <div className="relative z-10 flex flex-col justify-center w-1/2 p-10 lg:p-14">
            <Motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5FD0B3] mb-3"
            >
              Discover &middot; Stream &middot; Vibe
            </Motion.p>

            <Motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display text-3xl lg:text-5xl font-bold leading-[1.1] text-white mb-4"
            >
              Find Your Next{" "}
              <span className="text-[#5FD0B3]">Favorite Sound</span>
            </Motion.h1>

            <Motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-sm text-[#9CA3AF] leading-relaxed mb-6 max-w-md"
            >
              Discover songs across languages, moods and genres. Your next vibe is waiting.
            </Motion.p>

            <Motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex items-center gap-3"
            >
              <button
                onClick={handlePlayNow}
                className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#5FD0B3] text-[#080D12] text-sm font-semibold hover:brightness-110 active:scale-95 transition-all duration-150"
              >
                <Play className="w-4 h-4" fill="currentColor" />
                Play Now
              </button>
              <button
                onClick={handlePlayNow}
                className="flex items-center gap-2.5 px-6 py-3 rounded-2xl border border-white/[0.12] text-white text-sm font-semibold hover:bg-white/[0.06] active:scale-95 transition-all duration-150"
              >
                <Shuffle className="w-4 h-4" />
                Shuffle Play
              </button>
            </Motion.div>
          </div>

          <div className="relative w-1/2">
            <img
              src={HERO_IMAGE}
              alt="Concert"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080D12] via-[#080D12]/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* Mobile Hero */}
      <section className="md:hidden relative w-full h-[260px] rounded-2xl overflow-hidden mb-6">
        <img
          src={HERO_IMAGE}
          alt="Concert"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080D12] via-[#080D12]/70 to-[#080D12]/20" />

        <div className="relative z-10 flex flex-col justify-end h-full p-6">
          <Motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#5FD0B3] mb-2"
          >
            Discover &middot; Stream &middot; Vibe
          </Motion.p>

          <Motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-display text-2xl font-bold leading-[1.15] text-white mb-2"
          >
            Find Your Next{" "}
            <span className="text-[#5FD0B3]">Favorite Sound</span>
          </Motion.h1>

          <Motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="text-xs text-[#9CA3AF] leading-relaxed mb-4 line-clamp-2"
          >
            Discover songs across languages, moods and genres.
          </Motion.p>

          <Motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center gap-2.5"
          >
            <button
              onClick={handlePlayNow}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5FD0B3] text-[#080D12] text-xs font-semibold hover:brightness-110 active:scale-95 transition-all duration-150"
            >
              <Play className="w-3.5 h-3.5" fill="currentColor" />
              Play Now
            </button>
            <button
              onClick={handlePlayNow}
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.12] text-white hover:bg-white/[0.06] active:scale-95 transition-all duration-150"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </Motion.div>
        </div>
      </section>
    </>
  );
}
