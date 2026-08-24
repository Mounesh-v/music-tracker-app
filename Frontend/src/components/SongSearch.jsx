import { useState, useEffect, useRef } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Search, X, Music, Loader2 } from "lucide-react";
import api from "../Service/api";
import useDebounce from "../hooks/useDebounce";

const popularSearches = ["Pop Hits", "Rock Classics", "Jazz Vibes", "Electronic", "Hip Hop"];

const SongSearch = ({ onResult }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      fetchSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchSuggestions = async (q) => {
    try {
      setLoadingSuggestions(true);
      const res = await api.get(`/music/search?q=${encodeURIComponent(q)}&limit=5`);
      setSuggestions(res.data.data || []);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSearch = async (searchQuery) => {
    const q = searchQuery || query;
    if (!q.trim()) {
      setError("Please enter a search term");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setShowSuggestions(false);
      const res = await api.get(`/music/search?q=${encodeURIComponent(q)}&page=1&limit=12`);
      onResult({
        count: res.data.total || res.data.data?.length || 0,
        search: q,
        songs: res.data.data || [],
      });
    } catch {
      setError("Failed to fetch songs");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (song) => {
    setQuery(song.title);
    setShowSuggestions(false);
    setTimeout(() => handleSearch(song.title), 0);
  };

  return (
    <div className="max-w-4xl mx-auto" ref={wrapperRef}>
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl bg-surface-900/60 backdrop-blur-xl border border-surface-700/50 p-6 sm:p-8"
      >
        <div className="text-center mb-6">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-2">
            Find Your{" "}
            <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
              Perfect Song
            </span>
          </h3>
          <p className="text-text-secondary text-sm sm:text-base">
            Search through millions of tracks and discover new favorites
          </p>
        </div>

        <div className="relative mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for songs, artists, or albums..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.trim().length >= 2) setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-surface-800/80 border border-surface-700 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 focus:shadow-lg focus:shadow-brand-500/10 transition-all duration-200 text-sm sm:text-base"
                aria-label="Search songs"
                aria-autocomplete="list"
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); setSuggestions([]); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 whitespace-nowrap"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">{loading ? "Searching..." : "Search"}</span>
            </button>
          </div>

          <AnimatePresence>
            {showSuggestions && (suggestions.length > 0 || loadingSuggestions) && (
              <Motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-surface-900/95 backdrop-blur-xl border border-surface-700 shadow-2xl shadow-black/40 z-50 overflow-hidden"
              >
                {loadingSuggestions ? (
                  <div className="p-4 space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-lg bg-surface-700" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-surface-700 rounded w-3/4" />
                          <div className="h-2.5 bg-surface-700 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-2">
                    {suggestions.map((song) => (
                      <button
                        key={song.id}
                        onClick={() => handleSuggestionClick(song)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-800 transition-colors text-left"
                      >
                        <img src={song.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text-primary truncate">{song.title}</p>
                          <p className="text-xs text-text-muted truncate">{song.artist}</p>
                        </div>
                        <Music className="w-4 h-4 text-text-muted flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </Motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="pt-5 border-t border-surface-700/50">
          <p className="text-text-muted text-xs mb-3 text-center uppercase tracking-wider font-medium">Popular searches</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term);
                  setTimeout(() => handleSearch(term), 0);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-medium bg-surface-800 border border-surface-700 text-text-secondary hover:text-text-primary hover:border-surface-600 hover:bg-surface-700/50 transition-all duration-200"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </Motion.div>
    </div>
  );
};

export default SongSearch;
