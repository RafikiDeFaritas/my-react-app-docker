import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Login.jsx";

beforeEach(() => {
  vi.resetAllMocks();
  global.fetch = vi.fn();
  localStorage.clear();
});

describe("Login page", () => {
  it("envoie identifier+password et affiche le message de succès", async () => {
    // Mock de l'API login (succès)
    global.fetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ token: "abc123", user: { username: "test" } }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/Identifiant/i), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), {
      target: { value: "tttttttt" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Se connecter|Connexion/i }));

    // Attendre l'affichage du message
    await waitFor(() =>
      expect(screen.getByText(/Bienvenue test/i)).toBeInTheDocument()
    );

    // Vérifie l'appel fetch
    expect(global.fetch).toHaveBeenCalled();
    const [calledUrl, init] = global.fetch.mock.calls[0];

    // URL souple: accepte relative ou absolue
    expect(
      typeof calledUrl === "string" && calledUrl.endsWith("/api/login")
    ).toBe(true);

    // Méthode + headers
    expect(init).toEqual(
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );

    // Corps envoyé
    const sent = typeof init.body === "string" ? JSON.parse(init.body) : init.body;
    expect(sent).toEqual({ identifier: "test", password: "tttttttt" });

    // Token stocké
    expect(localStorage.getItem("token")).toBe("abc123");
  });

  it("affiche l'erreur API (401)", async () => {
    global.fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Identifiants invalides" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    );

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/Identifiant/i), {
      target: { value: "bad" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Se connecter|Connexion/i }));

    await waitFor(() =>
      expect(screen.getByText(/Identifiants invalides/i)).toBeInTheDocument()
    );
  });
});
