const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/role');

// GET /api/admin/stats — overview numbers
router.get('/stats', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const [[{ totalOrders }]] = await db.query('SELECT COUNT(*) AS totalOrders FROM orders');
    const [[{ totalRevenue }]] = await db.query('SELECT IFNULL(SUM(total_amount), 0) AS totalRevenue FROM orders');
    const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[{ totalMenuItems }]] = await db.query('SELECT COUNT(*) AS totalMenuItems FROM menu_items');

    res.json({ totalOrders, totalRevenue, totalUsers, totalMenuItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// GET /api/admin/users — list all users
router.get('/users', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// PATCH /api/admin/users/:id/role — change a user's role
router.patch('/users/:id/role', authMiddleware, requireRole('admin'), async (req, res) => {
  const { role } = req.body;
  const valid = ['student', 'staff', 'admin'];

  if (!valid.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ message: 'Role updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update role' });
  }
});

module.exports = router;