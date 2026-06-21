import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
        <div className="navbar-v2-avatar">{initial}</div>
        <button className="navbar-v2-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}