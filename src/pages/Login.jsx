import { useState } from "react";
import { fetchJSON } from "../lib/http";

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
        const data = await fetchJSON("http://localhost:3000/api/login", {
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
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const testMe = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setMsg({ type: "error", text: "Pas de token. Connecte-toi d’abord." });
      const data = await fetchJSON("/api/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg({ type: "success", text: `Connecté en tant que ${data.user.username}` });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setMsg({ type: "success", text: "Déconnexion effectuée." });
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>Se connecter</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Username ou Email</label><br />
          <input name="identifier" value={form.identifier} onChange={onChange} autoComplete="username" required />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Mot de passe</label><br />
          <input type="password" name="password" value={form.password} onChange={onChange} autoComplete="current-password" required />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      {msg && <p style={{ color: msg.type === "error" ? "crimson" : "green", marginTop: 12 }}>{msg.text}</p>}

      <hr style={{ margin: "16px 0" }} />
      <button onClick={testMe}>Tester /api/me</button>
      <button style={{ marginLeft: 8 }} onClick={logout}>Se déconnecter</button>
    </div>
  );
}
