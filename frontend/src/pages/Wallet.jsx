import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Wallet() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchWalletData(); }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    setError("");
    try {
      const [balanceRes, txRes] = await Promise.all([
        API.get('/wallet/balance'),
        API.get('/wallet/transactions'),
      ]);
      setBalance(balanceRes.data.balance);
      setTransactions(txRes.data);
    } catch (err) {
      setError("Failed to load wallet data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="page-container">
          <p className="text-muted">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">My wallet</h1>
        <p className="page-subtitle">View your balance and transaction history</p>

        {error && <p className="text-danger" style={{ marginBottom: 16 }}>{error}</p>}

        <div className="card" style={{ background: "var(--canteen-accent)", color: "#fff", border: "none" }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.85, margin: 0 }}>
            Current balance
          </p>
          <p style={{ fontSize: 36, fontWeight: 700, margin: "6px 0 14px" }}>
            ₹{Number(balance).toFixed(2)}
          </p>
          <p style={{ fontSize: 13, opacity: 0.9, margin: 0 }}>
            Need to top up? Visit the canteen counter — admin will add balance to your account.
          </p>
        </div>

        <p className="card-label" style={{ margin: "24px 0 10px" }}>Transaction history</p>

        {transactions.length === 0 ? (
          <div className="card"><p className="text-muted">No transactions yet.</p></div>
        ) : (
          <table className="canteen-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Balance after</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.created_at).toLocaleString()}</td>
                  <td>{tx.reason}</td>
                  <td>
                    <span className={tx.type === "credit" ? "badge" : "badge badge-danger"}>
                      {tx.type === "credit" ? "+ Credit" : "− Debit"}
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
    </div>
  );
}

export default Wallet;