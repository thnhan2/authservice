const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
app.use(express.json());    

// Import routes
const authRoutes = require("./routes/authRoutes");
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use("/api/auth", authRoutes);