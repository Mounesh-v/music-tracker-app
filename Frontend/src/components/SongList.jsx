import { useState, useEffect } from "react";
import api from "../Service/api";
import SongCard from "./SongCard";
import { Music } from "lucide-react";

export default function SongList() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/music/discover?limit=20");
        setSongs(res.data?.songs || []);
      } catch {
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  return (
    <div className="min-h-screen px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5FD0B3] mb-1.5">
            Library
          </p>
          <h1 className="font-display text-xl md:text-3xl font-bold text-white">
            All Songs
          </h1>
        </div>

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
            <Music className="w-6 h-6 md:w-8 md:h-8 text-[#5C6370]" />
            <p className="text-[#9CA3AF] text-sm">No songs available</p>
          </div>
        )}
      </div>
    </div>
  );
}
