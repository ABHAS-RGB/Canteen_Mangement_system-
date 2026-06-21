import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const statusBadgeClass = {
  pending: "badge-warning",
  preparing: "badge-warning",
  ready: "",
  delivered: "badge-neutral",
};

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
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">My orders</h1>
        <p className="page-subtitle">Track the status of your past orders</p>

        {msg && <p className="text-danger" style={{ marginBottom: 16 }}>{msg}</p>}

        {orders.length === 0 ? (
          <div className="card">
            <p className="text-muted">No orders placed yet.</p>
            <Link to="/menu" className="btn-secondary" style={{ textDecoration: "none", display: "inline-block", marginTop: 12 }}>
              Browse menu
            </Link>
          </div>
        ) : (
          <table className="canteen-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>₹{order.total_amount}</td>
                  <td>
                    <span className={`badge ${statusBadgeClass[order.status] || ""}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
