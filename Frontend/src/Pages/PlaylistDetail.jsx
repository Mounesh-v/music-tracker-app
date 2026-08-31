import { useState, useEffect } from "react";
import { ArrowLeft, ListMusic, Play, Pause, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { usePlayer } from "../Context/PlayerContext";
import {
  getPlaylistById,
  getSongsByIds,
  removeSongFromPlaylist,
  deletePlaylist,
} from "../Service/songApi";

export default function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { play, currentTrack, isPlaying, togglePlay } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const data = await getPlaylistById(id);
        const pl = data.playlist;
        setPlaylist(pl);

        if (pl.songs && pl.songs.length > 0) {
          const songData = await getSongsByIds(pl.songs);
          setSongs(songData.data || []);
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id]);

  const handleRemoveSong = async (songId) => {
    try {
      await removeSongFromPlaylist(id, songId);
      setPlaylist((prev) => ({
        ...prev,
        songs: prev.songs.filter((s) => s !== songId),
      }));
      setSongs((prev) => prev.filter((s) => s.id !== songId));
    } catch (error) {
      console.error("Error removing song:", error);
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      await deletePlaylist(id);
      navigate("/m/library");
    } catch (error) {
      console.error("Error deleting playlist:", error);
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
        <div className="w-8 h-8 rounded-lg bg-[#5FD0B3]/15 flex items-center justify-center flex-shrink-0">
          <ListMusic className="w-4 h-4 text-[#5FD0B3]" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-bold text-white truncate">
            {loading ? "Loading..." : playlist?.name || "Playlist"}
          </h1>
          <p className="text-xs text-[#5C6370]">
            {loading ? "" : `${songs.length} songs`}
          </p>
        </div>
        {!loading && playlist && (
          <button
            onClick={handleDeletePlaylist}
            className="p-2 text-[#5C6370] hover:text-red-400 transition-colors"
            aria-label="Delete playlist"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Song List */}
      <div className="px-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#5FD0B3] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ListMusic className="w-12 h-12 text-[#5C6370] mb-3" />
            <p className="text-sm text-[#5C6370]">No songs in this playlist</p>
            <p className="text-xs text-[#3A3F4B] mt-1">
              Add songs from the player or song lists
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {songs.map((track) => {
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
                      <p
                        className={`text-sm font-medium truncate ${isActive ? "text-[#5FD0B3]" : "text-white"}`}
                      >
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
                      handleRemoveSong(track.id);
                    }}
                    className="p-2 text-[#5C6370] hover:text-red-400 transition-colors"
                    aria-label="Remove from playlist"
                  >
                    <Trash2 className="w-4 h-4" />
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
