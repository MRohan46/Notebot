import Chat from "../models/chatModel.js";

export const cleanupExpiredChats = () => {
  setInterval(async () => {
    try {
      const result = await Chat.deleteMany({
        expiresAt: { $lt: new Date() },
      });

      if (result.deletedCount > 0) {
        console.log(`🗑️ Cleaned ${result.deletedCount} expired chats`);
      }
    } catch (e) {
      console.error("Cleanup error:", e);
    }
  }, 60 * 60 * 1000);
};
