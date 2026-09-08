import { describe, expect, it } from "vitest";

import {
  getAllCharacters,
  getCharacterBySlug,
  getCharacterFilterOptions,
} from "./characters";
import { parseCharactersFile, parseTierListFile } from "./schemas";
import {
  getTierBoard,
  getTierForCharacter,
  getTiersByCharacterId,
} from "./tierlist";

describe("валидация данных", () => {
  it("разбирает корректный файл персонажей", () => {
    const file = parseCharactersFile({
      characters: [
        {
          id: "test",
          slug: "test",
          name: "Тест",
          rarity: "S",
          attribute: "ice",
          specialty: "attack",
                  shortDescription: "",
          image: "/images/characters/test.svg",
        },
      ],
    });

    expect(file.characters).toHaveLength(1);
  });

  it("падает с понятной ошибкой, если поле потеряно", () => {
    expect(() =>
      parseCharactersFile({ characters: [{ id: "test", slug: "test" }] }),
    ).toThrowError(/data\/characters\.json/);
  });

  it("падает с понятной ошибкой на битом тир-листе", () => {
    expect(() => parseTierListFile({ tiers: [], entries: [] })).toThrowError(
      /data\/tierlist\.json/,
    );
  });
});

describe("персонажи", () => {
  it("отдаёт непустой список", async () => {
    await expect(getAllCharacters()).resolves.not.toHaveLength(0);
  });

  it("находит персонажа по slug", async () => {
    const character = await getCharacterBySlug("miyabi");
    expect(character?.name).toBe("Мияби");
  });

  it("возвращает null для несуществующего slug", async () => {
    await expect(getCharacterBySlug("no-such-character")).resolves.toBeNull();
  });

  it("собирает варианты фильтров из самих данных, без дублей", async () => {
    const options = await getCharacterFilterOptions();
    const characters = await getAllCharacters();

    expect(options.attributes).toContain("ice");
    expect(new Set(options.attributes).size).toBe(options.attributes.length);
    expect(options.specialties.length).toBeLessThanOrEqual(characters.length);
  });
});

describe("тир-лист", () => {
  it("раскладывает всех персонажей тир-листа по группам", async () => {
    const board = await getTierBoard();
    const placed = board.groups.flatMap((group) => group.entries);

    expect(board.groups.length).toBeGreaterThan(0);
    expect(placed.length).toBeGreaterThan(0);
    expect(placed.every((entry) => Boolean(entry.character.name))).toBe(true);
  });

  it("сохраняет порядок тиров из данных", async () => {
    const board = await getTierBoard();
    expect(board.groups.map((group) => group.tier.id)).toEqual(["S", "A"]);
  });

  it("проставляет каждой записи роль из допустимого набора", async () => {
    const board = await getTierBoard();
    const roles = board.groups.flatMap((group) =>
      group.entries.map((entry) => entry.role),
    );

    expect(roles.length).toBeGreaterThan(0);
    expect(
      roles.every((role) =>
        ["pure-dps", "anomaly-dps", "support"].includes(role),
      ),
    ).toBe(true);
  });

  it("не дублирует персонажей между тирами", async () => {
    const board = await getTierBoard();
    const ids = board.groups.flatMap((group) =>
      group.entries.map((entry) => entry.character.id),
    );

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("отдаёт тир конкретного персонажа и null для неизвестного", async () => {
    await expect(getTierForCharacter("ye-shunguang")).resolves.toMatchObject({
      id: "S",
    });
    await expect(getTierForCharacter("no-such-character")).resolves.toBeNull();
  });

  it("строит карту тиров по id персонажа", async () => {
    const tiers = await getTiersByCharacterId();
    expect(tiers["ye-shunguang"]?.id).toBe("S");
    expect(tiers["miyabi"]?.id).toBe("A");
    expect(tiers["no-such-character"]).toBeUndefined();
  });
});
