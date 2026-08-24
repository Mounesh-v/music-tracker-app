import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../Service/api";
import SongCard from "../components/SongCard";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      doSearch(q);
    }
  }, [searchParams]);

  const doSearch = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/music/search?q=${encodeURIComponent(q.trim())}&limit=20`);
      setSongs(res.data?.data || []);
    } catch {
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
    doSearch(query);
  };

  return (
    <div className="min-h-screen px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5FD0B3] mb-1.5">
            Discover
          </p>
          <h1 className="font-display text-xl md:text-3xl font-bold text-white">
            Search
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 px-4 md:px-5 py-3 md:py-3.5 rounded-2xl bg-[#15171E] border border-white/[0.06] focus-within:border-[#5FD0B3]/40 transition-all duration-200">
            <Search className="w-4 h-4 md:w-5 md:h-5 text-[#5C6370]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs, artists, albums..."
              className="bg-transparent text-sm text-white placeholder-[#5C6370] outline-none w-full"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 md:px-5 py-2 rounded-xl text-xs font-semibold bg-[#5FD0B3] text-[#080D12] hover:brightness-110 active:scale-95 transition-all duration-150"
            >
              Search
            </button>
          </div>
        </form>

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
        ) : searched && songs.length > 0 ? (
          <>
            <p className="text-sm text-[#9CA3AF] mb-4">
              <span className="font-mono text-white font-medium">{songs.length}</span> results
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
              {songs.map((song, index) => (
                <SongCard key={song.id || index} song={song} queue={songs} />
              ))}
            </div>
          </>
        ) : searched ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] rounded-2xl border border-white/[0.06] bg-[#15171E]">
            <p className="text-[#9CA3AF] text-sm">No results found</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[200px] rounded-2xl border border-white/[0.06] bg-[#15171E]">
            <Search className="w-8 h-8 md:w-10 md:h-10 text-[#5C6370] mb-3" />
            <p className="text-[#9CA3AF] text-sm">Start typing to search</p>
          </div>
        )}
      </div>
    </div>
  );
}
