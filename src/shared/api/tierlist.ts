import tierListData from "@data/tierlist.json";

import { once } from "../lib/once";
import {
  parseTierListFile,
  type Character,
  type Tier,
  type TierRole,
} from "./schemas";
import { getAllCharacters } from "./characters";

/**
 * Доступ к тир-листу. Наружу отдаются уже склеенные с персонажами группы,
 * чтобы виджеты не знали про characterId и порядок тиров.
 */

const loadTierList = once(() => parseTierListFile(tierListData));

export type TierBoardEntry = {
  character: Character;
  role: TierRole;
  note?: string;
};

export type TierGroup = {
  tier: Tier;
  entries: TierBoardEntry[];
};

export type TierBoard = {
  groups: TierGroup[];
};

export async function getTierBoard(): Promise<TierBoard> {
  const { tiers, entries } = loadTierList();
  const characters = await getAllCharacters();
  const byId = new Map(characters.map((character) => [character.id, character]));

  const groups = tiers.map((tier) => ({
    tier,
    entries: entries
      .filter((entry) => entry.tier === tier.id)
      // Запись на несуществующего персонажа пропускается, а не роняет страницу:
      // тир-лист и карточки наполняются независимо друг от друга.
      .flatMap((entry) => {
        const character = byId.get(entry.characterId);
        return character
          ? [{ character, role: entry.role, note: entry.note }]
          : [];
      }),
  }));

  return { groups };
}

/** Тир конкретного персонажа — для карточки персонажа и страницы гайда. */
export async function getTierForCharacter(
  characterId: string,
): Promise<Tier | null> {
  const { tiers, entries } = loadTierList();
  const entry = entries.find((item) => item.characterId === characterId);

  if (!entry) return null;

  return tiers.find((tier) => tier.id === entry.tier) ?? null;
}

/**
 * Тиры по id персонажа — для списков, где тир нужен у каждой карточки.
 * Обычный объект, а не Map: результат уходит в клиентские компоненты.
 */
export async function getTiersByCharacterId(): Promise<Record<string, Tier>> {
  const { tiers, entries } = loadTierList();
  const tierById = new Map(tiers.map((tier) => [tier.id, tier]));

  return Object.fromEntries(
    entries.flatMap((entry) => {
      const tier = tierById.get(entry.tier);
      return tier ? [[entry.characterId, tier] as const] : [];
    }),
  );
}
