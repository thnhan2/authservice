const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const session = require("express-session");

require("dotenv").config();

// Quá trình đăng ký
const register = (req, res, next) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    } else {
      let user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: hashedPass,
        role: req.body.role, // Thêm phần "role" từ request body
      });

      user
        .save()
        .then((user) => {
          res.json({
            message: "User added successfully!",
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "An error occurred!",
          });
        });
    }
  });
};

// login process
const login = (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    //session 
    User.findOne({$or: [{email:username}, {phone:username}]})
    .then(user => {
        if (user) {
            bcrypt.compare(password, user.password, function(err, result) {
                if (err) {
                    res.json({
                        error: err
                    });
                } else {
                    if (result) {
                        let token = jwt.sign({name: user.name, role: user.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME});
                        let refreshToken = jwt.sign({name: user.name}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME});    
                        req.session.token = refreshToken
                        res.json({
                            message: 'Login Successful!',
                            token,
                            refreshToken
                        });
                    } else {
                        res.json({
                            message: 'Password does not match!'
                        });
                    }
                }
            });
        } else {
            res.json({
                message: 'User not found!'
            });
        }
    });
}


const refreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  jwt.verify(refreshToken, "refreshtokensecret", (err, decode) => {
    if (err) {
      res.status(400).json({
        err,
      });
    } else {
      let token = jwt.sign(
        { name: decode.name, role: decode.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      let refreshToken = req.body.refreshToken;

      res.status(200).json({
        message: "Token refreshed successfully",
        token,
        refreshToken,
      });
    }
  });
};

module.exports = { register, login, refreshToken };
