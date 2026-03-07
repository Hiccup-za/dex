"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { isValidGame } from "@/lib/storage";
import PartySlots from "@/components/PartySlots";
import PokedexGrid from "@/components/PokedexGrid";
import GymBadges from "@/components/GymBadges";
import SearchModal from "@/components/SearchModal";
import type { GameKey } from "@/lib/types";

interface GameScreenProps {
  game: string;
}

export default function GameScreen({ game }: GameScreenProps) {
  const router = useRouter();
  const { state, isLoading } = useApp();
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [isShiny, setIsShiny] = useState(false);

  // Auth guard + valid game guard
  useEffect(() => {
    if (isLoading) return;
    if (!state.username || state.games.length === 0) {
      router.replace("/");
      return;
    }
    if (!isValidGame(game) || !state.games.includes(game as GameKey)) {
      router.replace("/dashboard");
    }
  }, [isLoading, state.username, state.games, game, router]);

  if (isLoading || !state.username || !isValidGame(game)) {
    return (
      <div className="game-screen">
        <div className="loading">LOADING</div>
      </div>
    );
  }

  const validGame = game as GameKey;
  const isFr = validGame === "fr";
  const icon = isFr ? "🔥" : "🌿";
  const title = isFr ? "POKÉMON FIRE RED" : "POKÉMON LEAF GREEN";

  return (
    <div className="game-screen">
      <button className="back-btn" onClick={() => router.push("/dashboard")}>
        ◀ DASHBOARD
      </button>

      <div className="game-header">
        <span className="game-header-icon">{icon}</span>
        <div>
          <div className={`game-header-title ${isFr ? "fr-text" : "lg-text"}`}>
            {title}
          </div>
          <div className="game-header-sub">KANTO REGION — 151 POKÉMON</div>
        </div>
        <button
          className={`shiny-toggle-btn${isShiny ? " active" : ""}`}
          onClick={() => setIsShiny((v) => !v)}
          title={isShiny ? "Switch to normal Pokédex" : "Switch to shiny Pokédex"}
        >
          ✨ SHINY
        </button>
      </div>

      <div className="section-label">PARTY POKÉMON</div>

      <PartySlots game={validGame} onAddRequest={(idx) => setActiveSlot(idx)} />

      <GymBadges game={validGame} />

      <PokedexGrid game={validGame} isShiny={isShiny} />

      {activeSlot !== null && (
        <SearchModal
          game={validGame}
          slotIdx={activeSlot}
          onClose={() => setActiveSlot(null)}
        />
      )}
    </div>
  );
}
