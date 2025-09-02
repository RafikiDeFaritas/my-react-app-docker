import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { app, pool } from "../index.js";

const TEST_USER = {
  username: "vitest_user",
  email: "vitest_user@example.com",
  password: "vitestPass123"
};

// docker compose exec api npm test

beforeAll(async () => {
  // s'assurer que la table existe
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
});

beforeEach(async () => {
  // on repart propre
  await pool.query(`DELETE FROM users WHERE email = $1 OR username = $2`, [TEST_USER.email, TEST_USER.username]);
});

afterAll(async () => {
  await pool.end();
});

describe("Auth API", () => {
  it("POST /api/register -> crée un utilisateur", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({
        username: TEST_USER.username,
        email: TEST_USER.email,
        password: TEST_USER.password
      })
      .set("Content-Type", "application/json");

    expect(res.status).toBe(201);
    expect(res.body?.user?.username).toBe(TEST_USER.username);
    expect(res.body?.user?.email).toBe(TEST_USER.email);
  });

  it("POST /api/register -> 409 si username/email déjà pris", async () => {
    // 1ère création
    await request(app).post("/api/register").send({
      username: TEST_USER.username,
      email: TEST_USER.email,
      password: TEST_USER.password
    });

    // 2ème création (mêmes identifiants)
    const res = await request(app).post("/api/register").send({
      username: TEST_USER.username,
      email: TEST_USER.email,
      password: TEST_USER.password
    });

    expect([409, 400]).toContain(res.status); // 409 attendu (selon ton check)
  });

  it("POST /api/login -> 200 et renvoie un token", async () => {
    // préparer un user
    await request(app).post("/api/register").send({
      username: TEST_USER.username,
      email: TEST_USER.email,
      password: TEST_USER.password
    });

    const res = await request(app).post("/api/login").send({
      identifier: TEST_USER.username,
      password: TEST_USER.password
    });

    expect(res.status).toBe(200);
    expect(typeof res.body?.token).toBe("string");
    expect(res.body?.user?.username).toBe(TEST_USER.username);
  });

  it("POST /api/login -> 401 si mauvais mdp", async () => {
    await request(app).post("/api/register").send({
      username: TEST_USER.username,
      email: TEST_USER.email,
      password: TEST_USER.password
    });

    const res = await request(app).post("/api/login").send({
      identifier: TEST_USER.username,
      password: "wrongpass"
    });

    expect(res.status).toBe(401);
  });
});
