import { useState } from "react";
import { useAuth } from "./App";

export default function LoginRegister() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        const res = await fetch(
          "https://notes-backend-xs1f.onrender.com/api/users/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: form.email,
              password: form.password,
            }),
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");
        login(data.accesstoken);
      } else {
        const res = await fetch(
          "https://notes-backend-xs1f.onrender.com/api/users/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: form.username,
              fullname: form.fullname,
              email: form.email,
              password: form.password,
            }),
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");
        setMode("login");
        setError("Registration successful! Please log in.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card profile-card">
        <h2
          style={{
            marginBottom: "1.5rem",
            textAlign: "center",
            background: "linear-gradient(90deg, #00eaff 0%, #6f00ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
            fontSize: "1.5rem",
            letterSpacing: "1px",
          }}
        >
          {mode === "login" ? "Login" : "Register"}
        </h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          {mode === "register" && (
            <>
              <label htmlFor="username">Username</label>
              <input
                name="username"
                id="username"
                value={form.username}
                onChange={handleChange}
                required
              />
              <label htmlFor="fullname">Full Name</label>
              <input
                name="fullname"
                id="fullname"
                value={form.fullname}
                onChange={handleChange}
                required
              />
            </>
          )}
          <label htmlFor="email">Email</label>
          <input
            name="email"
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            name="password"
            id="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="futuristic-btn" disabled={loading}>
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Registering..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>
        <div style={{ marginTop: "1.2rem", textAlign: "center" }}>
          <button
            type="button"
            style={{
              background: "none",
              color: "#222",
              border: "none",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "0.98rem",
            }}
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login"
              ? "No account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
        {error && (
          <div
            style={{
              color: error.startsWith("Registration successful")
                ? "green"
                : "crimson",
              marginTop: "1rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
