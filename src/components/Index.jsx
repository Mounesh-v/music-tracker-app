import React, { useState } from "react";

function Index() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (reset = true) => {
    if (!input) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://v1.nocodeapi.com/mounesh_76/spotify/MViYacNrafCvwVAn/search?q=${input}&type=track&perPage=12&page=${page}`
      );
      const data = await res.json();

      if (reset) {
        setOutput(data.tracks.items);
      } else {
        setOutput((prev) => [...prev, ...data.tracks.items]);
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
    if (e.key === 'Enter') {
      setPage(1);
      handleSearch(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      {/* Search bar */}
      <div className="flex justify-center py-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex gap-2">
          <input
            type="text"
            className="px-3 py-2 border rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {/* Results */}
      <div className="px-4 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {output.map((track, index) => (
            <div key={track.id} className="bg-white rounded-lg shadow-md p-4 relative hover:shadow-lg transition-shadow">
              <img
                src={track.album.images[0]?.url}
                alt={`Track ${index + 1}`}
                className="w-full h-48 object-cover rounded"
              />
              <h2 className="mt-2 text-lg font-semibold text-gray-800 truncate" title={track.name}>{track.name}</h2>
              <p className="text-sm text-gray-600 truncate">{track.artists.map(artist => artist.name).join(', ')}</p>
              <div className="flex flex-col mt-2 gap-2">
                <button
                  onClick={() => window.open(track.external_urls.spotify, "_blank")}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center justify-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  Play on Spotify
                </button>
                {track.preview_url && (
                  <a href={track.preview_url} download={`${track.name.replace(/[^a-z0-9]/gi, '_')}_preview.mp3`}>
                    <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded flex items-center justify-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Download Preview
                    </button>
                  </a>
                )}
                <button
                  className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded flex items-center justify-center gap-1"
                  onClick={() => alert(`Liked: ${track.name}`)}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Like
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        {output.length > 0 && !loading && (
          <div className="flex justify-center mt-6 mb-8">
            <button
              onClick={handleLoadMore}
              className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6 mt-10">
        <p className="text-sm">
          🎵 Built by using Spotify API & React.
        </p>
        <p className="text-xs mt-1">© {new Date().getFullYear()} All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Index;