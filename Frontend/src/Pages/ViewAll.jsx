import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SongCard from "../components/SongCard";
import Pagination from "../components/Pagination";
import api from "../Service/api";

export default function ViewAll() {
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title") || "All Songs";
  const category = searchParams.get("category") || "";
  const language = searchParams.get("language") || "";

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [category, language]);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit: 20 });
        if (category) params.set("category", category);
        if (language) params.set("language", language);

        const endpoint = category.toLowerCase() === "trending"
          ? `/music/trending?${params.toString()}`
          : `/music/discover?${params.toString()}`;
        const res = await api.get(endpoint);
        setSongs(res.data?.songs || []);
        setTotalPages(res.data?.pagination?.totalPages || 1);
      } catch {
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, category, language]);

  return (
    <div className="min-h-screen px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5FD0B3] mb-1.5">
            {category ? "Charts" : language ? "Regional" : "Library"}
          </p>
          <h1 className="font-display text-xl md:text-3xl font-bold text-white">
            {title}
          </h1>
          {!loading && songs.length > 0 && (
            <p className="text-sm text-[#5C6370] mt-2">
              <span className="font-mono text-white font-medium">{songs.length}</span> songs
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
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
          <div className="flex items-center justify-center min-h-[200px] rounded-2xl border border-white/[0.06] bg-[#15171E] text-[#5C6370] text-sm">
            No songs available
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
