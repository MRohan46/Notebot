import express from "express";
import {
  createChat,
  getChatInfo,
  getMessages,
  deleteChat,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/create", createChat);
router.get("/:chatId", getChatInfo);
router.get("/:chatId/messages", getMessages);
router.delete("/:chatId", deleteChat);

export default router;
