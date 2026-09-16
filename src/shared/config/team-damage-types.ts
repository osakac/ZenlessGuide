/**
 * Типы урона состава. Лежат в config, а не только в zod-схеме `shared/api`:
 * их читают клиентские фильтры, а импорт значения из `shared/api` затащил бы
 * в клиентский бандл zod и сами JSON-файлы данных. Схема строит enum отсюда же.
 */
export const teamDamageTypes = ["pure-dps", "anomaly-dps"] as const;

export type TeamDamageType = (typeof teamDamageTypes)[number];

export const isTeamDamageType = (value: unknown): value is TeamDamageType =>
  teamDamageTypes.includes(value as TeamDamageType);
