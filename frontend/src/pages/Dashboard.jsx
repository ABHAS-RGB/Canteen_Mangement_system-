import { Link } from "react-router-dom";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  {user.role === 'staff' || user.role === 'admin' ? (
  <p><Link to="/staff/orders">Staff: Manage Orders</Link></p>
) : null}
  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Dashboard</h2>
      <p>Welcome, {user.name || "User"}!</p>
      <p>Role: {user.role || "N/A"}</p>
      <p>
        <Link to="/menu">Menu</Link> | <Link to="/cart">Cart</Link> | <Link to="/orders">My Orders</Link>
      </p>
    </div>
  );
}
