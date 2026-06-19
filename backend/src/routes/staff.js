const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/role');

// GET /api/staff/orders
// GET /api/staff/orders
router.get('/orders', authMiddleware, requireRole('staff', 'admin'), async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, u.email AS student_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    for (const order of orders) {
      const [items] = await db.query(`
        SELECT oi.*, m.name FROM order_items oi
        JOIN menu_items m ON oi.menu_item_id = m.id
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

module.exports = router;

