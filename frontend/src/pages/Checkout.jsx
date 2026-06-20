import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [walletBalance, setWalletBalance] = useState(null);

  const loadCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data.items || []);
      setTotal(res.data.grand_total || 0);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to load cart");
    }
  };

  const loadWalletBalance = async () => {
    try {
      const res = await API.get("/wallet/balance");
      setWalletBalance(res.data.balance);
    } catch (err) {
      setWalletBalance(null);
    }
  };

  useEffect(() => {
    loadCart();
    loadWalletBalance();
  }, []);

  const placeOrder = async () => {
    try {
      setLoading(true);
      setMsg("");

      const res = await API.post("/orders/place", { payment_method: paymentMethod });

      setMsg(res.data.message || "Order placed successfully");
      setCart([]);
      setTotal(0);

      setTimeout(() => {
        navigate("/orders");
      }, 800);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const walletInsufficient =
    walletBalance !== null && Number(walletBalance) < Number(total);

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">Review your order and choose a payment method</p>

        {msg && <p className="text-success" style={{ marginBottom: 16 }}>{msg}</p>}

        {cart.length === 0 ? (
          <div className="card">
            <p className="text-muted">No items available for checkout.</p>
            <Link to="/menu" className="btn-secondary" style={{ textDecoration: "none", display: "inline-block", marginTop: 12 }}>
              Browse menu
            </Link>
          </div>
        ) : (
          <>
            <p className="card-label" style={{ marginBottom: 10 }}>Order summary</p>
            <table className="canteen-table" style={{ marginBottom: 20 }}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>₹{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.item_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="card">
              <p className="card-label">Payment method</p>

              <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                Cash on pickup
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", cursor: walletInsufficient ? "not-allowed" : "pointer" }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="wallet"
                  checked={paymentMethod === "wallet"}
                  onChange={() => setPaymentMethod("wallet")}
                  disabled={walletInsufficient}
                />
                Pay with wallet
                {walletBalance !== null && (
                  <span className={walletInsufficient ? "badge badge-danger" : "badge"}>
                    Balance: ₹{Number(walletBalance).toFixed(2)}
                    {walletInsufficient ? " — insufficient" : ""}
                  </span>
                )}
              </label>
            </div>

            <div className="card" style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p className="card-label">Grand total</p>
                <p className="card-title">₹{total}</p>
              </div>
              <button onClick={placeOrder} disabled={loading} className="btn-primary">
                {loading ? "Placing order..." : "Place order"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}