import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`, req.body || {});
  next();
});
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || true }));

const pool = new Pool({
  host: process.env.PGHOST || "db",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "appuser",
  password: process.env.PGPASSWORD || "supersecret",
  database: process.env.PGDATABASE || "appdb",
  max: 5
});

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function auth(req, res, next) {
  const hdr = req.headers.authorization || "";
  const [, token] = hdr.split(" ");
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
}

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
    console.error("REGISTER ERROR:", e);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier || !password) {
      return res.status(400).json({ error: "identifier et password requis" });
    }

    const { rows } = await pool.query(
      `SELECT id, username, email, password_hash
       FROM users
       WHERE username = $1 OR email = $1
       LIMIT 1`,
      [identifier]
    );
    const user = rows[0];
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Identifiants invalides" });

    const token = signToken({ sub: user.id, username: user.username, email: user.email });
    return res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});


app.get("/api/me", auth, async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id, username, email, created_at FROM users WHERE id = $1",
    [req.user.sub]
  );
  return res.json({ user: rows[0] || null });
});

// Middleware d'erreurs JSON
app.use((err, _req, res, _next) => {
  console.error("UNCAUGHT:", err);
  if (!res.headersSent) res.status(500).json({ error: "Erreur serveur" });
});

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`API on http://localhost:${port}`));
}

export { app, pool }; // <- AJOUT
