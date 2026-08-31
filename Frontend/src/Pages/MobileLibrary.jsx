import { useState, useEffect } from "react";
import {
  Clock,
  Settings,
  Heart,
  Play,
  Pause,
  Plus,
  ListMusic,
  Mic2,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../Context/PlayerContext";
import { getLikedSongs, getUserPlaylists } from "../Service/songApi";
import NewPlaylistModal from "../components/NewPlaylistModal";

export default function MobileLibrary() {
  const navigate = useNavigate();
  const { play, currentTrack, isPlaying, togglePlay, recentlyPlayed } = usePlayer();
  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [showNewPlaylist, setShowNewPlaylist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [likedData, playlistData] = await Promise.all([
          getLikedSongs(),
          getUserPlaylists(),
        ]);
        setLikedSongs(likedData.likedSongs || []);
        setPlaylists(playlistData.playlists || []);
      } catch (error) {
        console.error("Error fetching library data:", error);
      }
    };
    fetchData();
    window.addEventListener("visibilitychange", fetchData);
    return () => window.removeEventListener("visibilitychange", fetchData);
  }, []);

  const handlePlaylistCreated = (playlist) => {
    setPlaylists((prev) => [playlist, ...prev]);
  };

  return (
    <div className="min-h-screen pb-40">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#5FD0B3]/15 flex items-center justify-center">
            <Clock className="w-4 h-4 text-[#5FD0B3]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Your Library</h1>
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Your Playlists */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Your Playlists</h2>
          <button
            onClick={() => setShowNewPlaylist(true)}
            className="flex items-center gap-1 text-[11px] font-medium text-[#5FD0B3] hover:text-[#5FD0B3]/80 transition-colors"
          >
            <Plus className="w-3 h-3" />
            New Playlist
          </button>
        </div>

        <div className="space-y-1">
          {/* Liked Songs */}
          <div
            onClick={() => navigate("/m/library/liked")}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5FD0B3] to-[#3A9E85] flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">Liked Songs</p>
              <p className="text-xs text-[#5C6370]">{likedSongs.length} songs</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5C6370]" />
          </div>

          {/* User Playlists */}
          {playlists.map((pl) => (
            <div
              key={pl._id}
              onClick={() => navigate(`/m/library/playlist/${pl._id}`)}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              {pl.image ? (
                <img
                  src={pl.image}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#1A2129] flex items-center justify-center flex-shrink-0">
                  <ListMusic className="w-5 h-5 text-[#5C6370]" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{pl.name}</p>
                <p className="text-xs text-[#5C6370]">{pl.songs.length} songs</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5C6370]" />
            </div>
          ))}
        </div>
      </div>

      {/* Recently Played */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Recently Played</h2>
        </div>

        <div className="space-y-1">
          {recentlyPlayed.length === 0 ? (
            <p className="text-sm text-[#5C6370] py-4 text-center">No recently played songs</p>
          ) : (
            recentlyPlayed.map((track) => {
              const trackId = track.id || track._id;
              const isActive = currentTrack?.id === trackId || currentTrack?._id === trackId;
              const trackTitle = track.songName || track.title || track.name || "Unknown";
              const trackArtist = track.singer || track.artist || "Unknown Artist";
              const trackImage = track.image || "";
              return (
                <div
                  key={trackId}
                  onClick={() => play(track, recentlyPlayed)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer"
                >
                  {trackImage && (
                    <img
                      src={trackImage}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium truncate ${isActive ? "text-[#5FD0B3]" : "text-white"}`}>
                        {trackTitle}
                      </p>
                      {isActive && isPlaying && (
                        <div className="equalizer" style={{ height: "10px" }}>
                          <div className="equalizer-bar" />
                          <div className="equalizer-bar" />
                          <div className="equalizer-bar" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-[#5C6370] truncate">{trackArtist}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isActive ? togglePlay() : play(track, recentlyPlayed);
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
            })
          )}
        </div>
      </div>

      {/* New Playlist Modal */}
      {showNewPlaylist && (
        <NewPlaylistModal
          onClose={() => setShowNewPlaylist(false)}
          onCreated={handlePlaylistCreated}
        />
      )}
    </div>
  );
}
