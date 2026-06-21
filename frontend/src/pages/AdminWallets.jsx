// frontend/src/pages/AdminWallets.jsx
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

function AdminWallets() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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
      fetchWallets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add balance.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="page-container">
          <p className="text-muted">Loading wallets...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Manage student wallets</h1>
        <p className="page-subtitle">Add balance and view all student wallets</p>

        {error && <p className="text-danger" style={{ marginBottom: 16 }}>{error}</p>}
        {successMsg && <p className="text-success" style={{ marginBottom: 16 }}>{successMsg}</p>}

        <div className="card">
          <p className="card-label">Add balance</p>
          <form onSubmit={handleAddBalance}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <select
                className="input-field"
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

              <input
                className="input-field"
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount (₹) — e.g. 500"
              />

              <input
                className="input-field"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason (optional) — e.g. Counter cash deposit"
              />

              <button type="submit" disabled={submitting} className="btn-primary" style={{ alignSelf: "flex-start" }}>
                {submitting ? "Adding..." : "Add balance"}
              </button>
            </div>
          </form>
        </div>

        <p className="card-label" style={{ margin: "24px 0 10px" }}>All wallets</p>

        <table className="canteen-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Balance</th>
              <th>Last updated</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((w) => (
              <tr key={w.user_id}>
                <td>{w.name}</td>
                <td>{w.email}</td>
                <td>₹{Number(w.balance).toFixed(2)}</td>
                <td>{w.updated_at ? new Date(w.updated_at).toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminWallets;