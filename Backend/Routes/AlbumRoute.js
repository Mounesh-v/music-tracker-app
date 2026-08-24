import express from "express";
import {
  getTracks,
  searchTracks,
} from "../Controller/AlbumController.js";

const router = express.Router();

router.get("/", getTracks);
router.get("/search", searchTracks);

export default router;
