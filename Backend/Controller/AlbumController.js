import Track from "../Model/Album.js";

export const getTracks = async (req, res) => {
  try {
    const tracks = await Track.find().sort({ createdAt: -1 });
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchTracks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const regex = new RegExp(q, "i");
    const tracks = await Track.find({
      $or: [
        { name: regex },
        { "artists.name": regex },
        { "album.name": regex },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tracks.length,
      tracks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
