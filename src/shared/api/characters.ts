import charactersData from "@data/characters.json";

import { once } from "../lib/once";
import { parseCharactersFile, type Character } from "./schemas";

/**
 * Доступ к данным персонажей. Это единственное место, знающее, что данные
 * лежат в JSON-файле: при переходе на БД меняется только тело функций.
 * Все функции асинхронные, чтобы сигнатуры пережили такую замену.
 */

const loadCharacters = once(() => parseCharactersFile(charactersData).characters);

export async function getAllCharacters(): Promise<Character[]> {
  return loadCharacters();
}

export async function getCharacterBySlug(
  slug: string,
): Promise<Character | null> {
  return loadCharacters().find((character) => character.slug === slug) ?? null;
}

export async function getCharacterById(id: string): Promise<Character | null> {
  return loadCharacters().find((character) => character.id === id) ?? null;
}

export type FilterOptions = {
  attributes: string[];
  specialties: string[];
  rarities: string[];
};

/**
 * Варианты для фильтров вычисляются из самих данных, а не задаются списком:
 * при наполнении реальными персонажами фильтры подстроятся без правки кода.
 */
export async function getCharacterFilterOptions(): Promise<FilterOptions> {
  const characters = loadCharacters();

  const unique = (values: string[]) => [...new Set(values)].sort();

  return {
    attributes: unique(characters.map((character) => character.attribute)),
    specialties: unique(characters.map((character) => character.specialty)),
    rarities: unique(characters.map((character) => character.rarity)),
  };
}
