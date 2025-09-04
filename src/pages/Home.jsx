import { useEffect, useState } from "react";
import { fetchJSON } from "../lib/http";
import { logout } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [me, setMe] = useState(null);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await fetchJSON("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMe(data);
      } catch (e) {
        setErr(e.message || "Erreur");
      }
    })();
  }, []);

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Accueil</h1>
        <button onClick={onLogout}>Se déconnecter</button>
      </div>

      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {me ? (
        <div style={{ marginTop: 12 }}>
          <p>Bienvenue <strong>{me.username}</strong> 👋</p>
          <p>Email : {me.email}</p>
          {/* mets ici ton contenu d’accueil */}
        </div>
      ) : !err ? (
        <p>Chargement…</p>
      ) : null}
    </div>
  );
}
