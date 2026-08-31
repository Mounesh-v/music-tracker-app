import { useState, useEffect } from "react";
import { usePlayer } from "../Context/PlayerContext";
import {
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../Service/api";

export default function Tracks() {
  const { play } = usePlayer();

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const tracksPerPage = 12;

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const res = await api.get("/music/trending");
        setTracks(res.data?.songs || []);
      } catch {
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, []);

  const totalPages = Math.ceil(tracks.length / tracksPerPage);
  const startIndex = (currentPage - 1) * tracksPerPage;
  const endIndex = startIndex + tracksPerPage;
  const currentTracks = tracks.slice(startIndex, endIndex);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5FD0B3] mb-1.5">
            Charts
          </p>
          <h1 className="font-display text-xl md:text-3xl font-bold text-white">
            Top Charts
          </h1>
          {!loading && tracks.length > 0 && (
            <p className="text-sm text-[#5C6370] mt-2">
              Showing {startIndex + 1}–{Math.min(endIndex, tracks.length)} of {tracks.length} tracks
            </p>
          )}
        </div>

        {loading ? (
          <div className="space-y-2 md:space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl bg-[#15171E] border border-white/[0.06]">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#111318] animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-[#111318] rounded-lg w-1/3 animate-pulse" />
                  <div className="h-3 bg-[#111318] rounded-lg w-1/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : tracks.length > 0 ? (
          <>
            <div className="space-y-1.5 md:space-y-2">
              {currentTracks.map((track, index) => {
                const chartPosition = startIndex + index + 1;
                const isTop3 = chartPosition <= 3;

                return (
                  <div
                    key={track.id || track._id || index}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    onClick={() => play(track, tracks)}
                  >
                    <span className={`w-7 md:w-8 text-center font-display font-bold text-xs md:text-sm ${isTop3 ? "text-[#5FD0B3]" : "text-[#5C6370]"}`}>
                      {chartPosition}
                    </span>

                    {track.image && (
                      <img
                        src={track.image}
                        alt={track.title || "Song"}
                        className="w-11 h-11 md:w-14 md:h-14 rounded-xl object-cover"
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-white truncate">
                        {track.title || track.songName || track.name}
                      </p>
                      <p className="text-[11px] md:text-xs text-[#9CA3AF] truncate">
                        {track.artist || track.singer || "Unknown"}
                      </p>
                    </div>

                    {track.language && (
                      <span className="hidden sm:block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-[#5FD0B3]/10 text-[#5FD0B3]">
                        {track.language}
                      </span>
                    )}

                    <button
                      onClick={(e) => { e.stopPropagation(); play(track, tracks); }}
                      className="p-2 md:p-2.5 rounded-xl text-[#5C6370] opacity-0 group-hover:opacity-100 hover:text-[#5FD0B3] hover:bg-[#5FD0B3]/10 transition-all"
                    >
                      <Play className="w-4 h-4" fill="currentColor" />
                    </button>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 md:gap-3 mt-8 md:mt-10">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl border border-white/[0.08] text-white hover:bg-[#5FD0B3]/10 hover:text-[#5FD0B3] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-xl text-xs md:text-sm font-medium transition-all ${
                      currentPage === page
                        ? "bg-[#5FD0B3] text-[#080D12]"
                        : "border border-white/[0.08] text-[#9CA3AF] hover:border-[#5FD0B3]/40 hover:text-[#5FD0B3]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl border border-white/[0.08] text-white hover:bg-[#5FD0B3]/10 hover:text-[#5FD0B3] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[200px] rounded-2xl border border-white/[0.06] bg-[#15171E] text-[#5C6370] text-sm">
            No tracks available
          </div>
        )}
      </div>
    </div>
  );
}
