import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDb from "./Config/db.js";
import router from "./Routes/UserRoutes.js";
import AlbumRoute from "./Routes/AlbumRoute.js";
import jioSaavnRoutes from "./Routes/JioSaavnRoutes.js";
import playlistRoutes from "./Routes/PlaylistRoutes.js";
import { warmCatalog } from "./Controller/JioSaavnController.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

app.use("/api/users", router);
app.use("/api/albums", AlbumRoute);
app.use("/api/music", jioSaavnRoutes);
app.use("/api/playlists", playlistRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const port = process.env.PORT || 3000;

ConnectDb()
  .then(() => {
    console.log("Database connected, warming catalog...");
    warmCatalog();
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
