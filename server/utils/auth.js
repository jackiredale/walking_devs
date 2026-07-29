const jwt = require("jsonwebtoken");

const getSecretKey = () => process.env.JWT_SECRET || process.env.SECRET_KEY || "supersecretkey";

const requireAuth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(403).json({ message: "Access denied" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  jwt.verify(token, getSecretKey(), (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
};

module.exports = { getSecretKey, requireAuth };
