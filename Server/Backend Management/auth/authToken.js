const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_Secret_Key, (err, user) => {
    if (err) {
      console.error("Token Verification Error:", err.message);
      return res
        .status(403)
        .json({ message: "Invalid token", error: err.message });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
