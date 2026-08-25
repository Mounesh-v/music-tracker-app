import { useState } from "react";
import { Play, Pause, Download, Loader2 } from "lucide-react";
import { usePlayer } from "../Context/PlayerContext";
import { PROXY_AUDIO_URL } from "../Service/api";

export default function SongCard({ song, queue = [] }) {
  const { play, currentTrack, isPlaying, togglePlay } = usePlayer();
  const [isDownloading, setIsDownloading] = useState(false);

  const isCurrentTrack = currentTrack?.id === song.id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const durationSec = song.duration || 0;
  const minutes = Math.floor(durationSec / 60);
  const seconds = String(Math.floor(durationSec % 60)).padStart(2, "0");

  const handlePlay = (e) => {
    e.stopPropagation();
    if (isCurrentlyPlaying) {
      togglePlay();
    } else {
      play(song, queue);
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    const rawUrl = song.audioUrl || song.previewUrl || song.url;
    if (!rawUrl || isDownloading) return;

    setIsDownloading(true);
    try {
      const proxyUrl = `${PROXY_AUDIO_URL}?url=${encodeURIComponent(rawUrl)}`;
      const res = await fetch(proxyUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const name = song.songName || song.title || song.name || "song";
      const artist = song.singer || song.artist || "";
      a.download = artist ? `${name} - ${artist}.mp4` : `${name}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // silently fail
    } finally {
      setIsDownloading(false);
    }
  };

  const languageColors = {
    telugu: "#5FD0B3",
    hindi: "#60A5FA",
    tamil: "#F59E0B",
    kannada: "#A78BFA",
    malayalam: "#F472B6",
    punjabi: "#FB923C",
    english: "#9CA3AF",
  };

  const lang = (song.language || "").toLowerCase();
  const langColor = languageColors[lang] || "#5C6370";

  return (
    <article
      className="group relative rounded-2xl overflow-hidden snap-start shrink-0 w-[150px] md:w-[200px] transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "#15171E",
        border: isCurrentlyPlaying
          ? "1px solid rgba(95,208,179,0.35)"
          : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="relative">
        <img
          src={song.image}
          alt={song.title || "Song cover"}
          className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #15171E 0%, transparent 50%)",
          }}
        />

        {isCurrentlyPlaying && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#080D12]/80 backdrop-blur-sm">
            <div className="equalizer" style={{ height: "10px" }}>
              <div className="equalizer-bar" />
              <div className="equalizer-bar" />
              <div className="equalizer-bar" />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#5FD0B3]">
              Playing
            </span>
          </div>
        )}

        {song.language && (
          <span
            className="absolute top-2 right-2 md:top-3 md:right-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
            style={{
              background: `${langColor}20`,
              color: langColor,
              border: `1px solid ${langColor}30`,
            }}
          >
            {song.language}
          </span>
        )}

        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            aria-label="Download"
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(8,13,18,0.75)",
              backdropFilter: "blur(8px)",
              color: "#FFFFFF",
            }}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handlePlay}
            aria-label={isCurrentlyPlaying ? "Pause" : "Play"}
            className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center"
            style={{
              background: isCurrentlyPlaying ? "#5FD0B3" : "rgba(8,13,18,0.75)",
              backdropFilter: "blur(8px)",
              color: isCurrentlyPlaying ? "#080D12" : "#FFFFFF",
            }}
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-4 h-4" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            )}
          </button>
        </div>
      </div>

      <div className="p-3 md:p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-semibold text-xs md:text-sm text-white line-clamp-1">
            {song.title || song.songName || song.name}
          </h3>
          <span className="font-mono text-[10px] md:text-[11px] text-[#5C6370] flex-shrink-0">
            {minutes}:{seconds}
          </span>
        </div>
        <p className="text-[11px] md:text-xs text-[#9CA3AF] line-clamp-1 mb-2 md:mb-3">
          {song.artist || song.singer || "Unknown Artist"}
        </p>
        <div className="flex items-center justify-between">
          {(song.audioUrl || song.previewUrl || song.url) && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-1.5 text-[11px] font-medium text-[#5FD0B3] hover:underline"
            >
              {isDownloading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Download className="w-3 h-3" />
              )}
              {isDownloading ? "Downloading..." : "Download"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
