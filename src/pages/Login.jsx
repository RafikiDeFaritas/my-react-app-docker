import { useState } from "react";
import { fetchJSON } from "../lib/http";
import "../styles/auth.css";
import avatar from "/img/avatar.png";  
import serLogo from "/img/ser-logo.png";  
import { useNavigate, useLocation } from "react-router-dom";


export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
        const data = await fetchJSON("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: form.identifier.trim(),
          password: form.password
        })
      });
      localStorage.setItem("token", data.token);
      setMsg({ type: "success", text: `Bienvenue ${data.user.username} !` });
      setForm({ identifier: "", password: "" });
      navigate(from, { replace: true });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-avatar">
            <img src={avatar} alt="avatar" />
          </div>
          <h1 className="auth-title">Se connecter</h1>
        </div>

        <form onSubmit={onSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="identifier">Identifiant</label>
            <input
              id="identifier"
              className="auth-input"
              name="identifier"
              placeholder="Identifiant"
              value={form.identifier}
              onChange={onChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              className="auth-input"
              name="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="auth-actions">
            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Connexion"}
            </button>
          </div>

          <div className="auth-links">
            <a className="auth-link" href="#">Mot de passe oublié</a>
          </div>

          {msg && (
            <p style={{ color: msg.type === "error" ? "crimson" : "green", marginTop: 8, textAlign:"center" }}>
              {msg.text}
            </p>
          )}
        </form>
      </div>

      <div className="auth-footer-logo">
        <img src={serLogo} alt="SER Informatique" />
      </div>
    </div>
  );
}
