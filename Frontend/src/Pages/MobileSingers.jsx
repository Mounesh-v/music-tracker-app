import { useState, useEffect } from "react";
import { ArrowLeft, Mic2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../Service/api";

export default function MobileSingers() {
  const navigate = useNavigate();
  const [singers, setSingers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSingers = async () => {
      try {
        const res = await api.get("/music/discover?limit=200");
        const songs = res.data?.songs || [];
        const singerMap = new Map();
        songs.forEach((song) => {
          if (song.artist) {
            const names = song.artist.split(",").map((n) => n.trim());
            names.forEach((name) => {
              if (name && name !== "Unknown" && !singerMap.has(name)) {
                singerMap.set(name, {
                  name,
                  image: song.image,
                });
              }
            });
          }
        });
        setSingers([...singerMap.values()]);
      } catch (error) {
        console.error("Error fetching singers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSingers();
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
          <Mic2 className="w-4 h-4 text-[#5FD0B3]" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-white">Singers</h1>
          <p className="text-xs text-[#5C6370]">{singers.length} singers</p>
        </div>
      </div>

      <div className="px-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#5FD0B3] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : singers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Mic2 className="w-12 h-12 text-[#5C6370] mb-3" />
            <p className="text-sm text-[#5C6370]">No singers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {singers.map((singer, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-3 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                {singer.image ? (
                  <img
                    src={singer.image}
                    alt=""
                    className="w-20 h-20 rounded-full object-cover mb-2"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#1A1D26] flex items-center justify-center mb-2">
                    <Mic2 className="w-8 h-8 text-[#5C6370]" />
                  </div>
                )}
                <p className="text-xs font-medium text-white text-center truncate w-full">
                  {singer.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
