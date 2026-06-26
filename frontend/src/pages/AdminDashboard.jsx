import Navbar from "../components/Navbar";
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import API from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
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
      await API.patch(`/admin/users/${userId}/role`, { role });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    } catch {
      alert('Failed to update role');
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="page-container">
          <p className="text-muted">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Admin dashboard</h1>
        <p className="page-subtitle">Overview of orders, revenue, and user management</p>

        {msg && <p className="text-danger" style={{ marginBottom: 16 }}>{msg}</p>}

        {stats && (
          <div className="card-row">
            <div className="stat-card">
              <p className="stat-label">Total orders</p>
              <p className="stat-value">{stats.totalOrders}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Total revenue</p>
              <p className="stat-value">₹{parseFloat(stats.totalRevenue).toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Total users</p>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Menu items</p>
              <p className="stat-value">{stats.totalMenuItems}</p>
            </div>
          </div>
        )}

        <p className="card-label" style={{ margin: "24px 0 10px" }}>Manage users</p>
        <table className="canteen-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Change role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className="badge">{u.role}</span></td>
                <td>
                  <select
                    className="input-field"
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    style={{ width: "auto", padding: "6px 10px" }}
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

        <div className="card" style={{ marginTop: 20 }}>
          <p className="card-label">Menu items</p>
          <p className="text-muted" style={{ marginBottom: 12 }}>
            Add, edit, or remove items from the canteen menu.
          </p>
          <Link to="/admin/menu" className="btn-primary" style={{ textDecoration: "none" }}>
            Go to menu management
          </Link>
        </div>
      </div>
    </div>
  );
}