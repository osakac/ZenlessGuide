import { z } from "zod";

/**
 * Схемы данных — единственный источник правды по форме персонажей и тир-листа.
 * Типы выводятся отсюда через z.infer, чтобы не расходиться с валидацией.
 *
 * Поля билд-гайда намеренно опциональны: данные наполняются итеративно,
 * и страница персонажа должна корректно рендериться с частично заполненной записью.
 */

const nonEmpty = z.string().min(1);

export const buildGuideSchema = z.object({
  engines: z
    .array(z.object({ name: nonEmpty, note: z.string().optional() }))
    .optional(),
  discs: z
    .array(
      z.object({
        setName: nonEmpty,
        pieces: z.union([z.literal(2), z.literal(4)]),
        note: z.string().optional(),
      }),
    )
    .optional(),
  mainStats: z
    .array(z.object({ slot: nonEmpty, stat: nonEmpty }))
    .optional(),
  subStats: z.array(nonEmpty).optional(),
  skillPriority: z.array(nonEmpty).optional(),
  tips: z.array(nonEmpty).optional(),
});

export const characterSchema = z.object({
  id: nonEmpty,
  slug: nonEmpty,
  name: nonEmpty,
  rarity: nonEmpty,
  attribute: nonEmpty,
  specialty: nonEmpty,
  faction: z.string().optional(),
  shortDescription: z.string(),
  image: nonEmpty,
  stats: z.record(nonEmpty, z.union([z.string(), z.number()])).optional(),
  buildGuide: buildGuideSchema.optional(),
});

export const charactersFileSchema = z.object({
  characters: z.array(characterSchema),
});

/**
 * Команда — самостоятельная запись, а не поле агента: состав симметричен,
 * и хранить его у каждого участника значило бы трижды дублировать одно и то же.
 * Связь «агент ↔ команда» выводится из `members`, отдельного id у состава нет —
 * набор участников сам по себе уникален. Ничего, кроме участников, в составе
 * и нет: название и комментарий были придуманными подписями к тройке портретов.
 */
export const teamSchema = z.object({
  members: z
    .array(nonEmpty)
    // Отряд в ZZZ всегда состоит ровно из трёх агентов — это не соглашение
    // данных, а правило игры, поэтому длина фиксированная.
    .length(3, "команда состоит ровно из трёх агентов")
    .refine(
      (members) => new Set(members).size === members.length,
      "агент не может занимать в команде два места",
    ),
});

/** Ключ состава — набор участников без учёта порядка. */
const teamKey = (members: string[]) => [...members].sort().join("|");

export const teamsFileSchema = z.object({
  teams: z
    .array(teamSchema)
    .refine(
      (teams) => new Set(teams.map((team) => teamKey(team.members))).size === teams.length,
      "один и тот же набор агентов описан больше одного раза",
    ),
});

export const tierSchema = z.object({
  id: nonEmpty,
  label: nonEmpty,
});

/**
 * Роль в тир-листе — не свойство персонажа, а его место в конкретной оценке:
 * один и тот же агент может быть основным ДД в одной мете и саб-ДД в другой.
 */
export const tierRoleSchema = z.enum(["pure-dps", "anomaly-dps", "support"]);

export const tierEntrySchema = z.object({
  characterId: nonEmpty,
  tier: nonEmpty,
  role: tierRoleSchema,
  note: z.string().optional(),
});

export const tierListFileSchema = z.object({
  updatedAt: nonEmpty,
  tiers: z.array(tierSchema),
  entries: z.array(tierEntrySchema),
});

export type BuildGuide = z.infer<typeof buildGuideSchema>;
export type Character = z.infer<typeof characterSchema>;
export type TeamRecord = z.infer<typeof teamSchema>;
export type Tier = z.infer<typeof tierSchema>;
export type TierRole = z.infer<typeof tierRoleSchema>;
export type TierEntry = z.infer<typeof tierEntrySchema>;
export type CharactersFile = z.infer<typeof charactersFileSchema>;
export type TeamsFile = z.infer<typeof teamsFileSchema>;
export type TierListFile = z.infer<typeof tierListFileSchema>;

/** Разбирает результат валидации, превращая ошибку zod в читаемое сообщение. */
function parseOrThrow<T>(schema: z.ZodType<T>, raw: unknown, source: string): T {
  const result = schema.safeParse(raw);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  • ${issue.path.join(".") || "<корень>"}: ${issue.message}`)
      .join("\n");

    throw new Error(`Некорректные данные в ${source}:\n${details}`);
  }

  return result.data;
}

export function parseCharactersFile(raw: unknown): CharactersFile {
  return parseOrThrow(charactersFileSchema, raw, "data/characters.json");
}

export function parseTeamsFile(raw: unknown): TeamsFile {
  return parseOrThrow(teamsFileSchema, raw, "data/teams.json");
}

export function parseTierListFile(raw: unknown): TierListFile {
  return parseOrThrow(tierListFileSchema, raw, "data/tierlist.json");
}
