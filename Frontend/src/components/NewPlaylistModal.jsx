import { useState } from "react";
import { X, Music } from "lucide-react";
import { createPlaylist } from "../Service/songApi";

export default function NewPlaylistModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Playlist name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await createPlaylist(name.trim());
      onCreated(data.playlist);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{ background: "rgba(8,13,18,0.88)", backdropFilter: "blur(12px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/[0.06] overflow-hidden"
        style={{ background: "#11131A" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5FD0B3]/15 flex items-center justify-center">
              <Music className="w-4 h-4 text-[#5FD0B3]" />
            </div>
            <h2 className="text-base font-display font-bold text-white">New Playlist</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5C6370] hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
            Playlist Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="My Playlist"
            autoFocus
            className="w-full px-3 py-2.5 rounded-xl bg-[#0A0C11] border border-white/[0.08] text-sm text-white placeholder:text-[#3A3F4B] focus:outline-none focus:border-[#5FD0B3]/40 transition-colors"
          />
          {error && (
            <p className="text-xs text-red-400 mt-1.5">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 pb-4">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-white/[0.08] text-[#9CA3AF] hover:text-white hover:bg-white/[0.04] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-[#5FD0B3] text-[#080D12] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
