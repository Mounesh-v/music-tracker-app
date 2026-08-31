import { useState, useEffect } from "react";
import { usePlayer } from "../Context/PlayerContext";
import { PROXY_AUDIO_URL } from "../Service/api";
import { likeSong,
  unlikeSong,
  getLikedSongs, } from "../Service/songApi";
import AddToPlaylistModal from "./AddToPlaylistModal";
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Download,
  ListPlus,
} from "lucide-react";

const NowPlayingModal = ({ onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

  const [likedSongs, setLikedSongs] = useState([]);
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    shuffle,
    repeat,
    togglePlay,
    next,
    previous,
    seek,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  const song = currentTrack;
  if (!song) return null;

  const songName = song.songName || song.title || song.name || "Unknown";
  const artist = song.singer || song.artist || "Unknown Artist";
  const image = song.image || "";

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + String(s).padStart(2, "0");
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - rect.left) / rect.width) * duration);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const progressPct = duration ? (progress / duration) * 100 : 0;

  const handleDownload = async () => {
    const rawUrl = song.audioUrl || song.previewUrl || song.url;
    if (!rawUrl || downloading) return;

    setDownloading(true);
    try {
      const proxyUrl = `${PROXY_AUDIO_URL}?url=${encodeURIComponent(rawUrl)}`;
      const res = await fetch(proxyUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download =
        artist !== "Unknown Artist"
          ? `${songName} - ${artist}.mp4`
          : `${songName}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // silently fail
    } finally {
      setDownloading(false);
    }
  };
  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const data = await getLikedSongs();

        setLikedSongs(data.likedSongs);
      } catch (error) {
        console.error("Error fetching liked songs:", error);
      }
    };

    fetchLikedSongs();
  }, []);

  const handleLikeSong = async (songId) => {
    try {
      const isLiked = likedSongs.includes(songId);

      if (isLiked) {
        await unlikeSong(songId);

        setLikedSongs((prev) => prev.filter((id) => id !== songId));
      } else {
        await likeSong(songId);

        setLikedSongs((prev) => [...prev, songId]);
      }
    } catch (error) {
      console.error("Error updating liked song:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 lg:p-0"
      style={{ background: "rgba(8,13,18,0.88)", backdropFilter: "blur(12px)" }}
      onClick={handleBackdropClick}
    >
      {/* Mobile full-screen layout */}
      <div className="lg:hidden w-full h-full flex flex-col items-center justify-center p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl text-[#5C6370] hover:text-white hover:bg-white/[0.06] transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <img
          src={image}
          alt={songName}
          className="w-64 h-64 rounded-3xl object-cover shadow-2xl mb-8"
          style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}
        />

        <h2 className="text-lg font-display font-bold text-white text-center line-clamp-1 mb-1">
          {songName}
        </h2>
        <p className="text-sm text-[#9CA3AF] text-center line-clamp-1 mb-5">
          {artist}
        </p>

        <div
          className="w-full h-1.5 rounded-full cursor-pointer group mb-1"
          style={{ background: "rgba(255,255,255,0.08)" }}
          onClick={handleProgressClick}
        >
          <div
            className="h-full rounded-full relative transition-all"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #5FD0B3, #3A9E85)",
            }}
          >
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: "#5FD0B3",
                boxShadow: "0 0 8px rgba(95,208,179,0.5)",
              }}
            />
          </div>
        </div>
        <div className="flex justify-between w-full mb-6">
          <span className="font-mono text-[11px] text-[#5C6370] tabular-nums">
            {formatTime(progress)}
          </span>
          <span className="font-mono text-[11px] text-[#5C6370] tabular-nums">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-xl transition-colors ${shuffle ? "text-[#5FD0B3]" : "text-[#5C6370] hover:text-white"}`}
            aria-label="Shuffle"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={previous}
            className="p-2 text-[#9CA3AF] hover:text-white transition-colors rounded-xl"
            aria-label="Previous"
          >
            <SkipBack className="w-6 h-6" fill="currentColor" />
          </button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center rounded-full hover:brightness-110 active:scale-95 transition-all duration-150"
            style={{ background: "#5FD0B3", color: "#080D12" }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" fill="currentColor" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
            )}
          </button>

          <button
            onClick={next}
            className="p-2 text-[#9CA3AF] hover:text-white transition-colors rounded-xl"
            aria-label="Next"
          >
            <SkipForward className="w-6 h-6" fill="currentColor" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-2 rounded-xl transition-colors ${repeat !== "off" ? "text-[#5FD0B3]" : "text-[#5C6370] hover:text-white"}`}
            aria-label="Repeat"
          >
            {repeat === "one" ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="p-2 text-[#5C6370] hover:text-[#5FD0B3] transition-colors disabled:opacity-50"
            aria-label="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowAddToPlaylist(true)}
            className="p-2 text-[#5C6370] hover:text-[#5FD0B3] transition-colors"
            aria-label="Add to playlist"
          >
            <ListPlus className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleLikeSong(song.id)}
            className={`p-2 transition-colors ${
              likedSongs.includes(song.id)
                ? "text-red-500"
                : "text-[#5C6370] hover:text-[#5FD0B3]"
            }`}
            aria-label="Like song"
          >
            <Heart
              className="w-5 h-5"
              fill={likedSongs.includes(song.id) ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>

      {/* Desktop card layout */}
      <div
        className="hidden lg:block relative w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: "#111318",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl text-[#5C6370] hover:text-white hover:bg-white/[0.06] transition-all"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 pt-10 flex flex-col items-center">
          <img
            src={image}
            alt={songName}
            className="w-52 h-52 rounded-3xl object-cover shadow-2xl mb-8"
            style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}
          />

          <h2 className="text-lg font-display font-bold text-white text-center line-clamp-1 mb-1">
            {songName}
          </h2>
          <p className="text-sm text-[#9CA3AF] text-center line-clamp-1 mb-5">
            {artist}
          </p>

          <div
            className="w-full h-1.5 rounded-full cursor-pointer group mb-1"
            style={{ background: "rgba(255,255,255,0.08)" }}
            onClick={handleProgressClick}
          >
            <div
              className="h-full rounded-full relative transition-all"
              style={{
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, #5FD0B3, #3A9E85)",
              }}
            >
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: "#5FD0B3",
                  boxShadow: "0 0 8px rgba(95,208,179,0.5)",
                }}
              />
            </div>
          </div>
          <div className="flex justify-between w-full mb-6">
            <span className="font-mono text-[11px] text-[#5C6370] tabular-nums">
              {formatTime(progress)}
            </span>
            <span className="font-mono text-[11px] text-[#5C6370] tabular-nums">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-xl transition-colors ${shuffle ? "text-[#5FD0B3]" : "text-[#5C6370] hover:text-white"}`}
              aria-label="Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={previous}
              className="p-2 text-[#9CA3AF] hover:text-white transition-colors rounded-xl"
              aria-label="Previous"
            >
              <SkipBack className="w-6 h-6" fill="currentColor" />
            </button>

            <button
              onClick={togglePlay}
              className="w-14 h-14 flex items-center justify-center rounded-full hover:brightness-110 active:scale-95 transition-all duration-150"
              style={{ background: "#5FD0B3", color: "#080D12" }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" fill="currentColor" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
              )}
            </button>

            <button
              onClick={next}
              className="p-2 text-[#9CA3AF] hover:text-white transition-colors rounded-xl"
              aria-label="Next"
            >
              <SkipForward className="w-6 h-6" fill="currentColor" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-xl transition-colors ${repeat !== "off" ? "text-[#5FD0B3]" : "text-[#5C6370] hover:text-white"}`}
              aria-label="Repeat"
            >
              {repeat === "one" ? (
                <Repeat1 className="w-5 h-5" />
              ) : (
                <Repeat className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="p-2 text-[#5C6370] hover:text-[#5FD0B3] transition-colors disabled:opacity-50"
              aria-label="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowAddToPlaylist(true)}
              className="p-2 text-[#5C6370] hover:text-[#5FD0B3] transition-colors"
              aria-label="Add to playlist"
            >
              <ListPlus className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleLikeSong(song.id)}
              className={`p-2 transition-colors ${
                likedSongs.includes(song.id)
                  ? "text-red-500"
                  : "text-[#5C6370] hover:text-[#5FD0B3]"
              }`}
              aria-label="Like song"
            >
              <Heart
                className="w-5 h-5"
                fill={likedSongs.includes(song.id) ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>
      </div>

      {showAddToPlaylist && (
        <AddToPlaylistModal
          songId={song.id}
          onClose={() => setShowAddToPlaylist(false)}
        />
      )}
    </div>
  );
};

export default NowPlayingModal;
