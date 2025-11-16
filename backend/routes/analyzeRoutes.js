import express from "express";
import { analyze, deleteSession, getSessions, saveData, getSession } from "../controllers/analyzeController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", analyze);
router.post("/save", protect, saveData);
router.get("/get-sessions", protect, getSessions);
router.delete("/delete-session", protect, deleteSession);
router.post("/get-session", protect, getSession);

export default router;
