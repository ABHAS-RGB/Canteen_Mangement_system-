import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Menu() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const canManageMenu = user.role === "admin" || user.role === "staff";

  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    is_available: true,
  });

  const loadMenu = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const res = await API.get("/menu", { params });
      setItems(res.data);
    } catch {
      setMsg("Failed to load menu");
    }
  };

  useEffect(() => {
    loadMenu();
  }, [search, category]);

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
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Menu</h1>
        <p className="page-subtitle">
          {canManageMenu ? "Add, edit, and manage canteen menu items" : "Browse what's available today"}
        </p>

        {canManageMenu && (
          <div className="card">
            <p className="card-label">{editingId ? "Edit item" : "Add new item"}</p>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  className="input-field"
                  name="name"
                  placeholder="Item name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  className="input-field"
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                />
                <div style={{ display: "flex", gap: 12 }}>
                  <input
                    className="input-field"
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    style={{ flex: 1 }}
                  />
                  <input
                    className="input-field"
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={form.is_available}
                    onChange={handleChange}
                  />
                  Available
                </label>

                <div style={{ display: "flex", gap: 10 }}>
                  <button type="submit" className="btn-primary">
                    {editingId ? "Update item" : "Add item"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={resetForm} className="btn-secondary">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
            {msg && <p className="text-success" style={{ marginTop: 12 }}>{msg}</p>}
          </div>
        )}

        <div className="card">
          <p className="card-label">Filter menu</p>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              className="input-field"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              className="input-field"
              placeholder="Filter by category..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ flex: 1 }}
            />
            {(search || category) && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { setSearch(""); setCategory(""); }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <p className="card-label" style={{ margin: "20px 0 10px" }}>
          {canManageMenu ? "All menu items" : "Today's menu"}
        </p>
        <table className="canteen-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              {canManageMenu && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={canManageMenu ? 5 : 4} style={{ textAlign: "center", color: "var(--canteen-text-secondary)" }}>
                  No items found
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <span className={`badge ${item.is_available ? "" : "badge-neutral"}`}>
                      {item.is_available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  {canManageMenu && (
                    <td>
                      <button onClick={() => handleEdit(item)} className="btn-secondary" style={{ marginRight: 8 }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="btn-danger">
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}