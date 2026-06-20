-- ============================================
-- Wallet Module: Database Schema
-- Run this in your MySQL canteen database
-- ============================================

-- 1. Wallets table — one row per user
CREATE TABLE IF NOT EXISTS wallets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_wallet (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Wallet transactions table — full history log
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  wallet_id INT NOT NULL,
  user_id INT NOT NULL,
  type ENUM('credit', 'debit') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  reason VARCHAR(255) NOT NULL,        -- e.g. 'Admin top-up', 'Order #45 payment', 'Order #45 refund'
  order_id INT NULL,                   -- nullable, set when transaction is tied to an order
  balance_after DECIMAL(10,2) NOT NULL,-- snapshot of balance right after this transaction
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- 3. Add payment_method to orders (so we know how each order was paid)
ALTER TABLE orders
  ADD COLUMN payment_method ENUM('wallet', 'cash') NOT NULL DEFAULT 'cash' AFTER total_amount;
