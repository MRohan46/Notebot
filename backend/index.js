import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import analyzeRoutes from "./routes/analyzeRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { socketHandler } from "./config/socket.js"; // Import socket handler
import { cleanupExpiredChats } from "./utils/cleanup.js"; // Import cleanup

dotenv.config();

// ---------------------------
// Database Connection
// ---------------------------
connectDB();

// ---------------------------
// Express + HTTP Server Setup
// ---------------------------
const app = express();
const server = createServer(app);

// ---------------------------
// Socket.IO
// ---------------------------
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Initialize socket handler
socketHandler(io);

// Start cleanup job for expired chats
cleanupExpiredChats();

// ---------------------------
// Middleware
// ---------------------------
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());

// ---------------------------
// Basic Health Route
// ---------------------------
app.get("/", (req, res) => {
    res.send("Server is running.");
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "Server is running",
        timestamp: new Date().toISOString()
    });
});

// ---------------------------
// API Routes
// ---------------------------
app.use("/api/analyze", analyzeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// ---------------------------
// Server Start
// ---------------------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
    console.log(`💬 Socket.IO: Initialized`);
    console.log(`🗑️  Cleanup Job: Started`);
});