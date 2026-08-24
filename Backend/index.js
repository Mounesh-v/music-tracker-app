import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDb from "./Config/db.js";
import router from "./Routes/UserRoutes.js";
import AlbumRoute from "./Routes/AlbumRoute.js";
import jioSaavnRoutes from "./Routes/JioSaavnRoutes.js";
import { warmCatalog } from "./Controller/JioSaavnController.js";

const app = express();
dotenv.config();
ConnectDb();

app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

app.use("/api/users", router);
app.use("/api/albums", AlbumRoute);
app.use("/api/music", jioSaavnRoutes);

warmCatalog();

const port = process.env.PORT || 3000;

if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
