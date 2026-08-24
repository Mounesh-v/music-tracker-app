import { useState } from "react";
import { usePlayer } from "../Context/PlayerContext";
import { Search, Play, X } from "lucide-react";
import api from "../Service/api";

export default function SearchModule({ onResult }) {
  const { play } = usePlayer();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await api.get(`/music/search?q=${encodeURIComponent(query.trim())}&limit=10`);
      const songs = res.data?.data || [];
      setSuggestions(songs);
      if (onResult) {
        onResult({ songs, search: query.trim(), count: songs.length });
      }
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (song) => {
    play(song, suggestions);
    setSuggestions([]);
    setQuery("");
  };

  return (
    <section className="py-6 md:py-10 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 md:mb-6">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5FD0B3] mb-1.5">
            Discover
          </p>
          <h2 className="font-display text-lg md:text-2xl font-bold text-white">
            Search Music
          </h2>
        </div>

        <form onSubmit={handleSearch} className="relative mb-4 md:mb-6">
          <div className="flex items-center gap-3 px-4 md:px-5 py-3 md:py-3.5 rounded-2xl bg-[#15171E] border border-white/[0.06] focus-within:border-[#5FD0B3]/40 transition-all duration-200">
            <Search className="w-4 h-4 md:w-5 md:h-5 text-[#5C6370]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs, artists, albums..."
              className="bg-transparent text-sm text-white placeholder-[#5C6370] outline-none w-full"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setSuggestions([]); }}
                className="p-1 rounded-lg text-[#5C6370] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-4 md:px-5 py-2 rounded-xl text-xs font-semibold bg-[#5FD0B3] text-[#080D12] hover:brightness-110 active:scale-95 transition-all duration-150"
            >
              {loading ? "..." : "Search"}
            </button>
          </div>
        </form>

        {suggestions.length > 0 && (
          <div className="space-y-1">
            {suggestions.map((song, i) => (
              <div
                key={song.id || i}
                className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group"
                onClick={() => handleSelect(song)}
              >
                {song.image && (
                  <img src={song.image} alt="" className="w-9 h-9 md:w-10 md:h-10 rounded-lg object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {song.title || song.songName || song.name}
                  </p>
                  <p className="text-xs text-[#9CA3AF] truncate">
                    {song.artist || song.singer || "Unknown"}
                  </p>
                </div>
                <button className="p-2 rounded-lg text-[#5C6370] opacity-0 group-hover:opacity-100 hover:text-[#5FD0B3] transition-all">
                  <Play className="w-4 h-4" fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
