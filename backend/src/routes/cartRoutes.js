const express = require("express");
const auth = require("../middleware/authMiddleware");

const {
  addToCart,
  getCartByUser,
  updateCartItem,
  deleteCartItem,
  clearCart
} = require("../controllers/cartController");

const router = express.Router();

router.delete("/clear", auth, clearCart);
router.post("/add", auth, addToCart);
router.get("/", auth, getCartByUser);
router.put("/:id", auth, updateCartItem);
router.delete("/:id", auth, deleteCartItem);

module.exports = router;