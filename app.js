const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

const authRoutes = require("./routes/authRoutes");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cors
app.use(cors());
app.use(express.static("public"));
// api docs
app.use("/api/auth", authRoutes);
