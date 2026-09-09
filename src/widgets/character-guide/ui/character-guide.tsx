import type { Character } from "@/entities/character";
import type { Team } from "@/shared/api";
import { getStatLabel } from "@/shared/config";

import { GuideSection } from "./guide-section";
import { TeamCard } from "./team-card";

type CharacterGuideProps = {
  character: Character;
  /** Составы, в которых участвует агент: приходят из общего списка команд. */
  teams?: Team[];
};

/**
 * Каждый блок появляется, только если данные для него заполнены:
 * гайды наполняются постепенно, и полупустая страница не должна
 * показывать заголовки без содержимого.
 */
export function CharacterGuide({ character, teams = [] }: CharacterGuideProps) {
  const { stats, buildGuide } = character;
  const hasStats = stats && Object.keys(stats).length > 0;

  const sections = [
    hasStats,
    buildGuide?.engines?.length,
    buildGuide?.discs?.length,
    buildGuide?.mainStats?.length || buildGuide?.subStats?.length,
    buildGuide?.skillPriority?.length,
    teams.length,
    buildGuide?.tips?.length,
  ].some(Boolean);

  if (!sections) {
    return (
      <p className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
        Гайд по этому агенту ещё не написан.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {hasStats ? (
        <GuideSection title="Базовые статы">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-3 border-b py-1.5">
                <dt className="text-sm text-muted-foreground">
                  {getStatLabel(key)}
                </dt>
                <dd className="text-sm font-medium tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </GuideSection>
      ) : null}

      {buildGuide?.engines?.length ? (
        <GuideSection title="W-Engine">
          <ol className="flex flex-col gap-3">
            {buildGuide.engines.map((engine, index) => (
              <li key={engine.name} className="flex gap-3">
                <span className="text-sm font-semibold text-muted-foreground tabular-nums">
                  {index + 1}.
                </span>
                <div>
                  <p className="font-medium">{engine.name}</p>
                  {engine.note ? (
                    <p className="text-sm text-muted-foreground">{engine.note}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </GuideSection>
      ) : null}

      {buildGuide?.discs?.length ? (
        <GuideSection title="Драйв-диски">
          <ul className="flex flex-col gap-3">
            {buildGuide.discs.map((disc) => (
              <li key={`${disc.setName}-${disc.pieces}`} className="flex gap-3">
                <span className="inline-flex h-6 shrink-0 items-center rounded-md border bg-muted px-2 text-xs font-semibold">
                  {disc.pieces} шт.
                </span>
                <div>
                  <p className="font-medium">{disc.setName}</p>
                  {disc.note ? (
                    <p className="text-sm text-muted-foreground">{disc.note}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </GuideSection>
      ) : null}

      {buildGuide?.mainStats?.length || buildGuide?.subStats?.length ? (
        <GuideSection title="Приоритет статов">
          {buildGuide.mainStats?.length ? (
            <dl className="mb-4 flex flex-col gap-2">
              {buildGuide.mainStats.map((entry) => (
                <div key={entry.slot} className="flex justify-between gap-3 border-b py-1.5">
                  <dt className="text-sm text-muted-foreground">{entry.slot}</dt>
                  <dd className="text-sm font-medium">{entry.stat}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {buildGuide.subStats?.length ? (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Доп. статы:</span>
              {buildGuide.subStats.map((stat) => (
                <span
                  key={stat}
                  className="rounded-md border bg-muted px-2 py-0.5 text-xs"
                >
                  {stat}
                </span>
              ))}
            </div>
          ) : null}
        </GuideSection>
      ) : null}

      {buildGuide?.skillPriority?.length ? (
        <GuideSection title="Приоритет прокачки навыков">
          <ol className="flex flex-wrap items-center gap-2">
            {buildGuide.skillPriority.map((skill, index) => (
              <li key={skill} className="flex items-center gap-2">
                {index > 0 ? (
                  <span className="text-muted-foreground">→</span>
                ) : null}
                <span className="rounded-md border bg-muted px-2 py-1 text-sm">
                  {skill}
                </span>
              </li>
            ))}
          </ol>
        </GuideSection>
      ) : null}

      {teams.length ? (
        <GuideSection title="Команды">
          <ul className="grid gap-3 sm:grid-cols-2">
            {/* Ключ — набор участников: он уникален по схеме данных,
                и ничего другого в составе нет. */}
            {teams.map((team) => (
              <li key={team.members.map((member) => member.id).join("|")}>
                <TeamCard team={team} currentCharacterId={character.id} />
              </li>
            ))}
          </ul>
        </GuideSection>
      ) : null}

      {buildGuide?.tips?.length ? (
        <GuideSection title="Советы по игре">
          <ul className="flex list-disc flex-col gap-2 pl-5">
            {buildGuide.tips.map((tip) => (
              <li key={tip} className="text-sm">
                {tip}
              </li>
            ))}
          </ul>
        </GuideSection>
      ) : null}
    </div>
  );
}
