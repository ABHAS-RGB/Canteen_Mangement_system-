import Navbar from "../components/Navbar";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '', is_available: true });
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/menu', { headers });
      setItems(res.data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to load menu.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', price: '', description: '', category: '', is_available: true });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/menu/${editingId}`, form, { headers });
      } else {
        await axios.post('http://localhost:5000/api/menu', form, { headers });
      }
      resetForm();
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save item');
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      price: item.price,
      description: item.description || '',
      category: item.category || '',
      is_available: !!item.is_available,
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/menu/${id}`, { headers });
      fetchItems();
    } catch {
      alert('Failed to delete item');
    }
  };

  useEffect(() => { fetchItems(); }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Navbar />
      <h2>Admin — Menu Management</h2>
      {msg && <p style={{ color: 'red' }}>{msg}</p>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          placeholder="Item name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          placeholder="Price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          placeholder="Category (e.g. Snacks, Beverages)"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
          style={inputStyle}
        />
        <input
          placeholder="Description (optional)"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          style={inputStyle}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={form.is_available}
            onChange={e => setForm({ ...form, is_available: e.target.checked })}
          />
          Available
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" style={btnPrimary}>
            {editingId ? 'Update Item' : 'Add Item'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={btnSecondary}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 style={{ marginTop: '2rem' }}>Current Menu</h3>
      {loading ? <p>Loading...</p> : items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        items.map(item => (
          <div key={item.id} style={itemCard}>
            <div>
              <strong>{item.name}</strong> — ₹{parseFloat(item.price).toFixed(2)}
              {item.category && <span style={{ color: '#666', marginLeft: '8px', fontSize: '0.8rem' }}>[{item.category}]</span>}
              {!item.is_available && <span style={{ color: '#dc2626', marginLeft: '8px', fontSize: '0.8rem' }}>(unavailable)</span>}
              {item.description && <p style={{ fontSize: '0.85rem', color: '#666', margin: '4px 0 0' }}>{item.description}</p>}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => handleEdit(item)} style={btnSecondary}>Edit</button>
              <button onClick={() => handleDelete(item.id)} style={btnDanger}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const formStyle = { display: 'flex', flexDirection: 'column', gap: '10px', background: '#f9fafb', padding: '1rem', borderRadius: '10px' };
const inputStyle = { padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db' };
const btnPrimary = { padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const btnSecondary = { padding: '6px 12px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' };
const btnDanger = { padding: '6px 12px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' };
const itemCard = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.8rem 1rem', marginTop: '0.6rem' };