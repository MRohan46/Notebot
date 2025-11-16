import { v4 as uuidv4 } from "uuid";
import Chat from "../models/chatModel.js";

export const createChat = async (req, res) => {
  try {
    const chatId = uuidv4();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 48 * 60 * 60 * 1000);

    const chat = await Chat.create({
      chatId,
      createdAt,
      expiresAt,
      messages: [],
      users: [],
    });

    res.status(201).json({
      success: true,
      chatId,
      chatLink: `${process.env.FRONTEND_URL}/chat/${chatId}`,
      expiresAt,
    });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};

export const getChatInfo = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findOne({ chatId });

    if (!chat) return res.status(404).json({ success: false });

    if (new Date() > chat.expiresAt) {
      await Chat.deleteOne({ chatId });
      return res.status(410).json({ success: false });
    }

    res.json({
      success: true,
      chatId: chat.chatId,
      createdAt: chat.createdAt,
      expiresAt: chat.expiresAt,
      messageCount: chat.messages.length,
    });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};

export const getMessages = async (req, res) => {
  try {
    const chat = await Chat.findOne({ chatId: req.params.chatId });

    if (!chat) {
      return res.status(404).json({ success: false });
    }

    res.json({
      success: true,
      messages: chat.messages.slice(-100),
    });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};

export const deleteChat = async (req, res) => {
  try {
    await Chat.deleteOne({ chatId: req.params.chatId });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};
