import axios from "axios";
import { callAI } from "../utils/callAI.js";
import { localQuiz } from "../utils/localQuiz.js";
import { localSummary } from "../utils/localSummary.js";
import sessionModel from "../models/sessionModel.js";
import userModel from "../models/userModel.js";

const GEMINI_API_KEY = "AIzaSyCBZkdhuerhNJAk_CvWm5fKWOeDG7t3b0M";

export const analyze = async (req, res) => {
  try {
    const { text, mode } = req.body;
    
    /*if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }*/
    if (!mode || !["summary", "quiz"].includes(mode)) {
      return res.status(400).json({ message: 'Mode must be "summary" or "quiz"' });
    }

    // If API key present, prefer OpenAI
    if (GEMINI_API_KEY) {
      try {
        const aiResult = await callAI(text, mode);
        if (aiResult) return res.json(aiResult);
        // else fall through to local fallback
      } catch (err) {
        // swallow and fall back to local generator
        console.error("OpenAI call failed, falling back:", err?.message);
      }
    }

    // Local fallback
    if (mode === "summary") {
      const { summary, keywords } = localSummary(text);
      return res.json({
        type: "summary",
        content: { summary, keywords }
      });
    } else {
      const quiz = localQuiz(text);
      return res.json({
        type: "quiz",
        content: quiz
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const saveData = async (req, res) => {
  try {
    const { title, snippet, date, output } = req.body;
    const userId = req.user.id;  

    if (!userId || !title || !snippet ||!date || !output) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const session = await sessionModel.create({
      userId,
      title,
      snippet,
      date,
      output
    });

    res.json({ success: true, session });

  } catch (err) {
    console.error("Session save error:", err);
    res.status(500).json({ error: "Server error" });
  }
}


export const getSessions = async (req, res) => {
  try {
    // Make sure user is authenticated (req.user.id set by protect middleware)
    const userId = req.user?.id;

    // Fetch sessions for this user
    const sessions = await sessionModel.find({ userId }).sort({ date: -1 });

    // Format sessions for frontend
    const formattedSessions = sessions.map((s, index) => ({
      id: s._id, // you can use MongoDB _id or generate a number if needed
      title: s.title,
      snippet: s.snippet,
      date: s.date.toString().split("T")[0], // YYYY-MM-DD
      type: s.type
    }));

    return res.status(200).json(formattedSessions);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const userId = req.user?.id; // set by protect middleware
    const { sessionId } = req.body;

    // Fetch the session first
    
    const session = await sessionModel.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check ownership
    if (session.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own session" });
    }

    // Delete the session
    await sessionModel.findByIdAndDelete(sessionId);

    return res.status(200).json({ message: "Session deleted successfully" });
  } catch (err) {
    console.error("Error deleting session:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSession = async (req, res) => {
    try {
    const userId = req.user?.id; // set by protect middleware
    const { sessionId } = req.body;

    // Fetch the session first
    
    const session = await sessionModel.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check ownership
    if (session.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only access your own session" });
    }

    return res.status(200).json({ success: true, session });
  } catch (err) {
    console.error("Error deleting session:", err);
    return res.status(500).json({ message: "Server error" });
  }

}

