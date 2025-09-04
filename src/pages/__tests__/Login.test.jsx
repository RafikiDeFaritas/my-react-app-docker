import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "../../pages/Login.jsx";

// util pour rendre dans un Router avec une route / (home) de redirection
function renderWithRouter(ui, { initialPath = "/login" } = {}) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={ui} />
        <Route path="/" element={<div>HOME</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  // mock fetch
  global.fetch = vi.fn();
  // mock localStorage
  const store = {};
  vi.spyOn(window.localStorage.__proto__, "setItem").mockImplementation((k, v) => { store[k] = String(v); });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Login page", () => {
  it("envoie identifier+password et affiche le message de succès", async () => {
    // mock succès API
    global.fetch.mockResolvedValueOnce(new Response(
      JSON.stringify({
        token: "jwt.token",
        user: { id: 1, username: "test", email: "t@ex.com" },
      }), { status: 200, headers: { "Content-Type": "application/json" } }
    ));

    renderWithRouter(<Login />);

    // saisie
    fireEvent.change(screen.getByLabelText(/identifiant/i), { target: { value: "test" } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: "tttttttt" } });

    // submit
    fireEvent.click(screen.getByRole("button", { name: /connexion/i }));

    // assert fetch appelé sur /api/login avec JSON
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/login$/),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: "test", password: "tttttttt" }),
        })
      );
    });

    // message de succès visible
    await screen.findByText(/bienvenue test/i);
  });

  it("affiche l'erreur API (401)", async () => {
    global.fetch.mockResolvedValueOnce(new Response(
      JSON.stringify({ error: "Identifiants invalides" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    ));

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/identifiant/i), { target: { value: "oops" } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: "bad" } });
    fireEvent.click(screen.getByRole("button", { name: /connexion/i }));

    // message d'erreur
    await screen.findByText(/identifiants invalides/i);
  });
});
