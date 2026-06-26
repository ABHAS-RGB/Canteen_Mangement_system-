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

// CORS — allow localhost in dev, Vercel URL in production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.FRONTEND_URL, // set this in Render env vars once you have your Vercel URL
].filter(Boolean); // removes undefined if FRONTEND_URL not set yet

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (Postman, mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
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