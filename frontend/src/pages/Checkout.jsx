import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // NEW — payment method state + wallet balance (so we can show it and disable wallet if insufficient)
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

  // NEW — fetch wallet balance so the student can see it before choosing
  const loadWalletBalance = async () => {
    try {
      const res = await API.get("/wallet/balance");
      setWalletBalance(res.data.balance);
    } catch (err) {
      // non-fatal — if this fails, just don't show a balance; cash is still available
      setWalletBalance(null);
    }
  };

  useEffect(() => {
    loadCart();
    loadWalletBalance(); // NEW
  }, []);

  const placeOrder = async () => {
    try {
      setLoading(true);
      setMsg("");

      // CHANGED — send payment_method in the request body
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

  // NEW — wallet is only a valid choice if balance covers the order total
  const walletInsufficient =
    walletBalance !== null && Number(walletBalance) < Number(total);

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: "0 12px" }}>
      <h2>Checkout</h2>
      <p>
        <Link to="/cart">Back to Cart</Link> | <Link to="/orders">My Orders</Link>
      </p>

      {msg && <p>{msg}</p>}

      {cart.length === 0 ? (
        <p>No items available for checkout.</p>
      ) : (
        <>
          <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
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
                  <td>Rs. {item.price}</td>
                  <td>{item.quantity}</td>
                  <td>Rs. {item.item_total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Grand Total: Rs. {total}</h3>

          {/* NEW — payment method selector */}
          <div style={{ margin: "16px 0" }}>
            <p style={{ marginBottom: 8, fontWeight: "bold" }}>Payment Method</p>

            <label style={{ display: "block", marginBottom: 6 }}>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              {" "}Cash on Pickup
            </label>

            <label style={{ display: "block", marginBottom: 6 }}>
              <input
                type="radio"
                name="paymentMethod"
                value="wallet"
                checked={paymentMethod === "wallet"}
                onChange={() => setPaymentMethod("wallet")}
                disabled={walletInsufficient}
              />
              {" "}Pay with Wallet
              {walletBalance !== null && (
                <span style={{ marginLeft: 8, color: walletInsufficient ? "red" : "green" }}>
                  (Balance: Rs. {Number(walletBalance).toFixed(2)}
                  {walletInsufficient ? " — insufficient" : ""})
                </span>
              )}
            </label>
          </div>

          <button onClick={placeOrder} disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
}