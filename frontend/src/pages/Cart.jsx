import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Cart() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [msg, setMsg] = useState("");

  const loadMenu = async () => {
    const res = await API.get("/menu");
    setMenu(res.data);
  };

  const loadCart = async () => {
    if (!userId) return;
    const res = await API.get("/cart");

    setCart(res.data.items || []);
    setTotal(res.data.grand_total || 0);
  };

  useEffect(() => {
    loadMenu();
    loadCart();
  }, []);

  const addToCart = async (menuItemId) => {
    try {
      await API.post("/cart/add", { menu_item_id: menuItemId, quantity: 1 });
      setMsg("Added to cart");
      loadCart();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to add");
    }
  };

  const updateQty = async (cartId, quantity) => {
    if (quantity < 1) return;
    await API.put(`/cart/${cartId}`, { quantity });
    loadCart();
  };

  const removeItem = async (cartId) => {
    await API.delete(`/cart/${cartId}`);
    loadCart();
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Cart</h1>
        <p className="page-subtitle">Browse the menu and build your order</p>

        {msg && <p className="text-success" style={{ marginBottom: 16 }}>{msg}</p>}

        <p className="card-label" style={{ marginBottom: 10 }}>Menu</p>
        <table className="canteen-table" style={{ marginBottom: 24 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.category}</td>
                <td>₹{m.price}</td>
                <td>
                  <button onClick={() => addToCart(m.id)} className="btn-secondary">
                    Add to cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="card-label" style={{ marginBottom: 10 }}>Your cart</p>

        {cart.length === 0 ? (
          <div className="card">
            <p className="text-muted">No items in cart</p>
          </div>
        ) : (
          <>
            <table className="canteen-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>₹{c.price}</td>
                    <td>{c.quantity}</td>
                    <td>₹{c.item_total}</td>
                    <td>
                      <button onClick={() => updateQty(c.id, c.quantity + 1)} className="btn-secondary" style={{ padding: "6px 12px" }}>
                        +
                      </button>
                      <button onClick={() => updateQty(c.id, c.quantity - 1)} className="btn-secondary" style={{ padding: "6px 12px", marginLeft: 6 }}>
                        −
                      </button>
                      <button onClick={() => removeItem(c.id)} className="btn-danger" style={{ marginLeft: 6 }}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="card" style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p className="card-label">Grand total</p>
                <p className="card-title">₹{total}</p>
              </div>
              <Link to="/checkout" className="btn-primary" style={{ textDecoration: "none" }}>
                Go to checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}