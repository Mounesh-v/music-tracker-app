import { useState, useEffect } from "react";
import {
  Clock,
  Settings,
  Heart,
  Play,
  Pause,
  Plus,
  Disc3,
  Mic2,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../Context/PlayerContext";
import { getLikedSongs } from "../Service/songApi";

// const TABS = [
//   { name: "Playlists", icon: Heart, route: "/m/library/liked" },
// ];

export default function MobileLibrary() {
  const navigate = useNavigate();
  const { play, currentTrack, isPlaying, togglePlay, recentlyPlayed } =
    usePlayer();
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const data = await getLikedSongs();
        setLikedSongs(data.likedSongs || []);
      } catch (error) {
        console.error("Error fetching liked songs:", error);
      }
    };
    fetchLikedSongs();
  }, []);

  return (
    <div className="min-h-screen pb-40">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#5FD0B3]/15 flex items-center justify-center">
            <Clock className="w-4 h-4 text-[#5FD0B3]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            Your Library
          </h1>
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Tab Bar - Each navigates to separate route */}
      {/* <div className="px-4 mb-5">
        <div className="flex gap-1 p-1 rounded-2xl bg-[#11131A] border border-white/[0.06]">
          {TABS.map((tab) => (
            <button
              key={tab.name}
              onClick={() => navigate(tab.route)}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold text-[#5C6370] hover:text-[#5FD0B3] hover:bg-[#5FD0B3]/10 transition-all duration-200"
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </div> */}

      {/* Your Playlists */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Your Playlists</h2>
          <button className="flex items-center gap-1 text-[11px] font-medium text-[#5FD0B3]">
            <Plus className="w-3 h-3" />
            New Playlist
          </button>
        </div>

        <div className="space-y-1">
          {/* Liked Songs - navigates to /m/library/liked */}
          <div
            onClick={() => navigate("/m/library/liked")}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5FD0B3] to-[#3A9E85] flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">
                Liked Songs
              </p>
              <p className="text-xs text-[#5C6370]">
                {likedSongs.length} songs
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5C6370]" />
          </div>
        </div>
      </div>

      {/* Recently Played */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Recently Played</h2>
        </div>

        <div className="space-y-1">
          {recentlyPlayed.length === 0 ? (
            <p className="text-sm text-[#5C6370] py-4 text-center">
              No recently played songs
            </p>
          ) : (
            recentlyPlayed.map((track) => {
              const trackId = track.id || track._id;
              const isActive =
                currentTrack?.id === trackId || currentTrack?._id === trackId;
              const trackTitle =
                track.songName || track.title || track.name || "Unknown";
              const trackArtist =
                track.singer || track.artist || "Unknown Artist";
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
                      <p
                        className={`text-sm font-medium truncate ${isActive ? "text-[#5FD0B3]" : "text-white"}`}
                      >
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
                    <p className="text-xs text-[#5C6370] truncate">
                      {trackArtist}
                    </p>
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
    </div>
  );
}
