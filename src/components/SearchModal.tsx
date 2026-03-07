"use client";

import { useState, useEffect, useRef } from "react";
import { useApp, useAppActions } from "@/context/AppContext";
import { getSpriteUrl, getFallbackSpriteUrl } from "@/lib/api";
import type { GameKey, PokemonEntry } from "@/lib/types";

interface SearchModalProps {
  game: GameKey;
  slotIdx: number;
  onClose: () => void;
}

export default function SearchModal({ game, slotIdx, onClose }: SearchModalProps) {
  const { state } = useApp();
  const { setPartySlot } = useAppActions();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const results: PokemonEntry[] = query.trim()
    ? state.allPokemon.filter((p) =>
        p.name.includes(query.trim().toLowerCase())
      ).slice(0, 12)
    : [];

  function addToParty(pokemon: PokemonEntry) {
    setPartySlot(game, slotIdx, { id: pokemon.id, name: pokemon.name });
    onClose();
  }

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h3>▶ ADD TO PARTY</h3>

        <div className="search-input-wrap">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Pokémon..."
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="search-results">
          {!query.trim() && (
            <div className="search-no-results">Start typing a Pokémon name...</div>
          )}
          {query.trim() && results.length === 0 && (
            <div className="search-no-results">No Pokémon found...</div>
          )}
          {results.map((p) => (
            <div
              key={p.id}
              className="search-result-item"
              onClick={() => addToParty(p)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getSpriteUrl(p.id)}
                alt={p.name}
                onError={(e) => {
                  const img = e.currentTarget;
                  img.onerror = null;
                  img.src = getFallbackSpriteUrl(p.id);
                }}
              />
              <div className="search-result-info">
                <div className="r-name">{p.name}</div>
                <div className="r-num">#{String(p.id).padStart(3, "0")}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
