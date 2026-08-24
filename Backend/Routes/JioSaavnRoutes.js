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
          Origin: "https://www.jiosaavn.com",
        },
      },
      (proxyRes) => {
        if (
          proxyRes.statusCode >= 300 &&
          proxyRes.statusCode < 400 &&
          proxyRes.headers.location
        ) {
          const redirectUrl = new URL(proxyRes.headers.location, parsed.origin);
          const followReq = https.get(
            redirectUrl.href,
            {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                Referer: "https://www.jiosaavn.com/",
                Origin: "https://www.jiosaavn.com",
              },
            },
            (followRes) => {
              if (
                followRes.statusCode >= 300 &&
                followRes.statusCode < 400 &&
                followRes.headers.location
              ) {
                const followReq2 = https.get(
                  new URL(followRes.headers.location, redirectUrl.origin).href,
                  {
                    headers: {
                      "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                      Referer: "https://www.jiosaavn.com/",
                      Origin: "https://www.jiosaavn.com",
                    },
                  },
                  (finalRes) => {
                    res.set(
                      "Content-Type",
                      finalRes.headers["content-type"] || "audio/mpeg"
                    );
                    res.set("Accept-Ranges", "bytes");
                    if (finalRes.headers["content-length"]) {
                      res.set("Content-Length", finalRes.headers["content-length"]);
                    }
                    finalRes.pipe(res);
                  }
                );
                followReq2.on("error", (err) => {
                  console.error("Proxy follow2 error:", err.message);
                  if (!res.headersSent) {
                    res.status(502).json({ success: false, message: "Failed to proxy audio" });
                  }
                });
                return;
              }

              res.set(
                "Content-Type",
                followRes.headers["content-type"] || "audio/mpeg"
              );
              res.set("Accept-Ranges", "bytes");
              if (followRes.headers["content-length"]) {
                res.set("Content-Length", followRes.headers["content-length"]);
              }
              followRes.pipe(res);
            }
          );
          followReq.on("error", (err) => {
            console.error("Proxy follow error:", err.message);
            if (!res.headersSent) {
              res.status(502).json({ success: false, message: "Failed to proxy audio" });
            }
          });
          return;
        }

        res.set(
          "Content-Type",
          proxyRes.headers["content-type"] || "audio/mpeg"
        );
        res.set("Accept-Ranges", "bytes");
        if (proxyRes.headers["content-length"]) {
          res.set("Content-Length", proxyRes.headers["content-length"]);
        }
        proxyRes.pipe(res);
      }
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
