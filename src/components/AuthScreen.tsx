"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp, useAppActions } from "@/context/AppContext";
import type { GameKey } from "@/lib/types";

export default function AuthScreen() {
  const router = useRouter();
  const { state, isLoading } = useApp();
  const { setProfile } = useAppActions();

  const [username, setUsername] = useState("");
  const [selectedGames, setSelectedGames] = useState<Set<GameKey>>(new Set());
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && state.username && state.games.length > 0) {
      router.replace("/dashboard");
    }
  }, [isLoading, state.username, state.games, router]);

  function toggleGame(game: GameKey) {
    setSelectedGames((prev) => {
      const next = new Set(prev);
      if (next.has(game)) next.delete(game);
      else next.add(game);
      return next;
    });
    setError("");
  }

  function handleStart() {
    const name = username.trim();
    if (!name) {
      setError("Enter your trainer name!");
      return;
    }
    if (selectedGames.size === 0) {
      setError("Select at least one game!");
      return;
    }
    setError("");
    setProfile(name.toUpperCase(), [...selectedGames]);
    router.push("/dashboard");
  }

  return (
    <div className="auth-screen">
      <div className="auth-logo">
        <div className="pokeball-icon">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
            alt="Master Ball"
            className="masterball-logo-img"
          />
        </div>
        <h1>Dex</h1>
        <div className="subtitle">Fire Red &amp; Leaf Green Edition</div>
      </div>

      <div className="auth-card">
        <div className="field-group">
          <label>Trainer Name</label>
          <input
            type="text"
            placeholder="Enter your name..."
            maxLength={12}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
          />
        </div>

        <div className="field-group" style={{ marginBottom: "1rem" }}>
          <label>Select Your Game(s)</label>
        </div>

        <div className="game-select">
          <button
            className={`game-btn${selectedGames.has("fr") ? " selected-fr" : ""}`}
            onClick={() => toggleGame("fr")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Charizard.png" alt="Fire Red" className="game-btn-art" />
            <span className="game-name">FIRE RED</span>
          </button>
          <button
            className={`game-btn${selectedGames.has("lg") ? " selected-lg" : ""}`}
            onClick={() => toggleGame("lg")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Venusaur.png" alt="Leaf Green" className="game-btn-art" />
            <span className="game-name">LEAF GREEN</span>
          </button>

          <div className="more-to-come">
            <span className="more-to-come-text">More games coming soon</span>
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button
          className="btn-primary"
          onClick={handleStart}
          disabled={isLoading}
        >
          {isLoading ? "LOADING..." : "START ADVENTURE"}
        </button>
      </div>
    </div>
  );
}
