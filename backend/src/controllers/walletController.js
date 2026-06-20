// backend/src/controllers/walletController.js

const db = require('../config/db'); // adjust this path to match your actual db connection file

// ============================================
// Helper: Get or create a wallet for a user
// ============================================
async function getOrCreateWallet(userId) {
  const [existing] = await db.query('SELECT * FROM wallets WHERE user_id = ?', [userId]);

  if (existing.length > 0) {
    return existing[0];
  }

  const [result] = await db.query(
    'INSERT INTO wallets (user_id, balance) VALUES (?, 0.00)',
    [userId]
  );

  return { id: result.insertId, user_id: userId, balance: 0.00 };
}

// ============================================
// GET /api/wallet/balance
// Student: get own wallet balance
// ============================================
exports.getMyBalance = async (req, res) => {
  try {
    const userId = req.user.id; // comes from your auth middleware

    const wallet = await getOrCreateWallet(userId);

    res.json({ balance: wallet.balance });
  } catch (err) {
    console.error('getMyBalance error:', err);
    res.status(500).json({ message: 'Failed to fetch wallet balance' });
  }
};

// ============================================
// GET /api/wallet/transactions
// Student: get own transaction history
// ============================================
exports.getMyTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const [transactions] = await db.query(
      `SELECT id, type, amount, reason, order_id, balance_after, created_at
       FROM wallet_transactions
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(transactions);
  } catch (err) {
    console.error('getMyTransactions error:', err);
    res.status(500).json({ message: 'Failed to fetch transaction history' });
  }
};

// ============================================
// POST /api/wallet/admin/add-balance
// Admin only: add balance to any student's wallet
// Body: { userId, amount, reason (optional) }
// ============================================
exports.adminAddBalance = async (req, res) => {
  try {
    const { userId, amount, reason } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid userId and positive amount are required' });
    }

    // Confirm target user exists and is a student (optional check, remove if you want admins funding staff too)
    const [users] = await db.query('SELECT id, name, role FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const wallet = await getOrCreateWallet(userId);
    const newBalance = parseFloat(wallet.balance) + parseFloat(amount);

    await db.query('UPDATE wallets SET balance = ? WHERE id = ?', [newBalance, wallet.id]);

    await db.query(
      `INSERT INTO wallet_transactions (wallet_id, user_id, type, amount, reason, balance_after)
       VALUES (?, ?, 'credit', ?, ?, ?)`,
      [wallet.id, userId, amount, reason || 'Admin top-up', newBalance]
    );

    res.json({
      message: `₹${amount} added to ${users[0].name}'s wallet`,
      newBalance
    });
  } catch (err) {
    console.error('adminAddBalance error:', err);
    res.status(500).json({ message: 'Failed to add balance' });
  }
};

// ============================================
// GET /api/wallet/admin/all
// Admin only: view all users' wallet balances
// ============================================
exports.adminGetAllWallets = async (req, res) => {
  try {
    const [wallets] = await db.query(
      `SELECT u.id AS user_id, u.name, u.email,
              COALESCE(w.balance, 0.00) AS balance,
              w.updated_at
       FROM users u
       LEFT JOIN wallets w ON w.user_id = u.id
       WHERE u.role = 'student'
       ORDER BY u.name ASC`
    );

    res.json(wallets);
  } catch (err) {
    console.error('adminGetAllWallets error:', err);
    res.status(500).json({ message: 'Failed to fetch wallets' });
  }
};

// ============================================
// Internal function (NOT a route) — called from orderController.placeOrder
// INSIDE the same DB transaction, so a failed/insufficient-balance debit
// rolls back the whole order automatically.
//
// IMPORTANT: pass the active transaction `connection`, not the pool,
// so this debit is part of the same atomic transaction as order creation.
// Throws an error (code 'INSUFFICIENT_BALANCE') if balance is too low —
// the caller's catch block will rollback and respond.
// ============================================
exports.deductFromWallet = async (connection, userId, amount, orderId) => {
  // Lock the wallet row for this transaction to prevent race conditions
  // (e.g. two simultaneous orders from the same low-balance wallet)
  const [walletRows] = await connection.query(
    'SELECT * FROM wallets WHERE user_id = ? FOR UPDATE',
    [userId]
  );

  let wallet = walletRows[0];

  if (!wallet) {
    const [result] = await connection.query(
      'INSERT INTO wallets (user_id, balance) VALUES (?, 0.00)',
      [userId]
    );
    wallet = { id: result.insertId, user_id: userId, balance: 0.00 };
  }

  if (parseFloat(wallet.balance) < parseFloat(amount)) {
    const err = new Error('Insufficient wallet balance');
    err.code = 'INSUFFICIENT_BALANCE';
    throw err;
  }

  const newBalance = parseFloat(wallet.balance) - parseFloat(amount);

  await connection.query('UPDATE wallets SET balance = ? WHERE id = ?', [newBalance, wallet.id]);

  await connection.query(
    `INSERT INTO wallet_transactions (wallet_id, user_id, type, amount, reason, order_id, balance_after)
     VALUES (?, ?, 'debit', ?, ?, ?, ?)`,
    [wallet.id, userId, amount, `Order #${orderId} payment`, orderId, newBalance]
  );

  return newBalance;
};

// ============================================
// Internal function (NOT a route) — called when an order is cancelled
// and it was paid via wallet, to refund the student.
// ============================================
exports.refundToWallet = async (userId, amount, orderId) => {
  const wallet = await getOrCreateWallet(userId);

  const newBalance = parseFloat(wallet.balance) + parseFloat(amount);

  await db.query('UPDATE wallets SET balance = ? WHERE id = ?', [newBalance, wallet.id]);

  await db.query(
    `INSERT INTO wallet_transactions (wallet_id, user_id, type, amount, reason, order_id, balance_after)
     VALUES (?, ?, 'credit', ?, ?, ?, ?)`,
    [wallet.id, userId, amount, `Order #${orderId} refund`, orderId, newBalance]
  );

  return newBalance;
};