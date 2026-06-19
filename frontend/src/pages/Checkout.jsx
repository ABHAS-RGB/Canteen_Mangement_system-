import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data.items || []);
      setTotal(res.data.grand_total || 0);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to load cart");
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const placeOrder = async () => {
    try {
      setLoading(true);
      setMsg("");
      const res = await API.post("/orders/place");
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
          <button onClick={placeOrder} disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
}
