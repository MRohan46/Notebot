import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  messages: [
    {
      name: String,
      avatar: String,
      avatarColor: String,
      message: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  users: [
    {
      socketId: String,
      name: String,
      avatar: String,
      avatarColor: String,
      joinedAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Chat", chatSchema);
