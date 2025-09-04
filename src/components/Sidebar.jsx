import { Link } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="sb">
      <div className="sb-hello">Bonjour {user?.username || "—"}</div>

      <nav className="sb-nav">
        <div className="sb-section">
          <div className="sb-title">Vinci_Web</div>
          <Link className="sb-item active" to="/">Lotissement</Link>
        </div>

        <div className="sb-section">
          <div className="sb-title">Gestion</div>
          <a className="sb-item">Modifier Date Dépôt</a>
          <a className="sb-item">Clôturer Campagne</a>
          <a className="sb-item">Historique Campagnes</a>
          <a className="sb-item">Historique Dépôts</a>
          <a className="sb-item">Annuler Campagne</a>
        </div>

        <div className="sb-section">
          <div className="sb-title">Outils</div>
          <a className="sb-item">Info Tarifs</a>
          <a className="sb-item">Réémettre annonce</a>
        </div>

        <div className="sb-section">
          <div className="sb-title">Paramètres</div>
          <a className="sb-item">Gestion des Utilisateurs</a>
          <a className="sb-item">Connexion BIP</a>
          <a className="sb-item">Signataires / Émetteurs</a>
          <a className="sb-item">Site de Fabrication</a>
        </div>

        <button className="sb-item danger" onClick={onLogout}>
          Déconnexion
        </button>
      </nav>
    </aside>
  );
}
