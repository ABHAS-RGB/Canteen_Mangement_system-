import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    accessCode: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await API.post("/auth/register", form);
      setMsg(res.data.message || "Registered successfully");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  const needsCode = form.role === "staff" || form.role === "admin";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--canteen-bg)",
      }}
    >
      <div
        className="card"
        style={{
          width: 380,
          padding: 36,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "var(--canteen-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: 22,
            color: "#fff",
            fontWeight: 700,
          }}
        >
          C
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>
          Create an account
        </h1>
        <p className="text-muted" style={{ margin: "0 0 28px" }}>
          Sign up to start ordering from the canteen.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
            <input
              className="input-field"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="input-field"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="input-field"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <select
              className="input-field"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>

            {needsCode && (
              <input
                className="input-field"
                name="accessCode"
                type="text"
                placeholder={`${form.role === "admin" ? "Admin" : "Staff"} access code`}
                value={form.accessCode}
                onChange={handleChange}
                required
              />
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 20 }}>
            Create account
          </button>
        </form>

        {msg && (
          <p
            className={msg.toLowerCase().includes("success") || msg.toLowerCase().includes("registered") ? "text-success" : "text-danger"}
            style={{ marginTop: 16 }}
          >
            {msg}
          </p>
        )}

        <p className="text-muted" style={{ marginTop: 24 }}>
          Already have an account? <Link to="/login" style={{ color: "var(--canteen-accent)", fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}