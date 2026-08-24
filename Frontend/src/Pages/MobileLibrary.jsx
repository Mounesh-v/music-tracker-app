import { useState } from "react";
import { Clock, Settings, Heart, MoreHorizontal, Play, Pause, Plus } from "lucide-react";
import { usePlayer } from "../Context/PlayerContext";

const TABS = ["Playlists", "Albums", "Artists", "Downloads"];

const PLAYLISTS = [
  { id: 1, name: "Liked Songs", count: 124, isLiked: true },
  { id: 2, name: "Midnight Vibes", count: 48, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&q=80" },
  { id: 3, name: "Workout Mix", count: 36, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=100&q=80" },
  { id: 4, name: "Road Trip", count: 62, image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100&q=80" },
  { id: 5, name: "Focus Flow", count: 29, image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&q=80" },
];

const RECENTLY_PLAYED = [
  { id: 1, title: "Midnight Frequency", artist: "VibeTune Radio", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80", playing: true },
  { id: 2, title: "Blinding Lights", artist: "The Weeknd", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&q=80" },
  { id: 3, title: "Levitating", artist: "Dua Lipa", image: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=100&q=80" },
  { id: 4, title: "Peaches", artist: "Justin Bieber", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&q=80" },
  { id: 5, title: "Stay", artist: "Kid Laroi", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&q=80" },
];

export default function MobileLibrary() {
  const { play, currentTrack, isPlaying, togglePlay } = usePlayer();
  const [activeTab, setActiveTab] = useState("Playlists");

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
        <button className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-white/[0.06] transition-all">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Tab Bar */}
      <div className="px-4 mb-5">
        <div className="flex gap-1 p-1 rounded-2xl bg-[#11131A] border border-white/[0.06]">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#5FD0B3]/15 text-[#5FD0B3] border-b-2 border-[#5FD0B3]"
                  : "text-[#5C6370]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

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
          {PLAYLISTS.map((pl) => (
            <div
              key={pl.id}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              {pl.isLiked ? (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5FD0B3] to-[#3A9E85] flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-white" fill="currentColor" />
                </div>
              ) : (
                <img src={pl.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{pl.name}</p>
                <p className="text-xs text-[#5C6370]">{pl.count} songs</p>
              </div>
              <button className="p-2 text-[#5C6370] hover:text-white transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Played */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Recently Played</h2>
          <button className="text-[11px] font-medium text-[#5FD0B3]">View All</button>
        </div>

        <div className="space-y-1">
          {RECENTLY_PLAYED.map((track) => {
            const isActive = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => play(track, RECENTLY_PLAYED)}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                <img src={track.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
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
                  onClick={(e) => { e.stopPropagation(); isActive ? togglePlay() : play(track, RECENTLY_PLAYED); }}
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
      </div>
    </div>
  );
}
