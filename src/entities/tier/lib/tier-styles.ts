/**
 * Классы Tailwind перечислены явно: собирать их конкатенацией нельзя —
 * сборщик не увидит класс и вырежет его из бандла.
 */
const tierStyles: Record<string, string> = {
  S: "border-tier-s/40 bg-tier-s/15 text-tier-s",
  A: "border-tier-a/40 bg-tier-a/15 text-tier-a",
};

const fallback = "border-border bg-muted text-muted-foreground";

export function getTierStyle(tierId: string): string {
  return tierStyles[tierId.toUpperCase()] ?? fallback;
}
