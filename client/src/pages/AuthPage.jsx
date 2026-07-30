import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";
import "./AuthPage.css";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const { setUser } = useSession();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("authToken", data.token);
        setUser({
          username: data.user.username,
          id: data.user.id,
        });
        navigate("/");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-visual" />

        <div className="auth-form-side">
          <div className="auth-tabs">
            <button
              className={mode === "login" ? "tab active" : "tab"}
              onClick={() => setMode("login")}
              type="button"
            >
              Login
            </button>
            <button
              className={mode === "register" ? "tab active" : "tab"}
              onClick={() => setMode("register")}
              type="button"
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {mode === "register" && (
              <div className="field">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="auth-footer">
              {mode === "login" && <a href="/forgot-password">Forgot password?</a>}
              <button type="submit" className="btn-auth">
                {mode === "login" ? "Login →" : "Register →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}