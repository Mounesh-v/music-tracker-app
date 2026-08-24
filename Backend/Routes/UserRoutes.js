import express from "express";
import {
  login,
  signup,
  getProfile,
  updateProfile,
  updatePassword,
  validateToken,
} from "../Controller/User.js";
import protect from "../MiddleWare/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, validateToken);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);

export default router;
