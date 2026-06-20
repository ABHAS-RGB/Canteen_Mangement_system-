import Navbar from "../components/Navbar";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats', { headers }),
        axios.get('http://localhost:5000/api/admin/users', { headers }),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (userId, role) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role },
        { headers }
      );
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    } catch {
      alert('Failed to update role');
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <p style={{ padding: '2rem' }}>Loading admin dashboard...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Navbar />
      <h2>Admin Dashboard</h2>
      {msg && <p style={{ color: 'red' }}>{msg}</p>}

      {/* Stats cards */}
      {stats && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', margin: '1rem 0 2rem' }}>
          <StatCard label="Total Orders" value={stats.totalOrders} />
          <StatCard label="Total Revenue" value={`₹${parseFloat(stats.totalRevenue).toFixed(2)}`} />
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Menu Items" value={stats.totalMenuItems} />
        </div>
      )}

      {/* User management */}
      <h3>Manage Users</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={tdStyle}>{u.name}</td>
              <td style={tdStyle}>{u.email}</td>
              <td style={tdStyle}>{u.role}</td>
              <td style={tdStyle}>
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: '4px' }}
                >
                  <option value="student">student</option>
                  <option value="staff">staff</option>
                  <option value="admin">admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: '2rem' }}>
        Manage menu items here: <a href="/admin/menu">Go to Menu Management</a>
      </p>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{
      flex: '1 1 160px',
      background: '#f3f4f6',
      borderRadius: '10px',
      padding: '1rem',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>{label}</p>
      <p style={{ fontSize: '1.4rem', fontWeight: 600, margin: '4px 0 0' }}>{value}</p>
    </div>
  );
}

const thStyle = { padding: '8px', fontSize: '0.85rem', color: '#555' };
const tdStyle = { padding: '8px', fontSize: '0.9rem' };