import type { Character } from "@/entities/character";

import type { CharacterFilterState } from "../model/types";

/** Чистая функция фильтрации: используется и в UI, и в тестах. */
export function applyCharacterFilters<T extends Character>(
  characters: T[],
  state: CharacterFilterState,
): T[] {
  const search = state.search.trim().toLowerCase();

  return characters.filter((character) => {
    if (search && !character.name.toLowerCase().includes(search)) return false;
    if (state.attribute && character.attribute !== state.attribute) return false;
    if (state.specialty && character.specialty !== state.specialty) return false;

    return true;
  });
}

export function isFilterActive(state: CharacterFilterState): boolean {
  return Boolean(state.search.trim() || state.attribute || state.specialty);
}
