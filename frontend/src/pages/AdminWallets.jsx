// frontend/src/pages/AdminWallets.jsx
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // CHANGE to match your existing API base URL pattern

function AdminWallets() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Add-balance form state
  const [selectedUserId, setSelectedUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/wallet/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWallets(res.data);
    } catch (err) {
      setError("Failed to load wallets.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBalance = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!selectedUserId || !amount || Number(amount) <= 0) {
      setError("Select a user and enter a valid amount.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${API_BASE}/wallet/admin/add-balance`,
        {
          userId: Number(selectedUserId),
          amount: Number(amount),
          reason: reason || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg(res.data.message);
      setAmount("");
      setReason("");
      setSelectedUserId("");
      fetchWallets(); // refresh table
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add balance.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="admin-wallets-page"><p>Loading wallets...</p></div>;

 return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Navbar />
      <h2>Manage Student Wallets</h2>

      {error && <p className="wallet-error">{error}</p>}
      {successMsg && <p className="wallet-success">{successMsg}</p>}

      <form className="add-balance-form" onSubmit={handleAddBalance}>
        <h2>Add Balance</h2>

        <label>
          Select User
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">-- Select a user --</option>
            {wallets.map((w) => (
              <option key={w.user_id} value={w.user_id}>
                {w.name} ({w.email})
              </option>
            ))}
          </select>
        </label>

        <label>
          Amount (₹)
          <input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 500"
          />
        </label>

        <label>
          Reason (optional)
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Counter cash deposit"
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Balance"}
        </button>
      </form>

      <h2>All Wallets</h2>

      <table className="wallet-tx-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Balance</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {wallets.map((w) => (
            <tr key={w.id}>
              <td>{w.name}</td>
              <td>{w.email}</td>
              <td>₹{Number(w.balance).toFixed(2)}</td>
              <td>{new Date(w.updated_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminWallets;