import { useState, useEffect } from "react";
import { X, Plus, ListMusic, Check } from "lucide-react";
import {
  getUserPlaylists,
  createPlaylist,
  addSongToPlaylist,
} from "../Service/songApi";

export default function AddToPlaylistModal({ songId, onClose }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await getUserPlaylists();
        setPlaylists(data.playlists || []);
      } catch (err) {
        console.error("Error fetching playlists:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const handleAddToPlaylist = async (playlistId) => {
    try {
      setAdding(playlistId);
      await addSongToPlaylist(playlistId, songId);
      setAddedId(playlistId);
      setTimeout(() => onClose(), 600);
    } catch (err) {
      console.error("Error adding song:", err);
    } finally {
      setAdding(null);
    }
  };

  const handleCreateAndAdd = async () => {
    if (!newName.trim()) {
      setError("Playlist name is required");
      return;
    }
    try {
      setCreating(true);
      setError("");
      const data = await createPlaylist(newName.trim());
      const playlist = data.playlist;
      await addSongToPlaylist(playlist._id, songId);
      setAddedId(playlist._id);
      setPlaylists((prev) => [playlist, ...prev]);
      setShowCreate(false);
      setTimeout(() => onClose(), 600);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create playlist");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center"
      style={{ background: "rgba(8,13,18,0.88)", backdropFilter: "blur(12px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl border border-white/[0.06] overflow-hidden max-h-[80vh] flex flex-col"
        style={{ background: "#11131A" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5FD0B3]/15 flex items-center justify-center">
              <ListMusic className="w-4 h-4 text-[#5FD0B3]" />
            </div>
            <h2 className="text-base font-display font-bold text-white">Add to Playlist</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5C6370] hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-[#5FD0B3] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : playlists.length === 0 && !showCreate ? (
            <div className="text-center py-6">
              <ListMusic className="w-10 h-10 text-[#5C6370] mx-auto mb-3" />
              <p className="text-sm text-[#9CA3AF] mb-4">No playlists yet</p>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#5FD0B3] text-[#080D12] hover:brightness-110 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Playlist
              </button>
            </div>
          ) : showCreate ? (
            <div className="py-3">
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
                Playlist Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => { setNewName(e.target.value); setError(""); }}
                placeholder="My Playlist"
                autoFocus
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A0C11] border border-white/[0.08] text-sm text-white placeholder:text-[#3A3F4B] focus:outline-none focus:border-[#5FD0B3]/40 transition-colors"
              />
              {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => { setShowCreate(false); setNewName(""); setError(""); }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold border border-white/[0.08] text-[#9CA3AF] hover:text-white hover:bg-white/[0.04] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAndAdd}
                  disabled={creating || !newName.trim()}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-[#5FD0B3] text-[#080D12] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {creating ? "Creating..." : "Create & Add"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {playlists.map((pl) => (
                <button
                  key={pl._id}
                  onClick={() => handleAddToPlaylist(pl._id)}
                  disabled={adding === pl._id || addedId === pl._id}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors disabled:opacity-60 text-left"
                >
                  {pl.image ? (
                    <img src={pl.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#1A2129] flex items-center justify-center flex-shrink-0">
                      <ListMusic className="w-4 h-4 text-[#5C6370]" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{pl.name}</p>
                    <p className="text-[11px] text-[#5C6370]">{pl.songs.length} songs</p>
                  </div>
                  {addedId === pl._id ? (
                    <Check className="w-4 h-4 text-[#5FD0B3] flex-shrink-0" />
                  ) : adding === pl._id ? (
                    <div className="w-4 h-4 border-2 border-[#5FD0B3] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  ) : null}
                </button>
              ))}

              {/* Create new playlist option */}
              <button
                onClick={() => setShowCreate(true)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-[#5FD0B3]/15 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-4 h-4 text-[#5FD0B3]" />
                </div>
                <span className="text-sm font-medium text-[#5FD0B3]">New Playlist</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
