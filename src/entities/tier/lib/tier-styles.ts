/**
 * Классы Tailwind перечислены явно: собирать их конкатенацией нельзя —
 * сборщик не увидит класс и вырежет его из бандла.
 */
const tierStyles: Record<string, string> = {
  S: "border-tier-s/40 bg-tier-s/15 text-tier-s",
  A: "border-tier-a/40 bg-tier-a/15 text-tier-a",
  B: "border-tier-b/40 bg-tier-b/15 text-tier-b",
  C: "border-tier-c/40 bg-tier-c/15 text-tier-c",
  D: "border-tier-d/40 bg-tier-d/15 text-tier-d",
};

const fallback = "border-border bg-muted text-muted-foreground";

export function getTierStyle(tierId: string): string {
  return tierStyles[tierId.toUpperCase()] ?? fallback;
}
