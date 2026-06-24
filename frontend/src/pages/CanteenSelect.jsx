import { useNavigate } from "react-router-dom";

export default function CanteenSelect() {
  const navigate = useNavigate();

  const selectCanteen = (canteen) => {
    localStorage.setItem("canteen", canteen);
    navigate("/dashboard");
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
      <div className="card" style={{ width: 440, padding: 40, textAlign: "center" }}>
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

        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>
          Select your canteen
        </h1>
        <p className="text-muted" style={{ margin: "0 0 32px" }}>
          Choose the canteen you'd like to order from today.
        </p>

        <div style={{ display: "flex", gap: 16 }}>
          <button
            onClick={() => selectCanteen("A-Block")}
            className="btn-secondary"
            style={{
              flex: 1,
              padding: "20px 16px",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              border: "2px solid var(--canteen-border)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--canteen-accent)";
              e.currentTarget.style.background = "var(--canteen-accent-light)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--canteen-border)";
              e.currentTarget.style.background = "#fff";
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>🏫</div>
            A-Block
            <div className="text-muted" style={{ fontSize: 12, fontWeight: 400, marginTop: 4 }}>
              Block A Canteen
            </div>
          </button>

          <button
            onClick={() => selectCanteen("C-Block")}
            className="btn-secondary"
            style={{
              flex: 1,
              padding: "20px 16px",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              border: "2px solid var(--canteen-border)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--canteen-accent)";
              e.currentTarget.style.background = "var(--canteen-accent-light)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--canteen-border)";
              e.currentTarget.style.background = "#fff";
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>🏢</div>
            C-Block
            <div className="text-muted" style={{ fontSize: 12, fontWeight: 400, marginTop: 4 }}>
              Block C Canteen
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}