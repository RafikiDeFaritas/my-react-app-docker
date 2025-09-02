import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../Register.jsx";

beforeEach(() => {
  vi.resetAllMocks();
  global.fetch = vi.fn();
});

describe("Register page", () => {
  it("envoie username+email+password et affiche le succès", async () => {
    // Mock de l'API register (succès)
    global.fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ user: { username: "newuser" } }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      })
    );

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText(/Identifiant/i), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "new@ex.com" },
    });
    // Attention aux libellés identiques: on cible le premier champ mot de passe exact
    fireEvent.change(screen.getByPlaceholderText(/^Mot de passe$/i), {
      target: { value: "testtest" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirmer le mot de passe/i), {
      target: { value: "testtest" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Créer le compte/i }));

    await waitFor(() =>
      expect(screen.getByText(/Bienvenue newuser/i)).toBeInTheDocument()
    );

    // Vérifie l'appel fetch
    expect(global.fetch).toHaveBeenCalled();
    const [calledUrl, init] = global.fetch.mock.calls[0];

    // URL souple: relative ou absolue
    expect(
      typeof calledUrl === "string" && calledUrl.endsWith("/api/register")
    ).toBe(true);

    expect(init).toEqual(
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );

    const sent = typeof init.body === "string" ? JSON.parse(init.body) : init.body;
    expect(sent).toEqual({
      username: "newuser",
      email: "new@ex.com",
      password: "testtest",
    });
  });

  it("bloque si les mots de passe ne correspondent pas", async () => {
    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText(/Identifiant/i), {
      target: { value: "u" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "u@ex.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^Mot de passe$/i), {
      target: { value: "a" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirmer le mot de passe/i), {
      target: { value: "b" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Créer le compte/i }));

    // Message d'erreur
    expect(
      await screen.findByText(/Les mots de passe ne correspondent pas/i)
    ).toBeInTheDocument();

    // Aucune requête ne doit partir
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
