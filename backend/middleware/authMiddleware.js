const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

// Protect Routes
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Access Denied. No Token Provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store admin information in req.user
    req.user = decoded;

    next(); 
  } catch (error) {
    logger.warn(error && (error.stack || error.message) ? (error.stack || error.message) : error);
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

module.exports = authMiddleware;