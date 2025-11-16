import express from "express";
import { signup, login, getUserData } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", protect, getUserData);

export default router;
