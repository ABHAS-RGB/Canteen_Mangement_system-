import Navbar from "../components/Navbar";
import { useEffect, useState } from 'react';
import API from "../services/api";

const STATUSES = ['pending', 'preparing', 'ready', 'delivered'];

const statusBadgeClass = {
  pending: "badge-warning",
  preparing: "badge-warning",
  ready: "",
  delivered: "badge-neutral",
};

export default function StaffOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await API.get('/staff/orders');
      setOrders(res.data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.patch(`/staff/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch {
      alert('Failed to update status');
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Staff — order management</h1>
        <p className="page-subtitle">Update order status as items are prepared</p>

        {msg && <p className="text-danger" style={{ marginBottom: 16 }}>{msg}</p>}

        {loading ? (
          <p className="text-muted">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="card"><p className="text-muted">No orders yet.</p></div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <span className="card-title">Order #{order.id}</span>
                  <span className="text-muted" style={{ marginLeft: 10 }}>{order.student_email}</span>
                  {order.canteen && (
                    <span className="badge badge-neutral" style={{ marginLeft: 8 }}>{order.canteen}</span>
                  )}
                </div>
                <span className={`badge ${statusBadgeClass[order.status] || ""}`}>
                  {order.status}
                </span>
              </div>

              <ul style={{ margin: '0 0 12px', paddingLeft: 20 }}>
                {(order.items || []).map(item => (
                  <li key={item.id} style={{ fontSize: 14 }}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                {STATUSES.map(s => (
                  <button key={s} onClick={() => updateStatus(order.id, s)}
                    className={order.status === s ? "btn-primary" : "btn-secondary"}
                    style={{ fontSize: 13, padding: "7px 14px" }}>
                    {s}
                  </button>
                ))}
              </div>

              <p className="text-muted" style={{ margin: 0 }}>
                ₹{parseFloat(order.total_amount).toFixed(2)} —{' '}
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}