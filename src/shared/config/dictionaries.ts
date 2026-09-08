/**
 * Русские подписи для машинных ключей из данных.
 * Неизвестный ключ отображается как есть — данные могут опережать словарь.
 */

const attributeLabels: Record<string, string> = {
  physical: "Физический",
  fire: "Огонь",
  ice: "Лёд",
  electric: "Электро",
  ether: "Эфир",
  wind: "Ветер",
  lumiflux: "Люмен",
};

const specialtyLabels: Record<string, string> = {
  attack: "Атака",
  stun: "Оглушение",
  anomaly: "Аномалия",
  support: "Поддержка",
  defense: "Защита",
  rupture: "Разрушение",
};

/** Роли в тир-листе: как персонаж используется в команде. */
const tierRoleLabels: Record<string, string> = {
  dps: "Основной ДД",
  "sub-dps": "Саб-ДД",
  support: "Поддержка",
};

const statLabels: Record<string, string> = {
  hp: "HP",
  atk: "Атака",
  def: "Защита",
  impact: "Импакт",
  critRate: "Крит. шанс",
  critDmg: "Крит. урон",
  anomalyMastery: "Мастерство аномалий",
  anomalyProficiency: "Владение аномалиями",
  energyRegen: "Восст. энергии",
  penRatio: "Пробитие брони",
};

function translate(dictionary: Record<string, string>, key: string): string {
  return dictionary[key] ?? key;
}

export const getAttributeLabel = (key: string) =>
  translate(attributeLabels, key);
export const getSpecialtyLabel = (key: string) =>
  translate(specialtyLabels, key);
export const getTierRoleLabel = (key: string) =>
  translate(tierRoleLabels, key);
export const getStatLabel = (key: string) => translate(statLabels, key);

/** Подписи групп фильтров — используются и на списке персонажей, и в тир-листе. */
export const filterLabels = {
  search: "Поиск по имени",
  attribute: "Атрибут",
  specialty: "Специализация",
  rarity: "Ранг",
  all: "Все",
  reset: "Сбросить",
} as const;
