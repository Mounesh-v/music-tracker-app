import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, Mic, X, Music, Download, Play, Pause } from "lucide-react";
import { usePlayer } from "../Context/PlayerContext";
import api, { PROXY_AUDIO_URL } from "../Service/api";

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

export default function MobileSearch() {
  const { play, currentTrack, isPlaying, togglePlay } = usePlayer();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(loadRecent);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveRecent(recentSearches);
  }, [recentSearches]);

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
    try {
      const res = await api.get(`/music/search?q=${encodeURIComponent(term.trim())}&limit=20`);
      setResults(res.data?.data || []);
      addToRecent(term.trim());
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [addToRecent]);

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
      const res = await fetch(`${PROXY_AUDIO_URL}?url=${encodeURIComponent(rawUrl)}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const name = song.songName || song.title || song.name || "song";
      const artist = song.singer || song.artist || "";
      a.download = artist ? `${name} - ${artist}.mp4` : `${name}.mp4`;
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

  const showDefault = !query;

  return (
    <div className="min-h-screen pb-40">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h1 className="font-display text-2xl font-bold text-white">Search</h1>
        <button className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-white/[0.06] transition-all">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="px-4 mb-5">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#11131A] border border-white/[0.06] focus-within:border-[#5FD0B3]/30 transition-all">
          <Search className="w-4 h-4 text-[#5C6370] flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists, albums..."
            className="bg-transparent text-sm text-white placeholder-[#5C6370] outline-none w-full"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); setResults([]); }} className="p-1 text-[#5C6370] hover:text-white transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          )}
          <button type="button" className="p-1 text-[#5C6370] hover:text-white transition-colors flex-shrink-0">
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Recent Searches */}
      {recentSearches.length > 0 && showDefault && (
        <div className="px-4 mb-6">
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
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#11131A] border border-white/[0.06] active:scale-95 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-[#1A2129] flex items-center justify-center">
                  <Music className="w-3 h-3 text-[#5C6370]" />
                </div>
                <span className="text-xs text-[#9CA3AF] max-w-[100px] truncate">{item.name}</span>
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
      {!showDefault && (
        <div className="px-4 mb-6">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-[#11131A] animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-[#1A2129]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-[#1A2129] rounded-lg w-2/3" />
                    <div className="h-3 bg-[#1A2129] rounded-lg w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <>
              <p className="text-xs text-[#5C6370] mb-3">
                <span className="font-mono text-white font-medium">{results.length}</span> results for &ldquo;{query}&rdquo;
              </p>
              <div className="space-y-1">
                {results.map((song, i) => {
                  const isCurrent = currentTrack?.id === song.id;
                  return (
                    <div
                      key={song.id || i}
                      onClick={() => handlePlaySong(song, results)}
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      {song.image && (
                        <img src={song.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate ${isCurrent ? "text-[#5FD0B3]" : "text-white"}`}>
                          {song.title || song.songName || song.name}
                        </p>
                        <p className="text-xs text-[#5C6370] truncate">{song.artist || song.singer || "Unknown"}</p>
                      </div>
                      {(song.audioUrl || song.url) && (
                        <button
                          onClick={(e) => handleDownload(e, song)}
                          className="p-2 text-[#5C6370] opacity-0 group-hover:opacity-100 hover:text-[#5FD0B3] transition-all"
                          aria-label="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePlaySong(song, results); }}
                        className="p-2 text-[#5C6370] hover:text-[#5FD0B3] transition-colors"
                      >
                        {isCurrent && isPlaying ? (
                          <Pause className="w-4 h-4" fill="currentColor" />
                        ) : (
                          <Play className="w-4 h-4" fill="currentColor" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-12">
              <Search className="w-10 h-10 text-[#1A2129] mb-3" />
              <p className="text-sm text-[#5C6370]">No results found for &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>
      )}

      {/* Browse Categories */}
      {showDefault && (
        <>
          <div className="px-4 mb-6">
            <h2 className="text-sm font-semibold text-white mb-3">Browse Categories</h2>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`relative rounded-2xl overflow-hidden p-4 h-[100px] bg-gradient-to-br ${cat.gradient} border border-white/[0.06] text-left active:scale-[0.97] transition-all`}
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
          <div className="px-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">Top Artists</h2>
              <button className="text-[11px] font-medium text-[#5FD0B3]">View All</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
              {TOP_ARTISTS.map((artist) => (
                <button
                  key={artist.name}
                  onClick={() => handleArtistClick(artist.name)}
                  className="shrink-0 snap-start text-center w-[80px] active:scale-95 transition-all"
                >
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-transparent hover:border-[#5FD0B3] transition-colors"
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
  );
}
