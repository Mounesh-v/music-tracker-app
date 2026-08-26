import { useState, useRef, useCallback, useEffect } from "react";
import { usePlayer } from "../Context/PlayerContext";
import NowPlayingModal from "./NowPlayingModal";
import { likeSong, unlikeSong, getLikedSongs } from "../Service/songApi";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, X, Volume2, ListMusic, Heart } from "lucide-react";

export default function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    shuffle,
    repeat,
    togglePlay,
    stop,
    next,
    previous,
    seek,
    changeVolume,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  const [showModal, setShowModal] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  const volumeRef = useRef(null);
  const isDraggingVolume = useRef(false);

  const songName = currentTrack?.songName || currentTrack?.title || currentTrack?.name || "Unknown";
  const artist = currentTrack?.singer || currentTrack?.artist || "Unknown Artist";
  const image = currentTrack?.image || "";

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

  const progressPct = duration ? (progress / duration) * 100 : 0;

  const getVolumeFromEvent = useCallback((e) => {
    if (!volumeRef.current) return volume;
    const rect = volumeRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  }, [volume]);

  const handleVolumeMouseDown = useCallback((e) => {
    e.preventDefault();
    isDraggingVolume.current = true;
    changeVolume(getVolumeFromEvent(e));
  }, [changeVolume, getVolumeFromEvent]);

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

  const handleLikeSong = async () => {
    if (!currentTrack) return;
    try {
      const songId = currentTrack.id;
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

  const isCurrentTrackLiked = currentTrack && likedSongs.includes(currentTrack.id);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingVolume.current) return;
      changeVolume(getVolumeFromEvent(e));
    };
    const handleMouseUp = () => {
      isDraggingVolume.current = false;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [changeVolume, getVolumeFromEvent]);

  if (!currentTrack) return null;

  return (
    <>
      {/* Mobile Mini Player */}
      <div
        className="fixed bottom-[68px] left-2 right-2 z-40 lg:hidden rounded-2xl border border-white/[0.06]"
        style={{
          background: "rgba(10,13,18,0.95)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.4), 0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="h-1 absolute top-0 left-3 right-3 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #5FD0B3, #3A9E85)" }}
          />
        </div>
        <div
          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          {image && (
            <img src={image} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white font-medium truncate">{songName}</p>
            <p className="text-[11px] text-[#9CA3AF] truncate">{artist}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="p-2 text-white hover:text-[#5FD0B3] transition-colors flex-shrink-0"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" fill="currentColor" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
            )}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); stop(); }}
            className="p-2 text-[#5C6370] hover:text-white transition-colors flex-shrink-0"
            aria-label="Close player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop Full Player */}
      <div
        className="hidden lg:block fixed bottom-0 left-[260px] right-0 z-50 border-t border-white/[0.06]"
        style={{ background: "rgba(10,13,18,0.95)", backdropFilter: "blur(24px)" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="mb-2">
            <div
              className="w-full h-1.5 rounded-full cursor-pointer group relative"
              style={{ background: "rgba(255,255,255,0.08)" }}
              onClick={handleProgressClick}
            >
              <div
                className="h-full rounded-full relative"
                style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #5FD0B3, #3A9E85)" }}
              >
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "#5FD0B3", boxShadow: "0 0 8px rgba(95,208,179,0.5)" }}
                />
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[10px] text-[#5C6370] tabular-nums">{formatTime(progress)}</span>
              <span className="font-mono text-[10px] text-[#5C6370] tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              {image && (
                <img src={image} alt="" className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm text-white font-medium truncate">{songName}</p>
                <p className="text-[11px] text-[#9CA3AF] truncate">{artist}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleLikeSong(); }}
                className={`p-2 transition-colors hidden sm:block ${isCurrentTrackLiked ? "text-red-500" : "text-[#5C6370] hover:text-[#5FD0B3]"}`}
                aria-label="Like song"
              >
                <Heart className="w-4 h-4" fill={isCurrentTrackLiked ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-xl transition-colors ${shuffle ? "text-[#5FD0B3]" : "text-[#5C6370] hover:text-white"}`}
                aria-label="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button onClick={previous} className="p-2 text-[#9CA3AF] hover:text-white transition-colors rounded-xl" aria-label="Previous">
                <SkipBack className="w-5 h-5" fill="currentColor" />
              </button>

              <button
                onClick={togglePlay}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:brightness-110 active:scale-95 transition-all duration-150"
                style={{ background: "#5FD0B3", color: "#080D12" }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" fill="currentColor" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                )}
              </button>

              <button onClick={next} className="p-2 text-[#9CA3AF] hover:text-white transition-colors rounded-xl" aria-label="Next">
                <SkipForward className="w-5 h-5" fill="currentColor" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-xl transition-colors ${repeat !== "off" ? "text-[#5FD0B3]" : "text-[#5C6370] hover:text-white"}`}
                aria-label={"Repeat: " + repeat}
              >
                {repeat === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              </button>

              <button
                onClick={stop}
                className="p-2 text-[#5C6370] hover:text-white transition-colors rounded-xl"
                aria-label="Stop and close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 flex-1 justify-end">
              <Volume2 className="w-4 h-4 text-[#5C6370]" />
              <div
                ref={volumeRef}
                className="w-24 h-1.5 rounded-full cursor-pointer group relative"
                style={{ background: "rgba(255,255,255,0.08)" }}
                onMouseDown={handleVolumeMouseDown}
              >
                <div
                  className="h-full rounded-full relative"
                  style={{ width: volume * 100 + "%", background: "linear-gradient(90deg, #5FD0B3, #3A9E85)" }}
                >
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "#FFFFFF", boxShadow: "0 0 6px rgba(255,255,255,0.3)" }}
                  />
                </div>
              </div>
              <span className="font-mono text-[10px] text-[#5C6370] tabular-nums w-8 text-right">
                {Math.round(volume * 100)}
              </span>
            </div>

            <button className="p-2 text-[#5C6370] hover:text-white transition-colors rounded-xl hidden md:block">
              <ListMusic className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <NowPlayingModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
