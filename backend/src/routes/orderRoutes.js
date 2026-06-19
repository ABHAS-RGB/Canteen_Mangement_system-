const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  placeOrder,
  getOrderHistory,
  getOrderDetails,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/place", auth, placeOrder);
router.get("/history", auth, getOrderHistory);
router.get("/:id", auth, getOrderDetails);

module.exports = router;
