const express = require("express");
const router = express.Router();

const {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require("../controllers/menuController");

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/role");

// GET — anyone logged in can browse the menu
router.get("/", authMiddleware, getAllMenuItems);

// POST/PUT/DELETE — admin only
router.post("/", authMiddleware, requireRole("admin", "staff"), createMenuItem);
router.put("/:id", authMiddleware, requireRole("admin", "staff"), updateMenuItem);
router.delete("/:id", authMiddleware, requireRole("admin", "staff"), deleteMenuItem);

module.exports = router;