import teamsData from "@data/teams.json";

import { once } from "../lib/once";
import { parseTeamsFile, type Character } from "./schemas";
import { getAllCharacters } from "./characters";

/**
 * Доступ к командам. Состав описан один раз в `data/teams.json` и перечисляет
 * участников по id: принадлежность команды агенту не хранится, а выводится —
 * команда «его», если его id есть в составе. Поэтому добавление состава
 * автоматически показывает его на страницах всех трёх участников.
 */

const loadTeams = once(() => parseTeamsFile(teamsData).teams);

/** Участник состава: ровно то, что нужно для портрета и ссылки. */
export type TeamMember = Pick<Character, "id" | "name" | "slug" | "image">;

export type Team = {
  members: TeamMember[];
};

/**
 * Составы, в которых участвует агент. Порядок участников — авторский,
 * из данных: он несёт смысл (основной ДД первым).
 */
export async function getTeamsForCharacter(
  characterId: string,
): Promise<Team[]> {
  const teams = loadTeams();
  const characters = await getAllCharacters();
  const byId = new Map(characters.map((character) => [character.id, character]));

  return teams
    .filter((team) => team.members.includes(characterId))
    .map((team) => ({
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
        };
      }),
    }));
}
