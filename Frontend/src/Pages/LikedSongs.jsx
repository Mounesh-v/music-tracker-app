import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Play, Pause, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../Context/PlayerContext";
import { getLikedSongs, getSongsByIds, unlikeSong } from "../Service/songApi";

export default function LikedSongs() {
  const navigate = useNavigate();
  const { play, currentTrack, isPlaying, togglePlay } = usePlayer();
  const [likedIds, setLikedIds] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const data = await getLikedSongs();
        const ids = data.likedSongs || [];
        setLikedIds(ids);

        if (ids.length > 0) {
          const songData = await getSongsByIds(ids);
          setSongs(songData.data || []);
        }
      } catch (error) {
        console.error("Error fetching liked songs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, []);

  const handleUnlike = async (songId) => {
    try {
      await unlikeSong(songId);
      setLikedIds((prev) => prev.filter((id) => id !== songId));
      setSongs((prev) => prev.filter((s) => s.id !== songId));
    } catch (error) {
      console.error("Error unliking song:", error);
    }
  };

  return (
    <div className="min-h-screen pb-40">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <button
          onClick={() => navigate("/m/library")}
          className="p-2 -ml-2 rounded-xl text-[#9CA3AF] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5FD0B3] to-[#3A9E85] flex items-center justify-center flex-shrink-0">
          <Heart className="w-4 h-4 text-white" fill="currentColor" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-white">Liked Songs</h1>
          <p className="text-xs text-[#5C6370]">{songs.length} songs</p>
        </div>
      </div>

      {/* Song List */}
      <div className="px-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#5FD0B3] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart className="w-12 h-12 text-[#5C6370] mb-3" />
            <p className="text-sm text-[#5C6370]">No liked songs yet</p>
            <p className="text-xs text-[#3A3F4B] mt-1">Tap the heart icon on any song to like it</p>
          </div>
        ) : (
          <div className="space-y-1">
            {songs.map((track, index) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => play(track, songs)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer"
                >
                  {track.image && (
                    <img
                      src={track.image}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium truncate ${isActive ? "text-[#5FD0B3]" : "text-white"}`}>
                        {track.title}
                      </p>
                      {isActive && isPlaying && (
                        <div className="equalizer" style={{ height: "10px" }}>
                          <div className="equalizer-bar" />
                          <div className="equalizer-bar" />
                          <div className="equalizer-bar" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-[#5C6370] truncate">{track.artist}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnlike(track.id);
                    }}
                    className="p-2 text-red-500 hover:text-red-400 transition-colors"
                    aria-label="Unlike song"
                  >
                    <Heart className="w-4 h-4" fill="currentColor" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isActive ? togglePlay() : play(track, songs);
                    }}
                    className="p-2 text-[#5C6370] hover:text-[#5FD0B3] transition-colors"
                  >
                    {isActive && isPlaying ? (
                      <Pause className="w-4 h-4" fill="currentColor" />
                    ) : (
                      <Play className="w-4 h-4" fill="currentColor" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
