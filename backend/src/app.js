const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Canteen Management API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);

module.exports = app;
