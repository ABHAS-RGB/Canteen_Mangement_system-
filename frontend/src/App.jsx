import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from './pages/AdminDashboard';
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import StaffOrders from './pages/StaffOrders';
import AdminMenu from './pages/AdminMenu';
import Wallet from "./pages/Wallet";
import AdminWallets from "./pages/AdminWallets";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  if (allowedRoles) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" />;
    }
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/wallet" element={<ProtectedRoute allowedRoles={["student"]}><Wallet /></ProtectedRoute>} />
        <Route path="/admin/wallets" element={<ProtectedRoute allowedRoles={["admin"]}><AdminWallets /></ProtectedRoute>} />
        <Route path="/admin/menu" element={<ProtectedRoute allowedRoles={["admin", "staff"]}><AdminMenu /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute allowedRoles={["student"]}><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute allowedRoles={["student"]}><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute allowedRoles={["student"]}><Orders /></ProtectedRoute>} />
        <Route path="/staff/orders" element={<ProtectedRoute allowedRoles={["admin", "staff"]}><StaffOrders /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}