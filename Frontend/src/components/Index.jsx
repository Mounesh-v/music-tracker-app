import React, { useState } from "react";
import api from "../Service/api";

function Index() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (reset = true) => {
    if (!input) return;

    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const res = await api.get(
        `/music/search?q=${encodeURIComponent(input)}&page=${currentPage}&limit=12`
      );
      const results = res.data.data || [];
      if (reset) {
        setOutput(results);
      } else {
        setOutput((prev) => [...prev, ...results]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    handleSearch(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setPage(1);
      handleSearch(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-8">
      {/* Search bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-8 text-center drop-shadow-lg">
          Discover Music
        </h1>
        <div className="flex justify-center mb-6">
          <div className="glass-strong p-3 sm:p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
            <input
              type="text"
              className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:bg-white/30 focus:border-white/50 focus:ring-2 focus:ring-white/50 outline-none transition-all duration-200 text-sm sm:text-base"
              placeholder="Search for music"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={() => {
                setPage(1);
                handleSearch(true);
              }}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && output.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="glass-strong rounded-2xl p-8">
            <svg
              className="animate-spin h-12 w-12 text-white mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-white mt-4 text-center">Loading tracks...</p>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {output.map((track) => (
            <div
              key={track.id}
              className="glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl border border-white/20"
            >
              <div className="relative">
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full h-48 sm:h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="p-4 sm:p-5">
                <h2
                  className="text-white font-bold text-lg mb-2 line-clamp-2 drop-shadow-lg"
                  title={track.title}
                >
                  {track.title}
                </h2>
                <p className="text-white/90 text-sm mb-4 line-clamp-1">
                  {track.artist}
                </p>
                <div className="flex flex-col gap-2">
                  {track.url && (
                    <a
                      href={track.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500/30 hover:bg-green-500/40 backdrop-blur-sm border border-green-400/50 text-white px-3 py-2 rounded-xl flex items-center justify-center gap-2 text-sm transition-all duration-200 hover:scale-[1.02]"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      </svg>
                      Play on JioSaavn
                    </a>
                  )}
                  {track.previewUrl && (
                    <a
                      href={track.previewUrl}
                      download={`${track.title.replace(
                        /[^a-z0-9]/gi,
                        "_"
                      )}_preview.mp3`}
                      className="block"
                    >
                      <button className="w-full bg-indigo-500/30 hover:bg-indigo-500/40 backdrop-blur-sm border border-indigo-400/50 text-white px-3 py-2 rounded-xl flex items-center justify-center gap-2 text-sm transition-all duration-200 hover:scale-[1.02]">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Download Preview
                      </button>
                    </a>
                  )}
                  <button
                    className="bg-pink-500/30 hover:bg-pink-500/40 backdrop-blur-sm border border-pink-400/50 text-white px-3 py-2 rounded-xl flex items-center justify-center gap-2 text-sm transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => alert(`Liked: ${track.title}`)}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Like
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        {output.length > 0 && !loading && (
          <div className="flex justify-center mt-8 mb-6">
            <button
              onClick={handleLoadMore}
              className="glass-strong bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;
