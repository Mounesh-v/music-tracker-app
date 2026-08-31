import Playlist from "../Model/Playlist.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Playlist name is required" });
    }

    const playlist = await Playlist.create({
      name: name.trim(),
      description: description || "",
      image: image || "",
      owner: req.user._id,
    });

    res.status(201).json({ success: true, playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, playlists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });

    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    res.status(200).json({ success: true, playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });

    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    if (name !== undefined) playlist.name = name.trim();
    if (description !== undefined) playlist.description = description;
    if (image !== undefined) playlist.image = image;

    await playlist.save();

    res.status(200).json({ success: true, playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    res.status(200).json({ success: true, message: "Playlist deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addSongToPlaylist = async (req, res) => {
  try {
    const { songId } = req.params;
    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });

    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ success: false, message: "Song already in playlist" });
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.status(200).json({ success: true, playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { songId } = req.params;
    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });

    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    playlist.songs = playlist.songs.filter((id) => id !== songId);
    await playlist.save();

    res.status(200).json({ success: true, playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
