import { useState, useEffect } from "react";
import { ArrowLeft, Disc3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../Service/api";

export default function MobileAlbums() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await api.get("/music/discover?category=Trending&limit=20");
        const songs = res.data?.songs || [];
        const albumMap = new Map();
        songs.forEach((song) => {
          if (song.album && !albumMap.has(song.album)) {
            albumMap.set(song.album, {
              name: song.album,
              image: song.image,
              artist: song.artist,
            });
          }
        });
        setAlbums([...albumMap.values()]);
      } catch (error) {
        console.error("Error fetching albums:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  return (
    <div className="min-h-screen pb-40">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <button
          onClick={() => navigate("/m/library")}
          className="p-2 -ml-2 rounded-xl text-[#9CA3AF] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-[#5FD0B3]/15 flex items-center justify-center flex-shrink-0">
          <Disc3 className="w-4 h-4 text-[#5FD0B3]" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-white">Albums</h1>
          <p className="text-xs text-[#5C6370]">{albums.length} albums</p>
        </div>
      </div>

      <div className="px-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#5FD0B3] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Disc3 className="w-12 h-12 text-[#5C6370] mb-3" />
            <p className="text-sm text-[#5C6370]">No albums found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {albums.map((album, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                {album.image && (
                  <img
                    src={album.image}
                    alt=""
                    className="w-full aspect-square rounded-xl object-cover mb-2"
                  />
                )}
                <p className="text-sm font-medium text-white truncate">{album.name}</p>
                <p className="text-xs text-[#5C6370] truncate">{album.artist}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
