import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Basic required fields check
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email validation (simple pattern)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Password validation (length + at least 1 number)
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const digitRegex = /[0-9]/;
    if (!digitRegex.test(password)) {
      return res.status(400).json({ message: "Password must contain at least one number" });
    }

    // Check existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash and create
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate token
    const token = generateToken(user._id);

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    // Send response
    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserData = async (req, res) => {
  try {
    // Assuming req.user.id contains the user ID (ensure req.user is populated)
    const userId = req.user.id;

    // Find the user by their ID
    const user = await userModel.findById(userId);

    // If no user is found, return an error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data (excluding sensitive information if necessary)
    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      // You can add more fields depending on what you want to return
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
