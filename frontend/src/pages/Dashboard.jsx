export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Dashboard</h2>
      <p>Welcome, {user.name || "User"}!</p>
      <p>Role: {user.role || "N/A"}</p>
    </div>
  );
}
