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
  attack: "Нападение",
  stun: "Оглушение",
  anomaly: "Аномалия",
  support: "Поддержка",
  defense: "Оборона",
  rupture: "Разрушение",
  armorer: "Оружейник",
};

/** Иконки специальностей — с wiki.gg, лежат в public/images/specialties. */
const specialtyIcons: Record<string, string> = {
  attack: "/images/specialties/attack.png",
  stun: "/images/specialties/stun.png",
  anomaly: "/images/specialties/anomaly.png",
  support: "/images/specialties/support.png",
  defense: "/images/specialties/defense.png",
  rupture: "/images/specialties/rupture.png",
  armorer: "/images/specialties/armorer.png",
};

/** Иконки атрибутов — с wiki.gg, лежат в public/images/attributes. */
const attributeIcons: Record<string, string> = {
  physical: "/images/attributes/physical.png",
  fire: "/images/attributes/fire.png",
  ice: "/images/attributes/ice.png",
  electric: "/images/attributes/electric.png",
  ether: "/images/attributes/ether.png",
  wind: "/images/attributes/wind.png",
  lumiflux: "/images/attributes/lumiflux.png",
};

/** Роли в тир-листе: как персонаж используется в команде. */
const tierRoleLabels: Record<string, string> = {
  "pure-dps": "Pure DPS",
  "anomaly-dps": "Anomaly DPS",
  support: "Support",
};

const statLabels: Record<string, string> = {
  hp: "HP",
  atk: "Атака",
  def: "Защита",
  impact: "Импульс",
  critRate: "Крит. шанс",
  critDmg: "Крит. урон",
  anomalyMastery: "Контроль аномалии",
  anomalyProficiency: "Знание аномалии",
  energyRegen: "Восст. энергии",
  penRatio: "Пробитие",
};

function translate(dictionary: Record<string, string>, key: string): string {
  return dictionary[key] ?? key;
}

export const getAttributeLabel = (key: string) =>
  translate(attributeLabels, key);
export const getSpecialtyLabel = (key: string) =>
  translate(specialtyLabels, key);
export const getSpecialtyIcon = (key: string): string | undefined =>
  specialtyIcons[key];
export const getAttributeIcon = (key: string): string | undefined =>
  attributeIcons[key];
export const getTierRoleLabel = (key: string) =>
  translate(tierRoleLabels, key);
export const getStatLabel = (key: string) => translate(statLabels, key);

/** Подписи групп фильтров — используются и на списке персонажей, и в тир-листе. */
export const filterLabels = {
  search: "Поиск по имени",
  attribute: "Атрибут",
  specialty: "Специализация",
  agent: "Агент",
  damageType: "Тип урона",
  all: "Все",
  reset: "Сбросить",
} as const;
