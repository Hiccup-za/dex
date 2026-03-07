"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { GYM_INFO } from "@/lib/constants";
import type { GameKey } from "@/lib/types";
import AddGameModal from "@/components/AddGameModal";
import NavLogo from "@/components/NavLogo";

const ALL_GAMES: GameKey[] = ["fr", "lg"];

const COVER_ART: Record<GameKey, string> = {
  fr: "/Charizard.png",
  lg: "/Venusaur.png",
};

const BADGE_IMAGES: Record<string, string> = {
  Boulder: "/badges/boulder.png",
  Cascade: "/badges/cascade.png",
  Thunder: "/badges/thunder.png",
  Rainbow: "/badges/rainbow.png",
  Soul: "/badges/soul.png",
  Marsh: "/badges/marsh.png",
  Volcano: "/badges/volcano.png",
  Earth: "/badges/earth.png",
};

export default function DashboardScreen() {
  const router = useRouter();
  const { state, isLoading } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const allGamesAdded = state.games.length >= ALL_GAMES.length;

  // Auth guard
  useEffect(() => {
    if (!isLoading && (!state.username || state.games.length === 0)) {
      router.replace("/");
    }
  }, [isLoading, state.username, state.games, router]);

  function openGame(game: GameKey) {
    router.push(`/game/${game}`);
  }

  if (isLoading || !state.username) {
    return (
      <div className="dashboard-screen">
        <div className="loading">LOADING</div>
      </div>
    );
  }

  return (
    <div className="dashboard-screen">
      <div className="nav-bar">
        <NavLogo />
        <div className="nav-right">
          <button
            className="add-game-btn"
            onClick={() => setShowAddModal(true)}
            disabled={allGamesAdded}
          >
            + ADD GAME
          </button>
          <button
            className="settings-btn"
            onClick={() => router.push("/settings")}
            aria-label="Settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="dashboard-greeting">WELCOME BACK, {state.username}!</div>
      <div className="dashboard-sub">Your adventure awaits. Choose a game to begin.</div>

      <div className="cards-grid">
        {state.games.map((game) => {
          const gd = state.gameData[game];
          const seenCount = Object.values(gd.caught).filter(
            (s) => s === "seen" || s === "caught"
          ).length;
          const caughtCount = Object.values(gd.caught).filter((s) => s === "caught").length;
          const title = game === "fr" ? "FIRE RED" : "LEAF GREEN";

          return (
            <div
              key={game}
              className={`game-card ${game}`}
              onClick={() => openGame(game)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={COVER_ART[game]}
                alt={`${title} cover art`}
                className="card-cover-art"
              />

              <div className="card-body">
                <div className="card-stats">
                  <div className="stat-box">
                    <span className="stat-value">{seenCount}</span>
                    <span className="stat-label">SEEN</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-value">{caughtCount}</span>
                    <span className="stat-label">CAUGHT</span>
                  </div>
                </div>

                <div className="badges-label">GYM BADGES</div>

                <div className="card-badges-row">
                  {GYM_INFO.map((info, i) => {
                    const badgeEarned = gd.badges[i];
                    return (
                      <div
                        key={i}
                        className={`card-badge${badgeEarned ? ` earned ${game}` : ""}`}
                        title={`${info.badge} Badge — ${info.gym} (${info.leader})`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={BADGE_IMAGES[info.badge]}
                          alt={info.badge}
                          className="card-badge-img"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {showAddModal && (
        <AddGameModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
