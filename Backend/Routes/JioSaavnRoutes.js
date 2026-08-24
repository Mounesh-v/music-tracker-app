import express from "express";
import https from "https";
import {
  discoverCatalog,
  getTrendingSongs,
  getTrendingByLanguage,
  searchSongs,
  getSongById,
  getAlbumById,
  getArtistById,
} from "../Controller/JioSaavnController.js";

const router = express.Router();

router.get("/discover", discoverCatalog);
router.get("/trending", getTrendingSongs);
router.get("/trending-by-language", getTrendingByLanguage);
router.get("/search", searchSongs);
router.get("/song/:id", getSongById);
router.get("/album/:id", getAlbumById);
router.get("/artist/:id", getArtistById);

router.get("/proxy-audio", (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res
      .status(400)
      .json({ success: false, message: "url query param is required" });
  }

  try {
    const parsed = new URL(url);

    const proxyReq = https.get(
      parsed.href,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Referer: "https://www.jiosaavn.com/",
        },
      },
      (proxyRes) => {
        if (
          proxyRes.statusCode >= 300 &&
          proxyRes.statusCode < 400 &&
          proxyRes.headers.location
        ) {
          res.redirect(proxyRes.headers.location);
          return;
        }

        res.set(
          "Content-Type",
          proxyRes.headers["content-type"] || "audio/mp4",
        );
        res.set("Accept-Ranges", "bytes");
        if (proxyRes.headers["content-length"]) {
          res.set("Content-Length", proxyRes.headers["content-length"]);
        }
        proxyRes.pipe(res);
      },
    );

    proxyReq.on("error", (err) => {
      console.error("Proxy audio error:", err.message);
      if (!res.headersSent) {
        res
          .status(502)
          .json({ success: false, message: "Failed to proxy audio" });
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid URL" });
  }
});

export default router;
