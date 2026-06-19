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
    <div style={{ maxWidth: 1000, margin: "30px auto", padding: "0 12px" }}>
      <h2>Cart Module</h2>
      <p>
        <Link to="/menu">Menu</Link> | <Link to="/checkout">Checkout</Link> | <Link to="/orders">My Orders</Link>
      </p>
      {msg && <p>{msg}</p>}

      <h3>Menu</h3>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
        <thead>
          <tr>
            <th>Name</th><th>Category</th><th>Price</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.category}</td>
              <td>₹{m.price}</td>
              <td><button onClick={() => addToCart(m.id)}>Add to Cart</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Your Cart</h3>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Item</th><th>Price</th><th>Qty</th><th>Total</th><th>Actions</th>
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
                    <button onClick={() => updateQty(c.id, c.quantity + 1)}>+</button>
                    <button onClick={() => updateQty(c.id, c.quantity - 1)} style={{ marginLeft: 6 }}>-</button>
                    <button onClick={() => removeItem(c.id)} style={{ marginLeft: 6 }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 style={{ marginTop: 12 }}>Grand Total: Rs. {total}</h3>
          <Link to="/checkout">
            <button>Go to Checkout</button>
          </Link>
        </>
      )}
    </div>
  );
}
