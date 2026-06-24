const pool = require("../config/db");

const addToCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { menu_item_id, quantity } = req.body;
    if (!menu_item_id) {
      return res.status(400).json({ message: "user_id and menu_item_id are required" });
    }

    // verify the item exists and is available before adding
    const [menuItem] = await pool.query(
      "SELECT id, is_available FROM menu_items WHERE id = ?",
      [menu_item_id]
    );

    if (menuItem.length === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (!menuItem[0].is_available) {
      return res.status(400).json({ message: "This item is currently unavailable" });
    }

    const qty = quantity && quantity > 0 ? quantity : 1;

    // If item already in cart, increase qty
    const [existing] = await pool.query(
      "SELECT id, quantity FROM carts WHERE user_id = ? AND menu_item_id = ?",
      [user_id, menu_item_id]
    );

    if (existing.length > 0) {
      const newQty = existing[0].quantity + qty;
      await pool.query("UPDATE carts SET quantity = ? WHERE id = ?", [newQty, existing[0].id]);
      return res.json({ message: "Cart quantity updated" });
    }

    await pool.query(
      "INSERT INTO carts (user_id, menu_item_id, quantity) VALUES (?, ?, ?)",
      [user_id, menu_item_id, qty]
    );

    return res.status(201).json({ message: "Item added to cart" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCartByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT c.id, c.user_id, c.menu_item_id, c.quantity,
              m.name, m.price, m.category,
              (c.quantity * m.price) AS item_total
       FROM carts c
       JOIN menu_items m ON c.menu_item_id = m.id
       WHERE c.user_id = ?
       ORDER BY c.id DESC`,
      [userId]
    );

    const total = rows.reduce((sum, r) => sum + Number(r.item_total), 0);

    return res.json({ items: rows, grand_total: total });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const [result] = await pool.query(
      "UPDATE carts SET quantity = ? WHERE id = ? AND user_id = ?",
      [quantity, id, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.json({ message: "Cart item updated" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [result] = await pool.query(
      "DELETE FROM carts WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.json({ message: "Cart item removed" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query("DELETE FROM carts WHERE user_id = ?", [userId]);
    return res.json({ message: "Cart cleared" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addToCart, getCartByUser, updateCartItem, deleteCartItem, clearCart };