/**
 * Стили бейджа атрибута — общие для карточки/плитки агента (entities/character)
 * и портрета участника состава (entities/team). Лежат в shared, а не в
 * entities/character, — слои entities друг у друга ничего не импортируют.
 *
 * Классы Tailwind перечислены явно, чтобы сборщик их увидел
 * (динамические строки вида `text-attr-${key}` вырезаются из бандла).
 */
const attributeStyles: Record<string, string> = {
  physical: "border-attr-physical/40 bg-attr-physical/15 text-attr-physical",
  fire: "border-attr-fire/40 bg-attr-fire/15 text-attr-fire",
  ice: "border-attr-ice/40 bg-attr-ice/15 text-attr-ice",
  electric: "border-attr-electric/40 bg-attr-electric/15 text-attr-electric",
  ether: "border-attr-ether/40 bg-attr-ether/15 text-attr-ether",
  wind: "border-attr-wind/40 bg-attr-wind/15 text-attr-wind",
  lumiflux: "border-attr-lumiflux/40 bg-attr-lumiflux/15 text-attr-lumiflux",
};

const fallback = "border-attr-default/40 bg-attr-default/15 text-attr-default";

export function getAttributeStyle(attribute: string): string {
  return attributeStyles[attribute] ?? fallback;
}

/**
 * Только рамка — для иконки поверх портрета, где фон уже задаёт
 * затемнённая подложка, а не сам атрибут.
 */
const attributeBorderStyles: Record<string, string> = {
  physical: "border-attr-physical",
  fire: "border-attr-fire",
  ice: "border-attr-ice",
  electric: "border-attr-electric",
  ether: "border-attr-ether",
  wind: "border-attr-wind",
  lumiflux: "border-attr-lumiflux",
};

const borderFallback = "border-attr-default";

export function getAttributeBorderStyle(attribute: string): string {
  return attributeBorderStyles[attribute] ?? borderFallback;
}

/**
 * Рамка карточки цветом атрибута при наведении/фокусе — вешается на сам
 * элемент-ссылку карточки (`hover:`/`focus-visible:`, а не `group-hover:`,
 * т.к. рамка меняется у того же элемента, который наводят).
 */
const attributeHoverBorderStyles: Record<string, string> = {
  physical: "hover:border-attr-physical focus-visible:border-attr-physical",
  fire: "hover:border-attr-fire focus-visible:border-attr-fire",
  ice: "hover:border-attr-ice focus-visible:border-attr-ice",
  electric: "hover:border-attr-electric focus-visible:border-attr-electric",
  ether: "hover:border-attr-ether focus-visible:border-attr-ether",
  wind: "hover:border-attr-wind focus-visible:border-attr-wind",
  lumiflux: "hover:border-attr-lumiflux focus-visible:border-attr-lumiflux",
};

const hoverBorderFallback =
  "hover:border-attr-default focus-visible:border-attr-default";

export function getAttributeHoverBorderStyle(attribute: string): string {
  return attributeHoverBorderStyles[attribute] ?? hoverBorderFallback;
}

/**
 * То же самое, но для рамки на потомке наводимого элемента (например,
 * обёртка портрета внутри карточки-ссылки) — переключается через
 * `group-hover`/`group-focus-visible`, а не собственное состояние наведения.
 */
const attributeGroupHoverBorderStyles: Record<string, string> = {
  physical:
    "group-hover:border-attr-physical group-focus-visible:border-attr-physical",
  fire: "group-hover:border-attr-fire group-focus-visible:border-attr-fire",
  ice: "group-hover:border-attr-ice group-focus-visible:border-attr-ice",
  electric:
    "group-hover:border-attr-electric group-focus-visible:border-attr-electric",
  ether: "group-hover:border-attr-ether group-focus-visible:border-attr-ether",
  wind: "group-hover:border-attr-wind group-focus-visible:border-attr-wind",
  lumiflux:
    "group-hover:border-attr-lumiflux group-focus-visible:border-attr-lumiflux",
};

const groupHoverBorderFallback =
  "group-hover:border-attr-default group-focus-visible:border-attr-default";

export function getAttributeGroupHoverBorderStyle(attribute: string): string {
  return attributeGroupHoverBorderStyles[attribute] ?? groupHoverBorderFallback;
}

/**
 * Текст (например, имя агента) цветом атрибута, когда наведён родитель
 * с классом `group` — сама карточка, а не текст напрямую.
 */
const attributeHoverTextStyles: Record<string, string> = {
  physical:
    "group-hover:text-attr-physical group-focus-visible:text-attr-physical",
  fire: "group-hover:text-attr-fire group-focus-visible:text-attr-fire",
  ice: "group-hover:text-attr-ice group-focus-visible:text-attr-ice",
  electric:
    "group-hover:text-attr-electric group-focus-visible:text-attr-electric",
  ether: "group-hover:text-attr-ether group-focus-visible:text-attr-ether",
  wind: "group-hover:text-attr-wind group-focus-visible:text-attr-wind",
  lumiflux:
    "group-hover:text-attr-lumiflux group-focus-visible:text-attr-lumiflux",
};

const hoverTextFallback =
  "group-hover:text-attr-default group-focus-visible:text-attr-default";

export function getAttributeHoverTextStyle(attribute: string): string {
  return attributeHoverTextStyles[attribute] ?? hoverTextFallback;
}

/**
 * Свечение тенью цветом атрибута при наведении/фокусе — вешается на тот же
 * элемент, что и рамка (`hover:`/`focus-visible:`). Форма тени задана вручную
 * (без смещения x/y, только размытие) — так свечение ложится равномерно по
 * всему периметру карточки, а не только снизу, как у стандартных
 * `shadow-lg`/`shadow-2xl`. Классы прописаны целиком строкой — сборщик
 * Tailwind ищет буквальные подстроки в исходниках, а не результат склейки.
 */
const attributeHoverShadowStyles: Record<string, string> = {
  physical:
    "hover:shadow-[0_0_35px_var(--tw-shadow-color)] hover:shadow-attr-physical/60 focus-visible:shadow-[0_0_35px_var(--tw-shadow-color)] focus-visible:shadow-attr-physical/60",
  fire: "hover:shadow-[0_0_35px_var(--tw-shadow-color)] hover:shadow-attr-fire/60 focus-visible:shadow-[0_0_35px_var(--tw-shadow-color)] focus-visible:shadow-attr-fire/60",
  ice: "hover:shadow-[0_0_35px_var(--tw-shadow-color)] hover:shadow-attr-ice/60 focus-visible:shadow-[0_0_35px_var(--tw-shadow-color)] focus-visible:shadow-attr-ice/60",
  electric:
    "hover:shadow-[0_0_35px_var(--tw-shadow-color)] hover:shadow-attr-electric/60 focus-visible:shadow-[0_0_35px_var(--tw-shadow-color)] focus-visible:shadow-attr-electric/60",
  ether:
    "hover:shadow-[0_0_35px_var(--tw-shadow-color)] hover:shadow-attr-ether/60 focus-visible:shadow-[0_0_35px_var(--tw-shadow-color)] focus-visible:shadow-attr-ether/60",
  wind: "hover:shadow-[0_0_35px_var(--tw-shadow-color)] hover:shadow-attr-wind/60 focus-visible:shadow-[0_0_35px_var(--tw-shadow-color)] focus-visible:shadow-attr-wind/60",
  lumiflux:
    "hover:shadow-[0_0_35px_var(--tw-shadow-color)] hover:shadow-attr-lumiflux/60 focus-visible:shadow-[0_0_35px_var(--tw-shadow-color)] focus-visible:shadow-attr-lumiflux/60",
};

const hoverShadowFallback =
  "hover:shadow-[0_0_35px_var(--tw-shadow-color)] hover:shadow-attr-default/60 focus-visible:shadow-[0_0_35px_var(--tw-shadow-color)] focus-visible:shadow-attr-default/60";

export function getAttributeHoverShadowStyle(attribute: string): string {
  return attributeHoverShadowStyles[attribute] ?? hoverShadowFallback;
}

/**
 * То же свечение, но переключается через `group-hover`/`group-focus-visible` —
 * для элементов внутри наводимой карточки/плитки (например, портрет
 * участника состава), а не для самого наводимого элемента.
 */
const attributeGroupHoverShadowStyles: Record<string, string> = {
  physical:
    "group-hover:shadow-[0_0_35px_var(--tw-shadow-color)] group-hover:shadow-attr-physical/60 group-focus-visible:shadow-[0_0_35px_var(--tw-shadow-color)] group-focus-visible:shadow-attr-physical/60",
  fire: "group-hover:shadow-[0_0_35px_var(--tw-shadow-color)] group-hover:shadow-attr-fire/60 group-focus-visible:shadow-[0_0_35px_var(--tw-shadow-color)] group-focus-visible:shadow-attr-fire/60",
  ice: "group-hover:shadow-[0_0_35px_var(--tw-shadow-color)] group-hover:shadow-attr-ice/60 group-focus-visible:shadow-[0_0_35px_var(--tw-shadow-color)] group-focus-visible:shadow-attr-ice/60",
  electric:
    "group-hover:shadow-[0_0_35px_var(--tw-shadow-color)] group-hover:shadow-attr-electric/60 group-focus-visible:shadow-[0_0_35px_var(--tw-shadow-color)] group-focus-visible:shadow-attr-electric/60",
  ether:
    "group-hover:shadow-[0_0_35px_var(--tw-shadow-color)] group-hover:shadow-attr-ether/60 group-focus-visible:shadow-[0_0_35px_var(--tw-shadow-color)] group-focus-visible:shadow-attr-ether/60",
  wind: "group-hover:shadow-[0_0_35px_var(--tw-shadow-color)] group-hover:shadow-attr-wind/60 group-focus-visible:shadow-[0_0_35px_var(--tw-shadow-color)] group-focus-visible:shadow-attr-wind/60",
  lumiflux:
    "group-hover:shadow-[0_0_35px_var(--tw-shadow-color)] group-hover:shadow-attr-lumiflux/60 group-focus-visible:shadow-[0_0_35px_var(--tw-shadow-color)] group-focus-visible:shadow-attr-lumiflux/60",
};

const groupHoverShadowFallback =
  "group-hover:shadow-[0_0_35px_var(--tw-shadow-color)] group-hover:shadow-attr-default/60 group-focus-visible:shadow-[0_0_35px_var(--tw-shadow-color)] group-focus-visible:shadow-attr-default/60";

export function getAttributeGroupHoverShadowStyle(attribute: string): string {
  return attributeGroupHoverShadowStyles[attribute] ?? groupHoverShadowFallback;
}
