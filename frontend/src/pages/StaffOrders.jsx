import Navbar from "../components/Navbar";
import { useEffect, useState } from 'react';
import axios from 'axios';

const STATUSES = ['pending', 'preparing', 'ready', 'delivered'];

const statusColor = {
  pending:   { background: '#fef3c7', color: '#92400e' },
  preparing: { background: '#dbeafe', color: '#1e40af' },
  ready:     { background: '#d1fae5', color: '#065f46' },
  delivered: { background: '#f3f4f6', color: '#374151' },
};

export default function StaffOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/staff/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/staff/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status } : o)
      );
    } catch {
      alert('Failed to update status');
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '820px', margin: '0 auto' }}>
      <Navbar />
      <h2>Staff — Order Management</h2>
      {msg && <p style={{ color: 'red' }}>{msg}</p>}

      {loading ? <p>Loading orders...</p> : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={cardStyle}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Order #{order.id}</strong>
                <span style={{ marginLeft: '10px', fontSize: '0.85rem', color: '#666' }}>
                  {order.student_email}
                </span>
              </div>
              <span style={{ ...badgeStyle, ...statusColor[order.status] }}>
                {order.status}
              </span>
            </div>

            <ul style={{ margin: '0.6rem 0', paddingLeft: '1.2rem' }}>
              {(order.items || []).map(item => (
                <li key={item.id} style={{ fontSize: '0.9rem' }}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(order.id, s)}
                  style={{
                    ...btnStyle,
                    background: order.status === s ? '#2563eb' : '#e5e7eb',
                    color: order.status === s ? '#fff' : '#374151',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
              ₹{parseFloat(order.total_amount).toFixed(2)} —{' '}
              {new Date(order.created_at).toLocaleString()}
            </p>

          </div>
        ))
      )}
    </div>
  );
}

const cardStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: '10px',
  padding: '1rem 1.2rem',
  marginTop: '1rem',
  background: '#f9fafb',
};

const badgeStyle = {
  padding: '3px 12px',
  borderRadius: '12px',
  fontSize: '0.8rem',
  fontWeight: 500,
};

const btnStyle = {
  padding: '5px 14px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.82rem',
};