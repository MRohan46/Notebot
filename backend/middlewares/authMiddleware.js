import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

    req.user = { id: decoded.id }; // or full user info if encoded
    next();
  } catch (err) {
    console.error("Token verification failed:", err.name);
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
};
