import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user.name || "User"}</p>

        <div className="card">
          <p className="card-label">Logged in as</p>
          <p className="card-title">{user.name || "User"}</p>
          <span className="badge">{user.role || "N/A"}</span>
        </div>

        <div className="card">
          <p className="card-label">Quick links</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <Link to="/menu" className="btn-secondary" style={{ textDecoration: "none" }}>
              Menu
            </Link>
            <Link to="/cart" className="btn-secondary" style={{ textDecoration: "none" }}>
              Cart
            </Link>
            <Link to="/orders" className="btn-secondary" style={{ textDecoration: "none" }}>
              My Orders
            </Link>

            {(user.role === "staff" || user.role === "admin") && (
              <Link to="/staff/orders" className="btn-primary" style={{ textDecoration: "none" }}>
                Staff: Manage Orders
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}