import charactersData from "@data/characters.json";

import { once } from "../lib/once";
import { parseCharactersFile, type Character } from "./schemas";

/**
 * Доступ к данным персонажей. Это единственное место, знающее, что данные
 * лежат в JSON-файле: при переходе на БД меняется только тело функций.
 * Все функции асинхронные, чтобы сигнатуры пережили такую замену.
 */

const loadCharacters = once(() => parseCharactersFile(charactersData).characters);

/**
 * Персонажи по id — для склейки с командами и тир-листом. Внутренняя функция
 * модуля `shared/api`: наружу через index.ts не отдаётся.
 */
export const loadCharactersById = once(
  () => new Map(loadCharacters().map((character) => [character.id, character])),
);

const loadCharactersBySlug = once(
  () => new Map(loadCharacters().map((character) => [character.slug, character])),
);

/**
 * Персонаж в списках и сетках: ровно то, что рисуют карточка и плитка.
 * Списки уходят в клиентские компоненты и сериализуются в RSC-payload целиком,
 * а билд-гайд, статы и описание занимают ~90% записи и там не нужны.
 */
export type CharacterSummary = Pick<
  Character,
  "id" | "slug" | "name" | "image" | "attribute" | "specialty"
>;

/**
 * Поля перечислены явно: тип `Pick` лишнее не отрезает, а в payload
 * попадает сам объект, со всем, что в нём лежит.
 */
export const toCharacterSummary = ({
  id,
  slug,
  name,
  image,
  attribute,
  specialty,
}: Character): CharacterSummary => ({ id, slug, name, image, attribute, specialty });

const loadCharacterSummaries = once(() => loadCharacters().map(toCharacterSummary));

/** Полные записи — для страницы агента и генерации маршрутов. */
export async function getAllCharacters(): Promise<Character[]> {
  return loadCharacters();
}

/** Краткие записи — для списков, фильтруемых на клиенте. */
export async function getCharacterSummaries(): Promise<CharacterSummary[]> {
  return loadCharacterSummaries();
}

export async function getCharacterBySlug(
  slug: string,
): Promise<Character | null> {
  return loadCharactersBySlug().get(slug) ?? null;
}

export type FilterOptions = {
  attributes: string[];
  specialties: string[];
};

/**
 * Варианты для фильтров вычисляются из самих данных, а не задаются списком:
 * при наполнении реальными персонажами фильтры подстроятся без правки кода.
 * Ранга среди них нет — все агенты сейчас ранга S, фильтр по нему был бы бессмысленным.
 */
export async function getCharacterFilterOptions(): Promise<FilterOptions> {
  const characters = loadCharacters();

  const unique = (values: string[]) => [...new Set(values)].sort();

  return {
    attributes: unique(characters.map((character) => character.attribute)),
    specialties: unique(characters.map((character) => character.specialty)),
  };
}
