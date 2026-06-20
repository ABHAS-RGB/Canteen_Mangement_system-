// backend/src/routes/walletRoutes.js

const express = require("express");
const router = express.Router();

const walletController = require("../controllers/walletController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/role");

// ---- Student routes ----
router.get("/balance", authMiddleware, walletController.getMyBalance);
router.get("/transactions", authMiddleware, walletController.getMyTransactions);

// ---- Admin routes ----
router.post("/admin/add-balance", authMiddleware, requireRole("admin"), walletController.adminAddBalance);
router.get("/admin/all", authMiddleware, requireRole("admin"), walletController.adminGetAllWallets);

module.exports = router;