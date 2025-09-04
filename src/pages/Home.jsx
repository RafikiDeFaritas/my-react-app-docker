import { useEffect, useState } from "react";
import { fetchJSON } from "../lib/http";
import { logout } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import "../styles/home.css"; // styles principaux
import "../components/sidebar.css"; // styles de la sidebar
import avatar from "/img/avatar.png";  
import serLogo from "/img/ser-logo.png";  

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
    <div className="home-shell">
      <Sidebar user={me} onLogout={onLogout} />

      <main className="home-main">
        <header className="home-topbar">
          <h1>Vinci Web</h1>
          <select className="home-select" defaultValue="12">
            <option value="3">3 derniers mois</option>
            <option value="6">6 derniers mois</option>
            <option value="12">12 derniers mois</option>
            <option value="24">24 derniers mois</option>
          </select>
        </header>

        {err && <p className="home-error">{err}</p>}

        {/* rangée 1 : deux tableaux */}
        <section className="grid grid-2">
          <div className="card">
            <div className="card-title">
              <span className="ico">🗂</span> Dépôts en Cours : <b>0</b>
            </div>
            <div className="table-wrap">
              <table className="tab">
                <thead>
                  <tr>
                    <th>N° dépôt</th><th>Type Produit</th><th>Date de dépôt</th>
                    <th>Nb Plis</th><th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["000001", "G2", "13/03/2025", "2888", "Annonce OK"],
                    ["000001", "G2", "13/03/2025", "900", "Annonce OK"],
                    ["000002", "G2", "26/03/2025", "2988", "-"],
                    ["000003", "G3", "17/03/2025", "1624", "Annonce OK"],
                    ["000003", "LR CIP G3", "28/03/2025", "5512", "-"],
                    ["000004", "DP Integral 7", "28/03/2025", "2988", "-"],
                    ["000004", "LR CIP G3", "31/03/2025", "5512", "-"],
                  ].map((r, i) => (
                    <tr key={i}>
                      <td>{r[0]}</td>
                      <td><span className={"pill " + pillClass(r[1])}>{r[1]}</span></td>
                      <td>{r[2]}</td>
                      <td className="num">{r[3]}</td>
                      <td>{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <span className="ico">📋</span> Campagnes en Cours : <b>20</b>
            </div>
            <div className="table-wrap">
              <table className="tab">
                <thead>
                  <tr>
                    <th>N° campagne</th><th>Libellé</th><th>Type Produit</th>
                    <th>Date de dépôt</th><th>Nb Plis</th><th>Statut</th><th>Statut AP</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["000008","TestCampagne","G2","26/05/2025","1624","Clôturée","-"],
                    ["000009","TestCCCC","DP UP","23/05/2025","1085","—","—"],
                    ["000012","CAMPAGNE 000012","G2","26/05/2025","4","Clôturée","-"],
                    ["000013","123456","DP UP","26/05/2025","3","Clôturée","-"],
                    ["000014","simply2","DP Simply","26/05/2025","3","Clôturée","-"],
                    ["000015","Simply","DP Simply","26/05/2025","3","—","—"],
                  ].map((r, i) => (
                    <tr key={i}>
                      <td>{r[0]}</td>
                      <td className="lib">{r[1]}</td>
                      <td><span className={"pill " + pillClass(r[2])}>{r[2]}</span></td>
                      <td>{r[3]}</td>
                      <td className="num">{r[4]}</td>
                      <td>{r[5]}</td>
                      <td>{r[6]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* rangée 2 : 3 graphiques */}
        <section className="grid grid-3">
          {/* Pie (répartition) */}
          <div className="card">
            <div className="card-title">Répartition des Code Produits</div>
            <div className="chart-row">
              <div className="pie"
                   style={{
                     // conic-gradient: parts [%]
                     background: "conic-gradient(#f55 0 30%, #f9a 30% 48%, #7dd 48% 68%, #6c6 68% 85%, #fc6 85% 100%)"
                   }} />
              <ul className="legend">
                <LegendItem color="#f55" label="G2" />
                <LegendItem color="#f9a" label="LR CIP G3" />
                <LegendItem color="#7dd" label="DP UP" />
                <LegendItem color="#6c6" label="DP Integral 7" />
                <LegendItem color="#fc6" label="G3" />
              </ul>
            </div>
          </div>

          {/* Barres (dépôts par mois) */}
          <div className="card">
            <div className="card-title">Dépôts par mois</div>
            <div className="bars">
              {[
                { label: "mars 2025", values: [3.8, 2.7, 0.8] },
                { label: "avril 2025", values: [0.6, 0.0, 0.0] },
                { label: "mai 2025", values: [2.2, 0.0, 1.1] },
              ].map((m) => (
                <div key={m.label} className="col">
                  {m.values.map((v, i) => (
                    <div key={i} className="bar" style={{ height: `${v * 30}px` }} />
                  ))}
                  <div className="col-label">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Donut (utilisation) */}
          <div className="card">
            <div className="card-title">Utilisation des Smartdatas pour 2025</div>
            <div className="donut-wrap">
              <div className="donut"
                   style={{
                     background: "conic-gradient(#9bbcf6 0 70%, #e6edff 70% 100%)"
                   }}>
                <div className="donut-hole" />
              </div>
              <div className="donut-legend">
                <div className="legend-chip" style={{ background: "#9bbcf6" }} />
                50055177 SD Disponibles
              </div>
            </div>
          </div>
        </section>

        {/* logos bas de page */}
        <img className="corner-logo right" src={serLogo} alt="SER" />
        <img className="corner-logo left" src={avatar} alt="Leonardo" />
      </main>
    </div>
  );
}

function pillClass(type) {
  const t = (type || "").toLowerCase();
  if (t.includes("g2")) return "pink";
  if (t.includes("g3")) return "orange";
  if (t.includes("dp up")) return "cyan";
  if (t.includes("integral")) return "green";
  if (t.includes("simply")) return "mint";
  if (t.includes("lr cip")) return "amber";
  return "gray";
}

function LegendItem({ color, label }) {
  return (
    <li><span className="legend-chip" style={{ background: color }} /> {label}</li>
  );
}
