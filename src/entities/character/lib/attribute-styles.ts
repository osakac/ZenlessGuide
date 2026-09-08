/**
 * Классы Tailwind перечислены явно, чтобы сборщик их увидел
 * (динамические строки вида `text-attr-${key}` вырезаются из бандла).
 */
const attributeStyles: Record<string, string> = {
  physical: "border-attr-physical/40 bg-attr-physical/15 text-attr-physical",
  fire: "border-attr-fire/40 bg-attr-fire/15 text-attr-fire",
  ice: "border-attr-ice/40 bg-attr-ice/15 text-attr-ice",
  electric: "border-attr-electric/40 bg-attr-electric/15 text-attr-electric",
  ether: "border-attr-ether/40 bg-attr-ether/15 text-attr-ether",
};

const fallback = "border-attr-default/40 bg-attr-default/15 text-attr-default";

export function getAttributeStyle(attribute: string): string {
  return attributeStyles[attribute] ?? fallback;
}
