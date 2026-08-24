import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema(
  {
    trackId: String,
    name: String,
    previewUrl: String,
    album: {
      id: String,
      name: String,
      images: [Object],
    },
    artists: [
      {
        id: String,
        name: String,
      },
    ],
    duration_ms: Number,
    popularity: Number,
    external_url: String,
  },
  { timestamps: true }
);

export default mongoose.model("Album", AlbumSchema);
