import teamsData from "@data/teams.json";

import { once } from "../lib/once";
import {
  parseTeamsFile,
  type Character,
  type TeamDamageType,
  type TeamRecord,
} from "./schemas";
import { loadCharactersById } from "./characters";

/**
 * Доступ к командам. Состав описан один раз в `data/teams.json` и перечисляет
 * участников по id: принадлежность команды агенту не хранится, а выводится —
 * команда «его», если его id есть в составе. Поэтому добавление состава
 * автоматически показывает его на страницах всех трёх участников.
 */

const loadTeams = once(() => parseTeamsFile(teamsData).teams);

/** Участник состава: ровно то, что нужно для портрета, бейджа атрибута и ссылки. */
export type TeamMember = Pick<
  Character,
  "id" | "name" | "slug" | "image" | "attribute"
>;

export type Team = {
  members: TeamMember[];
  damageType?: TeamDamageType;
};

/**
 * Разворачивает id участников в то, что нужно для портрета и ссылки.
 * Порядок участников — авторский, из данных: он несёт смысл (основной ДД первым).
 */
async function resolveTeams(records: TeamRecord[]): Promise<Team[]> {
  const byId = loadCharactersById();

  return records.map((team) => ({
    damageType: team.damageType,
    members: team.members.map((memberId) => {
      const character = byId.get(memberId);

      // В отличие от тир-листа, где запись на несуществующего агента просто
      // пропускается, здесь это ошибка: состав из двух участников — уже не
      // команда, а ссылка в никуда. Страницы агентов статические, так что
      // опечатка в id падает на сборке, а не тихо портит страницу.
      if (!character) {
        throw new Error(
          `Состав ${team.members.join(" + ")} ссылается на неизвестного агента: ${memberId}`,
        );
      }

      return {
        id: character.id,
        name: character.name,
        slug: character.slug,
        image: character.image,
        attribute: character.attribute,
      };
    }),
  }));
}

/** Все составы — в том порядке, в каком они лежат в данных. */
export async function getAllTeams(): Promise<Team[]> {
  return resolveTeams(loadTeams());
}

/** Составы, в которых участвует агент. */
export async function getTeamsForCharacter(
  characterId: string,
): Promise<Team[]> {
  return resolveTeams(
    loadTeams().filter((team) => team.members.includes(characterId)),
  );
}
