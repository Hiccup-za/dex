"use client";

import { useEffect } from "react";
import { useApp, useAppActions } from "@/context/AppContext";
import type { GameKey } from "@/lib/types";

const ALL_GAMES: GameKey[] = ["fr", "lg"];

const GAME_META: Record<GameKey, { art: string; title: string }> = {
  fr: { art: "/Charizard.png", title: "FIRE RED" },
  lg: { art: "/Venusaur.png", title: "LEAF GREEN" },
};

interface AddGameModalProps {
  onClose: () => void;
}

export default function AddGameModal({ onClose }: AddGameModalProps) {
  const { state } = useApp();
  const { addGame } = useAppActions();

  const missingGames = ALL_GAMES.filter((g) => !state.games.includes(g));

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleSelect(game: GameKey) {
    addGame(game);
    onClose();
  }

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="add-game-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h3>▶ ADD GAME</h3>
        <div className="add-game-options">
          {missingGames.map((game) => {
            const { art, title } = GAME_META[game];
            return (
              <button
                key={game}
                className={`add-game-option ${game}`}
                onClick={() => handleSelect(game)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={art} alt={title} className="add-game-option-art" />
                <span className="add-game-option-title">{title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
