import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const [currentCanteen, setCurrentCanteen] = useState(
    localStorage.getItem("canteen") || "A-Block"
  );
  const [switching, setSwitching] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("canteen");
    navigate("/login");
  };

  const handleCanteenSwitch = async () => {
    const newCanteen = currentCanteen === "A-Block" ? "C-Block" : "A-Block";

    const confirmed = window.confirm(
      `Switching to ${newCanteen} will clear your current cart. Continue?`
    );

    if (!confirmed) return;

    setSwitching(true);
    try {
      // Clear the cart on the backend
      await API.delete("/cart/clear");
    } catch (err) {
      // If clear endpoint doesn't exist yet, fail silently —
      // cart items from the old canteen simply won't show in the new canteen's menu
      console.warn("Cart clear failed:", err.message);
    } finally {
      setSwitching(false);
    }

    localStorage.setItem("canteen", newCanteen);
    setCurrentCanteen(newCanteen);

    // If on menu or cart page, reload so items refresh for new canteen
    if (["/menu", "/cart", "/checkout"].includes(location.pathname)) {
      navigate(0); // triggers a page reload in React Router
    }
  };

  const isActive = (path) => location.pathname === path;
  const initial = (user.name || "U").charAt(0).toUpperCase();

  return (
    <nav className="app-navbar-v2">
      <div className="navbar-v2-links">
        <Link to="/dashboard" className="navbar-v2-brand">
          Canteen
        </Link>

        <Link to="/menu" className={`navbar-v2-link ${isActive("/menu") ? "active" : ""}`}>
          Menu
        </Link>

        {user.role === "student" && (
          <>
            <Link to="/cart" className={`navbar-v2-link ${isActive("/cart") ? "active" : ""}`}>
              Cart
            </Link>
            <Link to="/orders" className={`navbar-v2-link ${isActive("/orders") ? "active" : ""}`}>
              My Orders
            </Link>
            <Link to="/wallet" className={`navbar-v2-link ${isActive("/wallet") ? "active" : ""}`}>
              Wallet
            </Link>
          </>
        )}

        {user.role === "staff" && (
          <Link to="/staff/orders" className={`navbar-v2-link ${isActive("/staff/orders") ? "active" : ""}`}>
            Staff Orders
          </Link>
        )}

        {user.role === "admin" && (
          <>
            <Link to="/admin" className={`navbar-v2-link ${isActive("/admin") ? "active" : ""}`}>
              Admin
            </Link>
            <Link to="/admin/menu" className={`navbar-v2-link ${isActive("/admin/menu") ? "active" : ""}`}>
              Manage Menu
            </Link>
            <Link to="/admin/wallets" className={`navbar-v2-link ${isActive("/admin/wallets") ? "active" : ""}`}>
              Manage Wallets
            </Link>
          </>
        )}
      </div>

      <div className="navbar-v2-user">
        {/* Canteen switcher — students only */}
        {user.role === "student" && (
          <button
            onClick={handleCanteenSwitch}
            disabled={switching}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid var(--canteen-accent)",
              background: "var(--canteen-accent-light)",
              color: "var(--canteen-accent-dark)",
              fontSize: 13,
              fontWeight: 500,
              cursor: switching ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              fontFamily: "inherit",
            }}
          >
            🏫 {currentCanteen} ▾
          </button>
        )}

        <div className="navbar-v2-avatar">{initial}</div>
        <button className="navbar-v2-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}