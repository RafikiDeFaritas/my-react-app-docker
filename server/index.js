import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { Pool } from "pg";

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));

// Pool PG (fonctionne en local et dans Docker)
const pool = new Pool({
  host: process.env.PGHOST || "db",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "appuser",
  password: process.env.PGPASSWORD || "supersecret",
  database: process.env.PGDATABASE || "appdb",
  max: 5
});

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ error: "username, email, password requis" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "mot de passe trop court (≥ 8)" });
    }

    const { rows: existUser } = await pool.query(
      "SELECT 1 FROM users WHERE username=$1 OR email=$2",
      [username, email]
    );
    if (existUser.length > 0) {
      return res.status(409).json({ error: "username ou email déjà pris" });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username, email, password_hash]
    );
    res.status(201).json({ user: rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));
