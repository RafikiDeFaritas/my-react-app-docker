import { useState } from "react";
import { fetchJSON } from "../lib/http";
import "../styles/auth.css";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (form.password !== form.confirm) {
      return setMsg({ type: "error", text: "Les mots de passe ne correspondent pas" });
    }
    setLoading(true);
    try {
      const data = await fetchJSON("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password
        })
      });
      setMsg({ type: "success", text: `Bienvenue ${data.user.username} !` });
      setForm({ username: "", email: "", password: "", confirm: "" });
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
            <img src="/img/avatar.png" alt="avatar" />
          </div>
          <h1 className="auth-title">Créer un compte</h1>
        </div>

        <form onSubmit={onSubmit}>
          <div className="auth-field">
            <input
              className="auth-input"
              name="username"
              placeholder="Identifiant"
              value={form.username}
              onChange={onChange}
              required
            />
          </div>

          <div className="auth-field">
            <input
              className="auth-input"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="auth-field">
            <input
              className="auth-input"
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>

          <div className="auth-field">
            <input
              className="auth-input"
              type="password"
              name="confirm"
              placeholder="Confirmer le mot de passe"
              value={form.confirm}
              onChange={onChange}
              required
            />
          </div>

          <div className="auth-actions">
            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer le compte"}
            </button>
          </div>

          {msg && (
            <p style={{ color: msg.type === "error" ? "crimson" : "green", marginTop: 8, textAlign:"center" }}>
              {msg.text}
            </p>
          )}
        </form>
      </div>

      <div className="auth-footer-logo">
        <img src="/img/ser-logo.png" alt="SER Informatique" />
      </div>
    </div>
  );
}
