import Songs from "../Model/Songs.js";

export const createSong = async (req, res) => {
  try {
    const {
      external_urls,
      image,
      songName,
      is_playable,
      singer,
      duration_ms,
      isrc,
      preview_url,
      release_date,
    } = req.body;

    const existingSong = await Songs.findOne({ isrc });

    if (existingSong) {
      return res.status(409).json({
        success: false,
        message: "Song already exists",
      });
    }

    const song = await Songs.create({
      external_urls,
      image,
      songName,
      is_playable,
      singer,
      duration_ms,
      isrc,
      preview_url,
      release_date,
    });

    res.status(201).json({
      success: true,
      message: "Song added successfully",
      song,
    });
  } catch (error) {
    console.error("Create song error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAllSongs = async (req, res) => {
  try {
    const songs = await Songs.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: songs.length,
      songs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const searchSongs = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const regex = new RegExp(q.trim(), "i");

    const songs = await Songs.find({
      $or: [
        { songName: regex },
        { singer: regex },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: songs.length,
      songs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};