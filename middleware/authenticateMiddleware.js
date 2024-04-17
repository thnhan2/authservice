const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyRole = (roles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Access denied, no token provided." });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userRole = decoded.role;

      if (roles.includes(userRole)) {
        next();
      } else {
        res
          .status(403)
          .json({ message: "Access denied, insufficient permissions." });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid token", error: error.message });
    }
  };
};

module.exports = verifyRole;
