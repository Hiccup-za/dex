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

  // If already logged in, skip to dashboard
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
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#f5c518" strokeWidth="3" />
            <path d="M2 50 Q2 2 50 2 Q98 2 98 50" fill="#e8350a" />
            <path d="M2 50 Q2 98 50 98 Q98 98 98 50" fill="#1a1a35" />
            <line x1="2" y1="50" x2="98" y2="50" stroke="#f5c518" strokeWidth="3" />
            <circle cx="50" cy="50" r="14" fill="#1a1a35" stroke="#f5c518" strokeWidth="3" />
            <circle cx="50" cy="50" r="7" fill="#f5c518" />
          </svg>
        </div>
        <h1>POKÉTRACKER</h1>
        <div className="subtitle">FIRERED &amp; LEAFGREEN EDITION</div>
      </div>

      <div className="auth-card">
        <h2>▶ CREATE TRAINER</h2>

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
