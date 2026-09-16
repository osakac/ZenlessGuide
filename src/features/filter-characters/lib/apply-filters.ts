import type { Character } from "@/entities/character";

import type { CharacterFilterState } from "../model/types";

/**
 * Предикат фильтров: строка поиска нормализуется один раз на состояние,
 * а не на каждого персонажа. Отдельно от `applyCharacterFilters` нужен там,
 * где фильтруются не сами персонажи, а записи с ними (тир-лист).
 */
export function matchesCharacterFilters(
  state: CharacterFilterState,
): (character: Character) => boolean {
  const search = state.search.trim().toLowerCase();

  return (character) =>
    (!search || character.name.toLowerCase().includes(search)) &&
    (!state.attribute || character.attribute === state.attribute) &&
    (!state.specialty || character.specialty === state.specialty);
}

/** Чистая функция фильтрации: используется и в UI, и в тестах. */
export function applyCharacterFilters(
  characters: Character[],
  state: CharacterFilterState,
): Character[] {
  return characters.filter(matchesCharacterFilters(state));
}

export function isFilterActive(state: CharacterFilterState): boolean {
  return Boolean(state.search.trim() || state.attribute || state.specialty);
}
