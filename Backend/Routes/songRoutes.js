import express from "express";
import {
  getAllSongs,
  searchSongs,
  createSong,
} from "../Controller/SongsController.js";

const router = express.Router();

router.post("/songs", createSong);
router.get("/songs", getAllSongs);
router.get("/songs/search", searchSongs);

export default router;
