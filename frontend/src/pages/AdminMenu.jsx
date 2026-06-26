import Navbar from "../components/Navbar";
import { useEffect, useState } from 'react';
import API from "../services/api";

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '', price: '', description: '', category: '', canteen: 'A-Block', is_available: true
  });
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchItems = async () => {
    try {
      const res = await API.get('/menu');
      setItems(res.data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to load menu.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', price: '', description: '', category: '', canteen: 'A-Block', is_available: true });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/menu/${editingId}`, form);
      } else {
        await API.post('/menu', form);
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
      canteen: item.canteen || 'A-Block',
      is_available: !!item.is_available,
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await API.delete(`/menu/${id}`);
      fetchItems();
    } catch {
      alert('Failed to delete item');
    }
  };

  useEffect(() => { fetchItems(); }, []);

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Admin — menu management</h1>
        <p className="page-subtitle">Add, edit, and manage canteen menu items</p>

        {msg && <p className="text-danger" style={{ marginBottom: 16 }}>{msg}</p>}

        <div className="card">
          <p className="card-label">{editingId ? "Edit item" : "Add new item"}</p>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="input-field" placeholder="Item name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input className="input-field" placeholder="Price" type="number" step="0.01"
                value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
              <input className="input-field" placeholder="Category (e.g. Snacks, Beverages)"
                value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
              <input className="input-field" placeholder="Description (optional)"
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <select className="input-field" value={form.canteen}
                onChange={e => setForm({ ...form, canteen: e.target.value })}>
                <option value="A-Block">A-Block Canteen</option>
                <option value="C-Block">C-Block Canteen</option>
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                <input type="checkbox" checked={form.is_available}
                  onChange={e => setForm({ ...form, is_available: e.target.checked })} />
                Available
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update item' : 'Add item'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                )}
              </div>
            </div>
          </form>
        </div>

        <p className="card-label" style={{ margin: '24px 0 10px' }}>Current menu</p>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : items.length === 0 ? (
          <div className="card"><p className="text-muted">No items yet.</p></div>
        ) : (
          items.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p className="card-title" style={{ marginBottom: 4 }}>
                  {item.name} — ₹{parseFloat(item.price).toFixed(2)}
                </p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  {item.category && <span className="badge badge-neutral">{item.category}</span>}
                  <span className="badge">{item.canteen}</span>
                  {!item.is_available && <span className="badge badge-danger">Unavailable</span>}
                </div>
                {item.description && <p className="text-muted" style={{ margin: 0 }}>{item.description}</p>}
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => handleEdit(item)} className="btn-secondary">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="btn-danger">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}