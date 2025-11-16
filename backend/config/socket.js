import { getRandomColor } from "../utils/colors.js";
import Chat from "../models/chatModel.js";

const rooms = {}; // in-memory cache

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // JOIN CHAT
    socket.on("join_chat", async ({ chatId, name }) => {
      try {
        const chat = await Chat.findOne({ chatId });

        if (!chat) {
          socket.emit("error", { message: "Chat not found" });
          return;
        }

        if (new Date() > chat.expiresAt) {
          await Chat.deleteOne({ chatId });
          socket.emit("error", { message: "Chat expired" });
          return;
        }

        const avatar = name.charAt(0).toUpperCase();
        const avatarColor = getRandomColor();

        socket.join(chatId);

        if (!rooms[chatId]) {
          rooms[chatId] = {
            users: [],
            messages: chat.messages.slice(-100),
          };
        }

        const user = {
          socketId: socket.id,
          name,
          avatar,
          avatarColor,
          joinedAt: new Date(),
        };

        rooms[chatId].users.push(user);
        chat.users.push(user);
        await chat.save();

        socket.emit("load_messages", rooms[chatId].messages);

        io.to(chatId).emit("user_joined", {
          user: { name, avatar, avatarColor },
          userCount: rooms[chatId].users.length,
        });

        io.to(chatId).emit("update_users", rooms[chatId].users);
      } catch (err) {
        console.error(err);
      }
    });

    // SEND MESSAGE
    socket.on("send_message", async ({ chatId, message }) => {
      try {
        const room = rooms[chatId];
        if (!room) return;

        const user = room.users.find((u) => u.socketId === socket.id);
        if (!user) return;

        const msg = {
          name: user.name,
          avatar: user.avatar,
          avatarColor: user.avatarColor,
          message,
          timestamp: new Date(),
        };

        room.messages.push(msg);
        if (room.messages.length > 100) room.messages.shift();

        const chat = await Chat.findOne({ chatId });
        if (chat) {
          chat.messages.push(msg);
          if (chat.messages.length > 100) chat.messages.shift();
          await chat.save();
        }

        io.to(chatId).emit("receive_message", msg);
      } catch (err) {
        console.error(err);
      }
    });

    // TYPING STATUS
    socket.on("typing", ({ chatId, name }) => {
      socket.to(chatId).emit("user_typing", { name });
    });

    socket.on("stop_typing", ({ chatId }) => {
      socket.to(chatId).emit("user_stop_typing");
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.id}`);

      for (const chatId of Object.keys(rooms)) {
        const room = rooms[chatId];
        const idx = room.users.findIndex((u) => u.socketId === socket.id);

        if (idx !== -1) {
          const user = room.users[idx];
          room.users.splice(idx, 1);

          io.to(chatId).emit("user_left", {
            user: { name: user.name, avatar: user.avatar },
            userCount: room.users.length,
          });

          io.to(chatId).emit("update_users", room.users);

          if (room.users.length === 0) {
            delete rooms[chatId];
          }
        }
      }
    });
  });
};
