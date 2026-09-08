import tierListData from "@data/tierlist.json";

import { once } from "../lib/once";
import { parseTierListFile, type Character, type Tier } from "./schemas";
import { getAllCharacters } from "./characters";

/**
 * Доступ к тир-листу. Наружу отдаются уже склеенные с персонажами группы,
 * чтобы виджеты не знали про characterId и порядок тиров.
 */

const loadTierList = once(() => parseTierListFile(tierListData));

export type TierBoardEntry = {
  character: Character;
  note?: string;
};

export type TierGroup = {
  tier: Tier;
  entries: TierBoardEntry[];
};

export type TierBoard = {
  updatedAt: string;
  groups: TierGroup[];
};

export async function getTierBoard(): Promise<TierBoard> {
  const { updatedAt, tiers, entries } = loadTierList();
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
        return character ? [{ character, note: entry.note }] : [];
      }),
  }));

  return { updatedAt, groups };
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

/** Карта «id персонажа → тир»: для списков, где тир нужен у каждой карточки. */
export async function getTierMap(): Promise<Map<string, Tier>> {
  const { tiers, entries } = loadTierList();
  const tierById = new Map(tiers.map((tier) => [tier.id, tier]));

  return new Map(
    entries.flatMap((entry) => {
      const tier = tierById.get(entry.tier);
      return tier ? [[entry.characterId, tier] as const] : [];
    }),
  );
}
