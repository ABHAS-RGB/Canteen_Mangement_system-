const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  addToCart,
  getCartByUser,
  updateCartItem,
  deleteCartItem
} = require("../controllers/cartController");

const router = express.Router();

router.post("/add", auth, addToCart);
router.get("/", auth, getCartByUser);
router.put("/:id", auth, updateCartItem);
router.delete("/:id", auth, deleteCartItem);

module.exports = router;
