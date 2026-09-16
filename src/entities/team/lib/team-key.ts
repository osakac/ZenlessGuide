import type { Team } from "../model/types";

/**
 * Ключ состава для списков. Набор участников уникален по схеме данных,
 * а ничего другого, что могло бы служить id, в составе нет.
 */
export const getTeamKey = (team: Team) =>
  team.members.map((member) => member.id).join("|");
