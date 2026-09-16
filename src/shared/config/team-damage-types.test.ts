import { describe, expect, it } from "vitest";

import { isTeamDamageType, teamDamageTypes } from "./team-damage-types";

describe("isTeamDamageType", () => {
  it("принимает все известные типы урона", () => {
    expect(teamDamageTypes.every(isTeamDamageType)).toBe(true);
  });

  it("отбрасывает неизвестное значение и пустоту", () => {
    expect(isTeamDamageType("foo")).toBe(false);
    expect(isTeamDamageType("support")).toBe(false);
    expect(isTeamDamageType(null)).toBe(false);
  });
});
