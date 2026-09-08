"use client";

import { useMemo } from "react";

import type { Character } from "@/entities/character";
import type { Tier } from "@/entities/tier";
import {
  applyCharacterFilters,
  CharacterFilters,
  useCharacterFilters,
  type CharacterFilterOptions,
} from "@/features/filter-characters";
import { CharacterCardGrid } from "@/widgets/character-card-grid";

type CharacterListContentProps = {
  characters: Character[];
  tiers: Record<string, Tier>;
  options: CharacterFilterOptions;
};

export function CharacterListContent({
  characters,
  tiers,
  options,
}: CharacterListContentProps) {
  const { state, setState, reset } = useCharacterFilters();

  const visible = useMemo(
    () => applyCharacterFilters(characters, state),
    [characters, state],
  );

  return (
    <>
      <CharacterFilters
        options={options}
        state={state}
        onChange={setState}
        onReset={reset}
      />

      <p className="text-sm text-muted-foreground">
        Найдено: {visible.length} из {characters.length}
      </p>

      <CharacterCardGrid characters={visible} tiers={tiers} />
    </>
  );
}
