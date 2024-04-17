const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res, next) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);

    const userExists = await User.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });
    if (userExists) {
      return res.json({
        message: "User already exists!",
      });
    }

    const role = req.body.role;
    if (role !== "manager" && role !== "waiter" && role !== "chef") {
      return res.json({
        message: "Invalid role!",
      });
    }

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPass,
      role: req.body.role,
    });

    await user.save();
    res.json({
      message: "User added successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred!",
      error: error.message,
    });
  }
};

const login = (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({
    $or: [{ email: username }, { phone: username }, { username: username }],
  }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          res.json({
            error: err,
          });
        } else {
          if (result) {
            let token = jwt.sign(
              { name: user.name, role: user.role, userId: user._id },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME }
            );
            let refreshToken = jwt.sign(
              { name: user.name, role: user.role, userId: user._id },
              process.env.REFRESH_TOKEN_SECRET,
              { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME }
            );
            res.json({
              token,
              username: user.username,
            });
          } else {
            res.json({
              message: "Password does not match!",
            });
          }
        }
      });
    } else {
      res.json({
        message: "User not found!",
      });
    }
  });
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const token = generateToken(decoded);
    res.status(200).json({
      message: "Token refreshed successfully",
      token,
      refreshToken,
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid refresh token",
      error: error.message,
    });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { name: user.name, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    }
  );
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred!",
      error: error.message,
    });
  }
};

module.exports = { register, login, refreshToken, getUsers };
