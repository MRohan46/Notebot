import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },

  title: { type: String, required: true },
  snippet: { type: String, required: true },
    
  output: { type: Object, required: true }, // full object containing BOTH
  date: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Session", SessionSchema);
