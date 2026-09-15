import { describe, expect, it } from "vitest";

import type { Team } from "@/entities/team";

import { applyTeamFilters, isFilterActive } from "./apply-filters";
import { emptyFilterState } from "../model/types";

const member = (id: string, name: string) => ({
  id,
  name,
  slug: id,
  image: "/images/characters/test.svg",
});

const teams: Team[] = [
  {
    damageType: "pure-dps",
    members: [member("a", "Эллен Джо"), member("b", "Лайкон"), member("c", "Мияби")],
  },
  {
    damageType: "anomaly-dps",
    members: [member("d", "Бернис"), member("e", "Грейс"), member("f", "Мияби")],
  },
  {
    members: [member("g", "Корин"), member("h", "Николь"), member("i", "Энби Демара")],
  },
];

describe("applyTeamFilters", () => {
  it("без фильтров возвращает все составы", () => {
    expect(applyTeamFilters(teams, emptyFilterState)).toHaveLength(3);
  });

  it("ищет по части имени участника без учёта регистра и пробелов", () => {
    const found = applyTeamFilters(teams, {
      ...emptyFilterState,
      agentName: "  мияби ",
    });

    expect(found).toHaveLength(2);
  });

  it("фильтрует по типу урона", () => {
    const found = applyTeamFilters(teams, {
      ...emptyFilterState,
      damageType: "anomaly-dps",
    });

    expect(found.map((team) => team.members[0].id)).toEqual(["d"]);
  });

  it("у состава без размеченного типа урона фильтр по типу ничего не находит", () => {
    const found = applyTeamFilters(teams, {
      ...emptyFilterState,
      damageType: "pure-dps",
    });

    expect(found.every((team) => team.damageType === "pure-dps")).toBe(true);
  });

  it("применяет несколько фильтров одновременно", () => {
    const found = applyTeamFilters(teams, {
      agentName: "мияби",
      damageType: "pure-dps",
    });

    expect(found.map((team) => team.members[0].id)).toEqual(["a"]);
  });

  it("возвращает пустой список, если совпадений нет", () => {
    expect(
      applyTeamFilters(teams, { agentName: "неизвестный агент", damageType: null }),
    ).toEqual([]);
  });
});

describe("isFilterActive", () => {
  it("пустое состояние не считается активным фильтром", () => {
    expect(isFilterActive(emptyFilterState)).toBe(false);
    expect(isFilterActive({ ...emptyFilterState, agentName: "   " })).toBe(false);
  });

  it("любой заданный фильтр активен", () => {
    expect(isFilterActive({ ...emptyFilterState, agentName: "Мияби" })).toBe(true);
    expect(isFilterActive({ ...emptyFilterState, damageType: "pure-dps" })).toBe(true);
  });
});
