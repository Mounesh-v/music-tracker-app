import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Mic, X, Music, Download, Play, Pause } from "lucide-react";
import { usePlayer } from "../Context/PlayerContext";
import api from "../Service/api";

const STORAGE_KEY = "vibetune-recent-searches";

const CATEGORIES = [
  { name: "Pop", icon: "🎵", count: 1240, gradient: "from-pink-500/30 to-purple-600/20" },
  { name: "Hip Hop", icon: "🎤", count: 860, gradient: "from-orange-500/30 to-red-600/20" },
  { name: "Romance", icon: "❤️", count: 920, gradient: "from-rose-500/30 to-pink-600/20" },
  { name: "Rock", icon: "🎸", count: 540, gradient: "from-slate-500/30 to-zinc-600/20" },
  { name: "Workout", icon: "💪", count: 380, gradient: "from-emerald-500/30 to-teal-600/20" },
  { name: "Chill", icon: "🎧", count: 710, gradient: "from-blue-500/30 to-indigo-600/20" },
];

const TOP_ARTISTS = [
  { name: "Arijit Singh", songs: 342, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Shreya Ghoshal", songs: 289, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
  { name: "Anirudh", songs: 198, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
  { name: "Pritam", songs: 156, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "AP Dhillon", songs: 124, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80" },
  { name: "A.R. Rahman", songs: 410, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80" },
  { name: "Badshah", songs: 178, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Neha Kakkar", songs: 256, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
];

function loadRecent() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecent(items) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // silent
  }
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { play, currentTrack, isPlaying, togglePlay } = usePlayer();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [recentSearches, setRecentSearches] = useState(loadRecent);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    saveRecent(recentSearches);
  }, [recentSearches]);

  useEffect(() => {
    const initialQ = new URLSearchParams(window.location.search).get("q");
    if (initialQ) {
      setQuery(initialQ);
      setLoading(true);
      setSearched(true);
      api.get(`/music/search?q=${encodeURIComponent(initialQ.trim())}&limit=20`).then((res) => {
        setResults(res.data?.data || []);
        const trimmed = initialQ.trim();
        if (trimmed) {
          setRecentSearches((prev) => {
            const filtered = prev.filter((r) => r.name.toLowerCase() !== trimmed.toLowerCase());
            return [{ id: Date.now(), name: trimmed }, ...filtered].slice(0, 10);
          });
        }
      }).catch(() => setResults([])).finally(() => setLoading(false));
    }
  }, []);

  const addToRecent = useCallback((term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((r) => r.name.toLowerCase() !== trimmed.toLowerCase());
      return [{ id: Date.now(), name: trimmed }, ...filtered].slice(0, 10);
    });
  }, []);

  const removeRecent = useCallback((id) => {
    setRecentSearches((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const clearAll = useCallback(() => setRecentSearches([]), []);

  const doSearch = useCallback(async (term) => {
    if (!term.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/music/search?q=${encodeURIComponent(term.trim())}&limit=20`);
      setResults(res.data?.data || []);
      addToRecent(term.trim());
      setSearchParams(term ? { q: term } : {});
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [addToRecent, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    doSearch(query);
  };

  const handleCategoryClick = (catName) => {
    setQuery(catName);
    doSearch(catName);
  };

  const handleArtistClick = (artistName) => {
    setQuery(artistName);
    doSearch(artistName);
  };

  const handleRecentClick = (name) => {
    setQuery(name);
    doSearch(name);
  };

  const handlePlaySong = (song, list) => {
    if (currentTrack?.id === song.id) {
      togglePlay();
    } else {
      play(song, list);
    }
  };

  const handleDownload = async (e, song) => {
    e.stopPropagation();
    const rawUrl = song.audioUrl || song.url;
    if (!rawUrl) return;
    const btn = e.currentTarget;
    btn.classList.add("animate-pulse");
    try {
      const res = await fetch(`/api/music/proxy-audio?url=${encodeURIComponent(rawUrl)}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const name = song.songName || song.title || song.name || "song";
      const artist = song.singer || song.artist || "";
      a.download = artist ? `${name} - ${artist}` : name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // silent
    } finally {
      btn.classList.remove("animate-pulse");
    }
  };

  const showDefault = !query && !searched;

  return (
    <div className="min-h-screen px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5FD0B3] mb-1.5">
              Discover
            </p>
            <h1 className="font-display text-xl md:text-3xl font-bold text-white">Search</h1>
          </div>
          <button className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-white/[0.06] transition-all">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 px-4 md:px-5 py-3 md:py-3.5 rounded-2xl bg-[#11131A] border border-white/[0.06] focus-within:border-[#5FD0B3]/40 transition-all duration-200">
            <Search className="w-4 h-4 md:w-5 md:h-5 text-[#5C6370] flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs, artists, albums..."
              className="bg-transparent text-sm text-white placeholder-[#5C6370] outline-none w-full"
              autoFocus
            />
            {query && (
              <button type="button" onClick={() => { setQuery(""); setResults([]); setSearched(false); }} className="p-1 text-[#5C6370] hover:text-white transition-colors flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            )}
            <button type="button" className="p-1 text-[#5C6370] hover:text-white transition-colors flex-shrink-0">
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="submit"
              className="px-4 md:px-5 py-2 rounded-xl text-xs font-semibold bg-[#5FD0B3] text-[#080D12] hover:brightness-110 active:scale-95 transition-all duration-150"
            >
              Search
            </button>
          </div>
        </form>

        {/* Recent Searches */}
        {recentSearches.length > 0 && showDefault && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">Recent Searches</h2>
              <button onClick={clearAll} className="text-[11px] font-medium text-[#5FD0B3]">
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleRecentClick(item.name)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#11131A] border border-white/[0.06] hover:border-white/[0.12] active:scale-95 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-[#1A2129] flex items-center justify-center">
                    <Music className="w-3 h-3 text-[#5C6370]" />
                  </div>
                  <span className="text-xs text-[#9CA3AF] max-w-[120px] truncate">{item.name}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); removeRecent(item.id); }}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); removeRecent(item.id); } }}
                    className="text-[#5C6370] hover:text-white transition-colors ml-1"
                  >
                    <X className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searched && (
          <div className="mb-8">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-[#11131A] border border-white/[0.06]">
                    <div className="w-full aspect-square bg-[#1A2129] animate-pulse" />
                    <div className="p-3 md:p-4 space-y-2">
                      <div className="h-3.5 bg-[#1A2129] rounded-lg w-3/4 animate-pulse" />
                      <div className="h-3 bg-[#1A2129] rounded-lg w-1/2 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <>
                <p className="text-sm text-[#9CA3AF] mb-4">
                  <span className="font-mono text-white font-medium">{results.length}</span> results for &ldquo;{query}&rdquo;
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                  {results.map((song, i) => {
                    const isCurrent = currentTrack?.id === song.id;
                    return (
                      <div
                        key={song.id || i}
                        onClick={() => handlePlaySong(song, results)}
                        className="group relative rounded-2xl overflow-hidden snap-start transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        style={{
                          background: "#15171E",
                          border: isCurrent ? "1px solid rgba(95,208,179,0.35)" : "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div className="relative">
                          {song.image && (
                            <img src={song.image} alt="" className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
                          )}
                          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #15171E 0%, transparent 50%)" }} />

                          <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                            {(song.audioUrl || song.url) && (
                              <button
                                onClick={(e) => handleDownload(e, song)}
                                className="w-9 h-9 rounded-full flex items-center justify-center"
                                style={{ background: "rgba(8,13,18,0.75)", backdropFilter: "blur(8px)", color: "#FFFFFF" }}
                                aria-label="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); handlePlaySong(song, results); }}
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{
                                background: isCurrent ? "#5FD0B3" : "rgba(8,13,18,0.75)",
                                backdropFilter: "blur(8px)",
                                color: isCurrent ? "#080D12" : "#FFFFFF",
                              }}
                              aria-label={isCurrent && isPlaying ? "Pause" : "Play"}
                            >
                              {isCurrent && isPlaying ? (
                                <Pause className="w-4 h-4" fill="currentColor" />
                              ) : (
                                <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="p-3 md:p-4">
                          <h3 className={`font-display font-semibold text-xs md:text-sm line-clamp-1 ${isCurrent ? "text-[#5FD0B3]" : "text-white"}`}>
                            {song.title || song.songName || song.name}
                          </h3>
                          <p className="text-[11px] md:text-xs text-[#5C6370] line-clamp-1 mt-0.5">
                            {song.artist || song.singer || "Unknown"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[200px] rounded-2xl border border-white/[0.06] bg-[#11131A]">
                <Search className="w-10 h-10 text-[#1A2129] mb-3" />
                <p className="text-sm text-[#5C6370]">No results found for &ldquo;{query}&rdquo;</p>
              </div>
            )}
          </div>
        )}

        {/* Default Content: Categories + Artists */}
        {showDefault && (
          <>
            {/* Browse Categories */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-white mb-4">Browse Categories</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`relative rounded-2xl overflow-hidden p-4 h-[100px] md:h-[110px] bg-gradient-to-br ${cat.gradient} border border-white/[0.06] text-left hover:border-white/[0.12] active:scale-[0.97] transition-all`}
                  >
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-sm">
                      {cat.icon}
                    </div>
                    <p className="font-display text-sm font-bold text-white mt-8">{cat.name}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{cat.count} songs</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Top Artists */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">Top Artists</h2>
                <button className="text-[11px] font-medium text-[#5FD0B3]">View All</button>
              </div>
              <div className="flex gap-5 md:gap-6 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
                {TOP_ARTISTS.map((artist) => (
                  <button
                    key={artist.name}
                    onClick={() => handleArtistClick(artist.name)}
                    className="shrink-0 snap-start text-center w-[80px] md:w-[90px] active:scale-95 transition-all"
                  >
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full object-cover mx-auto mb-2 border-2 border-transparent hover:border-[#5FD0B3] transition-colors"
                    />
                    <p className="text-xs font-medium text-white truncate">{artist.name}</p>
                    <p className="text-[10px] text-[#5C6370]">{artist.songs} songs</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
