import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMsg("Login successful");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    }
  };

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
          Welcome back
        </h1>
        <p className="text-muted" style={{ margin: "0 0 28px" }}>
          Sign in to your Canteen account to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
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
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 20 }}>
            Sign in
          </button>
        </form>

        {msg && (
          <p
            className={msg.toLowerCase().includes("success") ? "text-success" : "text-danger"}
            style={{ marginTop: 16 }}
          >
            {msg}
          </p>
        )}

        <p className="text-muted" style={{ marginTop: 24 }}>
          New user? <Link to="/register" style={{ color: "var(--canteen-accent)", fontWeight: 500 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}