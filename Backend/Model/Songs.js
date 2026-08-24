import mongoose from "mongoose";

const SongSchema = new mongoose.Schema(
  {
    external_urls: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    songName: {
      type: String,
      required: true,
    },
    is_playable: {
      type: Boolean,
      required: true,
    },
    singer: {
      type: String,
      required: true,
    },
    duration_ms: {
      type: Number,
      required: true,
    },
    isrc: {
      type: String,
      required: true,
      unique: true,
    },
    preview_url: {
      type: String,
      required: true,
    },
    release_date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Songs", SongSchema);
