const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(400).json({
        message: "Token expired!",
      });
    } else {
      res.status(401).json({
        message: "Authentication failed!",
        error: error.message,
      });
    }
  }
};

module.exports = authenticate;
