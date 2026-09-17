import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getAllCharacters,
  getCharacterBySlug,
  getCharacterFilterOptions,
  getCharacterSummaries,
} from "./characters";
import {
  parseCharactersFile,
  parseTeamsFile,
  parseTierListFile,
} from "./schemas";
import { getTeamsForCharacter } from "./teams";
import {
  getTierBoard,
  getTierForCharacter,
  getTiersByCharacterId,
} from "./tierlist";

/** Поля `CharacterSummary` — то, что уходит в клиентские списки. */
const summaryKeys = ["attribute", "id", "image", "name", "slug", "specialty"];

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
    expect(() =>
      parseTierListFile({ tiers: [], entries: [{ characterId: "test" }] }),
    ).toThrowError(/data\/tierlist\.json/);
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

  it("находит каждого персонажа по его slug", async () => {
    for (const character of await getAllCharacters()) {
      await expect(getCharacterBySlug(character.slug)).resolves.toBe(character);
    }
  });

  it("отдаёт спискам только поля карточки, без билд-гайда", async () => {
    const summaries = await getCharacterSummaries();

    expect(summaries).toHaveLength((await getAllCharacters()).length);
    for (const summary of summaries) {
      expect(Object.keys(summary).sort()).toEqual(summaryKeys);
    }
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
    const groups = await getTierBoard();
    const placed = groups.flatMap((group) => group.entries);

    expect(groups.length).toBeGreaterThan(0);
    expect(placed.length).toBeGreaterThan(0);
    expect(placed.every((entry) => Boolean(entry.character.name))).toBe(true);
  });

  it("кладёт в записи доски краткие записи персонажей", async () => {
    const groups = await getTierBoard();

    for (const { character } of groups.flatMap((group) => group.entries)) {
      expect(Object.keys(character).sort()).toEqual(summaryKeys);
    }
  });

  it("сохраняет порядок тиров из данных", async () => {
    const groups = await getTierBoard();
    expect(groups.map((group) => group.tier.id)).toEqual(["S", "A"]);
  });

  it("проставляет каждой записи роль из допустимого набора", async () => {
    const groups = await getTierBoard();
    const roles = groups.flatMap((group) =>
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
    const groups = await getTierBoard();
    const ids = groups.flatMap((group) =>
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

describe("команды", () => {
  const validTeam = { members: ["miyabi", "ye-shunguang", "norma"] };

  /**
   * Составы подменяются на тестовые: реальный `teams.json` наполняется
   * пользователем и может быть пустым, а проверять нужно саму связь.
   */
  async function withTeams(teams: unknown[]) {
    vi.resetModules();
    vi.doMock("@data/teams.json", () => ({ default: { teams } }));
    return import("./teams");
  }

  afterEach(() => {
    vi.doUnmock("@data/teams.json");
    vi.resetModules();
  });

  it("разбирает состав из трёх агентов", () => {
    expect(parseTeamsFile({ teams: [validTeam] }).teams).toHaveLength(1);
  });

  it("не принимает состав, в котором не три агента", () => {
    expect(() =>
      parseTeamsFile({ teams: [{ ...validTeam, members: ["miyabi", "norma"] }] }),
    ).toThrowError(/data\/teams\.json/);

    expect(() =>
      parseTeamsFile({
        teams: [
          { ...validTeam, members: [...validTeam.members, "remielle"] },
        ],
      }),
    ).toThrowError(/ровно из трёх/);
  });

  it("не принимает одного агента дважды в одном составе", () => {
    expect(() =>
      parseTeamsFile({
        teams: [{ ...validTeam, members: ["miyabi", "miyabi", "norma"] }],
      }),
    ).toThrowError(/два места/);
  });

  it("не принимает два состава с одинаковым набором агентов", () => {
    expect(() =>
      parseTeamsFile({
        teams: [
          validTeam,
          { members: ["norma", "miyabi", "ye-shunguang"] },
        ],
      }),
    ).toThrowError(/больше одного раза/);
  });

  it("показывает состав каждому его участнику", async () => {
    const { getTeamsForCharacter } = await withTeams([validTeam]);

    for (const memberId of validTeam.members) {
      const teams = await getTeamsForCharacter(memberId);

      expect(teams).toHaveLength(1);
      expect(teams[0].members.map((member) => member.id)).toEqual(
        validTeam.members,
      );
    }
  });

  it("не показывает состав постороннему агенту", async () => {
    const { getTeamsForCharacter } = await withTeams([validTeam]);
    await expect(getTeamsForCharacter("remielle")).resolves.toEqual([]);
  });

  it("резолвит участников в имя, slug и портрет", async () => {
    const { getTeamsForCharacter } = await withTeams([validTeam]);
    const [team] = await getTeamsForCharacter("miyabi");

    expect(team.members[0]).toMatchObject({ id: "miyabi", name: "Мияби" });
    expect(team.members.every((member) => Boolean(member.slug && member.image))).toBe(
      true,
    );
  });

  it("падает на составе со ссылкой на несуществующего агента", async () => {
    const { getTeamsForCharacter } = await withTeams([
      { ...validTeam, members: ["miyabi", "norma", "no-such-character"] },
    ]);

    await expect(getTeamsForCharacter("miyabi")).rejects.toThrowError(
      /no-such-character/,
    );
  });

  it("в реальных данных все участники составов существуют", async () => {
    const characters = await getAllCharacters();
    const ids = new Set(characters.map((character) => character.id));

    for (const character of characters) {
      const teams = await getTeamsForCharacter(character.id);

      for (const team of teams) {
        expect(team.members).toHaveLength(3);
        expect(team.members.every((member) => ids.has(member.id))).toBe(true);
      }
    }
  });
});
