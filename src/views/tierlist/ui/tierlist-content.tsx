"use client";

import { useMemo } from "react";

import {
  applyCharacterFilters,
  CharacterFilters,
  useCharacterFilters,
  type CharacterFilterOptions,
} from "@/features/filter-characters";
import { TierBoard, type TierBoardGroup } from "@/widgets/tier-board";

type TierListContentProps = {
  groups: TierBoardGroup[];
  options: CharacterFilterOptions;
};

export function TierListContent({ groups, options }: TierListContentProps) {
  const { state, setState, reset } = useCharacterFilters();

  const visibleGroups = useMemo(
    () =>
      groups.map((group) => ({
        ...group,
        characters: applyCharacterFilters(group.characters, state),
      })),
    [groups, state],
  );

  return (
    <>
      <CharacterFilters
        options={options}
        state={state}
        onChange={setState}
        onReset={reset}
      />

      <TierBoard groups={visibleGroups} />
    </>
  );
}
