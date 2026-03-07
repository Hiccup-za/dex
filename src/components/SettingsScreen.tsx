"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, useAppActions } from "@/context/AppContext";
import { clearState } from "@/lib/storage";
import type { GameKey } from "@/lib/types";
import NavLogo from "@/components/NavLogo";

const GAME_TITLES: Record<GameKey, string> = {
  fr: "FIRE RED",
  lg: "LEAF GREEN",
};

export default function SettingsScreen() {
  const router = useRouter();
  const { state, dispatch, isLoading } = useApp();
  const { resetGameData, removeGame } = useAppActions();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<GameKey | null>(null);

  function handleResetGameData(game: GameKey) {
    resetGameData(game);
    setResetSuccess(game);
    setTimeout(() => setResetSuccess(null), 2500);
  }

  useEffect(() => {
    if (!isLoading && !state.username) {
      router.replace("/");
    }
  }, [isLoading, state.username, router]);

  function handleRemoveGame(game: GameKey) {
    removeGame(game);
    const remaining = state.games.filter((g) => g !== game);
    if (remaining.length === 0) {
      router.replace("/");
    }
  }

  function handleClearAllData() {
    clearState();
    dispatch({ type: "CLEAR" });
    router.replace("/");
  }

  if (isLoading || !state.username) {
    return (
      <div className="settings-screen">
        <div className="loading">LOADING</div>
      </div>
    );
  }

  return (
    <div className="settings-screen">
      <div className="nav-bar">
        <NavLogo />
        <div className="nav-right">
          <button
            className="settings-back-btn"
            onClick={() => router.push("/dashboard")}
            aria-label="Back to dashboard"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            BACK
          </button>
        </div>
      </div>

      <div className="settings-content">
        <h1 className="settings-heading">Settings</h1>

        {state.games.length === 0 ? (
          <p className="settings-empty">No games added yet.</p>
        ) : (
          state.games.map((game) => (
            <div key={game} className={`settings-section ${game}`}>
              <h2 className="settings-game-title">{GAME_TITLES[game]}</h2>
              <div className="settings-actions">
                <div className="settings-action-row">
                  <div className="settings-action-info">
                    <span className="settings-action-label">Reset Data</span>
                    <span className="settings-action-desc">Clear all progress for this game while keeping it on the dashboard.</span>
                  </div>
                  {resetSuccess === game ? (
                    <span className="settings-reset-success">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Data Reset
                    </span>
                  ) : (
                    <button
                      className="settings-action-btn neutral"
                      onClick={() => handleResetGameData(game)}
                    >
                      Reset Data
                    </button>
                  )}
                </div>

                <div className="settings-action-row">
                  <div className="settings-action-info">
                    <span className="settings-action-label">Remove Game</span>
                    <span className="settings-action-desc">Remove this game from the dashboard. Your progress data is retained.</span>
                  </div>
                  <button
                    className="settings-action-btn danger-outline"
                    onClick={() => handleRemoveGame(game)}
                  >
                    Remove Game
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        <div className="settings-section account">
          <h2 className="settings-game-title">Data</h2>
          <div className="settings-actions">
            <div className="settings-action-row">
              <div className="settings-action-info">
                <span className="settings-action-label">Clear All Data</span>
                <span className="settings-action-desc">Permanently delete your trainer profile and all game data from this device. This cannot be undone.</span>
              </div>
              {confirmingDelete ? (
                <div className="settings-confirm-group">
                  <span className="settings-confirm-label">Are you sure?</span>
                  <button
                    className="settings-action-btn danger-fill"
                    onClick={handleClearAllData}
                  >
                    Yes, Clear
                  </button>
                  <button
                    className="settings-action-btn neutral"
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="settings-action-btn danger-fill"
                  onClick={() => setConfirmingDelete(true)}
                >
                  Clear All Data
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
