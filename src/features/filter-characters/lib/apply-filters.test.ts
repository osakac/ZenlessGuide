import { describe, expect, it } from "vitest";

import type { Character } from "@/entities/character";

import { applyCharacterFilters, isFilterActive } from "./apply-filters";
import { emptyFilterState } from "../model/types";

const character = (overrides: Partial<Character>): Character => ({
  id: "id",
  slug: "slug",
  name: "Персонаж",
  rarity: "S",
  attribute: "ice",
  specialty: "attack",
  shortDescription: "",
  image: "/images/characters/test.svg",
  ...overrides,
});

const characters = [
  character({ id: "a", name: "Эллен Джо", attribute: "ice", specialty: "attack", rarity: "S" }),
  character({ id: "b", name: "Энби Демара", attribute: "electric", specialty: "stun", rarity: "A" }),
  character({ id: "c", name: "Бен Биггер", attribute: "fire", specialty: "defense", rarity: "A" }),
];

describe("applyCharacterFilters", () => {
  it("без фильтров возвращает всех", () => {
    expect(applyCharacterFilters(characters, emptyFilterState)).toHaveLength(3);
  });

  it("ищет по части имени без учёта регистра и пробелов", () => {
    const found = applyCharacterFilters(characters, {
      ...emptyFilterState,
      search: "  эллен ",
    });

    expect(found.map((item) => item.id)).toEqual(["a"]);
  });

  it("фильтрует по атрибуту, специализации и рангу", () => {
    expect(
      applyCharacterFilters(characters, {
        ...emptyFilterState,
        attribute: "electric",
      }).map((item) => item.id),
    ).toEqual(["b"]);

    expect(
      applyCharacterFilters(characters, {
        ...emptyFilterState,
        specialty: "defense",
      }).map((item) => item.id),
    ).toEqual(["c"]);

    expect(
      applyCharacterFilters(characters, { ...emptyFilterState, rarity: "A" }).map(
        (item) => item.id,
      ),
    ).toEqual(["b", "c"]);
  });

  it("применяет несколько фильтров одновременно", () => {
    expect(
      applyCharacterFilters(characters, {
        search: "б",
        attribute: "fire",
        specialty: "defense",
        rarity: "A",
      }).map((item) => item.id),
    ).toEqual(["c"]);
  });

  it("возвращает пустой список, если совпадений нет", () => {
    expect(
      applyCharacterFilters(characters, {
        ...emptyFilterState,
        attribute: "ice",
        specialty: "stun",
      }),
    ).toEqual([]);
  });
});

describe("isFilterActive", () => {
  it("пустое состояние не считается активным фильтром", () => {
    expect(isFilterActive(emptyFilterState)).toBe(false);
    expect(isFilterActive({ ...emptyFilterState, search: "   " })).toBe(false);
  });

  it("любой заданный фильтр активен", () => {
    expect(isFilterActive({ ...emptyFilterState, search: "эл" })).toBe(true);
    expect(isFilterActive({ ...emptyFilterState, rarity: "S" })).toBe(true);
  });
});
