// frontend/src/pages/Wallet.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_BASE = "http://localhost:5000/api";

function Wallet() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    setError("");
    try {
      const [balanceRes, txRes] = await Promise.all([
        axios.get(`${API_BASE}/wallet/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/wallet/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setBalance(balanceRes.data.balance);
      setTransactions(txRes.data);
    } catch (err) {
      setError("Failed to load wallet data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="wallet-page"><p>Loading wallet...</p></div>;

  return (
    <div className="wallet-page">
      <Navbar />
      <h1>My Wallet</h1>

      {error && <p className="wallet-error">{error}</p>}

      <div className="wallet-balance-card">
        <span className="wallet-balance-label">Current Balance</span>
        <span className="wallet-balance-amount">₹{Number(balance).toFixed(2)}</span>
        <p className="wallet-balance-note">
          Need to top up? Visit the canteen counter — admin will add balance to your account.
        </p>
      </div>

      <h2>Transaction History</h2>

      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table className="wallet-tx-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance After</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{new Date(tx.created_at).toLocaleString()}</td>
                <td>{tx.reason}</td>
                <td>
                  <span className={tx.type === "credit" ? "tx-credit" : "tx-debit"}>
                    {tx.type === "credit" ? "+ Credit" : "- Debit"}
                  </span>
                </td>
                <td>₹{Number(tx.amount).toFixed(2)}</td>
                <td>₹{Number(tx.balance_after).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Wallet;