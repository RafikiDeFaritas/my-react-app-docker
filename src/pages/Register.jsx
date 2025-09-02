import { useState } from "react";
import { fetchJSON } from "../lib/http";

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
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>Créer un compte</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Username</label><br />
          <input name="username" value={form.username} onChange={onChange} required />
        </div>
        <div>
          <label>Email</label><br />
          <input type="email" name="email" value={form.email} onChange={onChange} required />
        </div>
        <div>
          <label>Mot de passe (≥ 8)</label><br />
          <input type="password" name="password" value={form.password} onChange={onChange} required />
        </div>
        <div>
          <label>Confirmer le mot de passe</label><br />
          <input type="password" name="confirm" value={form.confirm} onChange={onChange} required />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? "Création..." : "S’inscrire"}
        </button>
      </form>
      {msg && <p style={{ color: msg.type === "error" ? "crimson" : "green", marginTop: 12 }}>{msg.text}</p>}
    </div>
  );
}
