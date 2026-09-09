#!/usr/bin/env node
/**
 * Проверка агента после добавления — то, чего не ловят zod-схемы и тесты:
 * файл портрета на диске, подписи для атрибута и специализации, дубли
 * и участие в командах. Запуск из корня проекта:
 *
 *   node .claude/skills/add-new-agent/scripts/check-agent.mjs <id>
 */
import fs from "node:fs";

const id = process.argv[2];

if (!id) {
  console.error("Укажи id агента: node .claude/skills/add-new-agent/scripts/check-agent.mjs <id>");
  process.exit(2);
}

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

const characters = read("data/characters.json").characters;
const tierlist = read("data/tierlist.json");
const teams = read("data/teams.json").teams;
const dictionaries = fs.readFileSync("src/shared/config/dictionaries.ts", "utf8");

const problems = [];
const notes = [];

const character = characters.find((item) => item.id === id);

if (!character) {
  console.error(`✗ в data/characters.json нет агента с id "${id}"`);
  process.exit(1);
}

notes.push(`агент: ${character.name} (${character.slug}), ранг ${character.rarity}`);

// Дубли: slug и имя должны быть уникальны — по ним строятся маршруты и ссылки.
for (const field of ["id", "slug", "name"]) {
  const twins = characters.filter((item) => item[field] === character[field]);
  if (twins.length > 1) problems.push(`${field} "${character[field]}" встречается ${twins.length} раза`);
}

// Портрет: путь из данных должен вести на существующий webp в public/.
const imagePath = `public${character.image}`;
if (!fs.existsSync(imagePath)) {
  problems.push(`нет файла портрета ${imagePath} (поле image)`);
} else {
  const buffer = fs.readFileSync(imagePath);
  const isWebp = buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  if (!isWebp) problems.push(`${imagePath} — не webp`);
  else {
    let size = "";
    if (buffer.toString("ascii", 12, 16) === "VP8X") {
      size = ` ${(buffer.readUIntLE(24, 3) & 0xffffff) + 1}×${(buffer.readUIntLE(27, 3) & 0xffffff) + 1}`;
    }
    notes.push(`портрет: ${imagePath}${size}, ${(buffer.length / 1024).toFixed(1)} КБ`);
  }
}

// Запись в тир-листе: без неё агент не попадёт ни в тир-лист, ни на главную.
const entries = tierlist.entries.filter((entry) => entry.characterId === id);
if (entries.length === 0) problems.push("нет записи в data/tierlist.json");
else if (entries.length > 1) problems.push(`в data/tierlist.json ${entries.length} записи на одного агента`);
else {
  const [entry] = entries;
  if (!tierlist.tiers.some((tier) => tier.id === entry.tier)) {
    problems.push(`тир "${entry.tier}" не описан в tiers из data/tierlist.json`);
  }
  notes.push(`тир-лист: ${entry.tier} / ${entry.role}`);
}

// Подписи: незнакомый ключ отрисуется как есть и останется без цвета.
if (!new RegExp(`\n  ${character.attribute}:`).test(dictionaries)) {
  problems.push(`атрибут "${character.attribute}" без русской подписи в src/shared/config/dictionaries.ts`);
}
if (!new RegExp(`\n  ${character.specialty}:`).test(dictionaries)) {
  problems.push(`специализация "${character.specialty}" без русской подписи в src/shared/config/dictionaries.ts`);
}

// Команды: состав из троих, все участники заведены, набор не повторяется.
const knownIds = new Set(characters.map((item) => item.id));
const withAgent = teams.filter((team) => team.members.includes(id));
notes.push(`составов с участием агента: ${withAgent.length}`);

for (const team of teams) {
  const unknown = team.members.filter((member) => !knownIds.has(member));
  if (unknown.length > 0) problems.push(`состав ${team.members.join(" + ")} ссылается на неизвестных агентов: ${unknown.join(", ")}`);
}

const seen = new Set();
for (const team of teams) {
  const key = [...team.members].sort().join("|");
  if (seen.has(key)) problems.push(`состав ${team.members.join(" + ")} описан больше одного раза`);
  seen.add(key);
}

// Блоки билд-гайда: пустые не ошибка, но о них стоит знать.
const guide = character.buildGuide ?? {};
const empty = ["engines", "discs", "mainStats", "subStats", "skillPriority", "tips"]
  .filter((block) => !guide[block]?.length);
if (!character.stats || Object.keys(character.stats).length === 0) empty.push("stats");
if (empty.length > 0) notes.push(`не заполнено: ${empty.join(", ")}`);

for (const note of notes) console.log(`  ${note}`);

if (problems.length > 0) {
  console.error(`\n✗ проблем: ${problems.length}`);
  for (const problem of problems) console.error(`  • ${problem}`);
  process.exit(1);
}

console.log("\n✓ проверки пройдены");
