import mongoose from "mongoose";

const playlistSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    songs: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

playlistSchema.index({ owner: 1 });

export default mongoose.model("Playlist", playlistSchema);
