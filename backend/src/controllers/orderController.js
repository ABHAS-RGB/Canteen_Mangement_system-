const pool = require("../config/db");

const placeOrder = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const userId = req.user.id;

    await connection.beginTransaction();

    const [cartItems] = await connection.query(
      `SELECT c.menu_item_id, c.quantity, m.price, m.name
       FROM carts c
       JOIN menu_items m ON c.menu_item_id = m.id
       WHERE c.user_id = ?`,
      [userId]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const [orderResult] = await connection.query(
      "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)",
      [userId, totalAmount, "Pending"]
    );

    const orderId = orderResult.insertId;

    const orderItemValues = cartItems.map((item) => [
      orderId,
      item.menu_item_id,
      item.quantity,
      item.price,
      Number(item.price) * Number(item.quantity),
    ]);

    await connection.query(
      `INSERT INTO order_items
       (order_id, menu_item_id, quantity, price, subtotal)
       VALUES ?`,
      [orderItemValues]
    );

    await connection.query("DELETE FROM carts WHERE user_id = ?", [userId]);

    await connection.commit();

    return res.status(201).json({
      message: "Order placed successfully",
      order_id: orderId,
      total_amount: totalAmount,
      status: "Pending",
    });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    connection.release();
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await pool.query(
      `SELECT id, total_amount, status, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [orders] = await pool.query(
      `SELECT id, total_amount, status, created_at
       FROM orders
       WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const [items] = await pool.query(
      `SELECT oi.id, oi.menu_item_id, oi.quantity, oi.price, oi.subtotal,
              m.name, m.category
       FROM order_items oi
       LEFT JOIN menu_items m ON oi.menu_item_id = m.id
       WHERE oi.order_id = ?
       ORDER BY oi.id ASC`,
      [id]
    );

    return res.json({ order: orders[0], items });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  placeOrder,
  getOrderHistory,
  getOrderDetails,
};
