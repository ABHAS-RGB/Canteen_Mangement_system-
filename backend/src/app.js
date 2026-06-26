const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/admin");
const staffRoutes = require("./routes/staff");
const walletRoutes = require("./routes/walletRoutes");

const app = express();

// Allow ALL origins temporarily to debug if the issue is in the code or infrastructure
app.use(cors({
  origin: true, // true means it will reflect the origin of the request, allowing anything
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Canteen Management API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/wallet", walletRoutes);

module.exports = app;