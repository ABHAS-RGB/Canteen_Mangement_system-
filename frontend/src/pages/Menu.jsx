import { useEffect, useState } from "react";
import API from "../services/api";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    is_available: true,
  });

  const loadMenu = async () => {
    try {
      const res = await API.get("/menu");
      setItems(res.data);
    } catch {
      setMsg("Failed to load menu");
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", category: "", is_available: true });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const payload = { ...form, price: Number(form.price) };

      if (editingId) {
        await API.put(`/menu/${editingId}`, payload);
        setMsg("Menu item updated");
      } else {
        await API.post("/menu", payload);
        setMsg("Menu item added");
      }

      resetForm();
      loadMenu();
    } catch (err) {
      setMsg(err.response?.data?.message || "Action failed");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      category: item.category || "",
      is_available: !!item.is_available,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await API.delete(`/menu/${id}`);
      setMsg("Menu item deleted");
      loadMenu();
    } catch (err) {
      setMsg(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: "0 12px" }}>
      <h2>Menu Management</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input name="name" placeholder="Item name" value={form.name} onChange={handleChange} required style={{ width: "100%", marginBottom: 8 }} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} style={{ width: "100%", marginBottom: 8 }} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required style={{ width: "100%", marginBottom: 8 }} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} style={{ width: "100%", marginBottom: 8 }} />
        <label style={{ display: "block", marginBottom: 8 }}>
          <input type="checkbox" name="is_available" checked={form.is_available} onChange={handleChange} /> Available
        </label>

        <button type="submit">{editingId ? "Update Item" : "Add Item"}</button>
        {editingId && (
          <button type="button" onClick={resetForm} style={{ marginLeft: 8 }}>
            Cancel
          </button>
        )}
      </form>

      {msg && <p>{msg}</p>}

      <h3>All Menu Items</h3>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Available</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>₹{item.price}</td>
              <td>{item.is_available ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ marginLeft: 8 }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
