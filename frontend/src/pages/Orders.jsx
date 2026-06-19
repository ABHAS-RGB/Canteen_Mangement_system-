import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");

  const loadOrders = async () => {
    try {
      const res = await API.get("/orders/history");
      setOrders(res.data || []);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to load orders");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: "0 12px" }}>
      <h2>My Orders</h2>
      <p>
        <Link to="/menu">Menu</Link> | <Link to="/cart">Cart</Link>
      </p>

      {msg && <p>{msg}</p>}

      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>Rs. {order.total_amount}</td>
                <td>{order.status}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
