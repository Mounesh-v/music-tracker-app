import { useState, useEffect } from "react";
import api from "../Service/api";
import SongCard from "../components/SongCard";
import MusicFilters from "../components/MusicFilters";
import Pagination from "../components/Pagination";

export default function SongList() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [language, setLanguage] = useState("All");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async (p = page, lang = language, cat = category) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 30 });
      if (lang !== "All") params.set("language", lang);
      if (cat !== "All") params.set("category", cat);

      const res = await api.get(`/music/discover?${params.toString()}`);
      setSongs(res.data?.songs || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch {
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setPage(1);
    fetchSongs(1, lang, category);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
    fetchSongs(1, language, cat);
  };

  const handlePageChange = (p) => {
    setPage(p);
    fetchSongs(p, language, category);
  };

  return (
    <div className="min-h-screen px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5FD0B3] mb-1.5">
            Categories
          </p>
          <h1 className="font-display text-xl md:text-3xl font-bold text-white">
            Discover Music
          </h1>
        </div>

        <MusicFilters
          activeLanguage={language}
          activeCategory={category}
          onLanguageChange={handleLanguageChange}
          onCategoryChange={handleCategoryChange}
        />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-[#15171E] border border-white/[0.06]">
                <div className="w-full aspect-square bg-[#111318] animate-pulse" />
                <div className="p-3 md:p-4 space-y-2">
                  <div className="h-3.5 bg-[#111318] rounded-lg w-3/4 animate-pulse" />
                  <div className="h-3 bg-[#111318] rounded-lg w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : songs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
            {songs.map((song, index) => (
              <SongCard key={song.id || index} song={song} queue={songs} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 min-h-[200px] rounded-2xl border border-white/[0.06] bg-[#15171E]">
            <p className="text-[#9CA3AF] text-sm">No songs found</p>
            <button
              onClick={() => fetchSongs()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#5FD0B3] text-[#080D12] hover:brightness-110 transition-all"
            >
              Refresh
            </button>
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
