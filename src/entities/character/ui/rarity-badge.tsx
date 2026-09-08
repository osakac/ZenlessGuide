import { cn } from "@/shared/lib";

type RarityBadgeProps = {
  rarity: string;
  className?: string;
};

const rarityStyles: Record<string, string> = {
  S: "border-amber-400/50 bg-amber-400/15 text-amber-500 dark:text-amber-300",
  A: "border-violet-400/50 bg-violet-400/15 text-violet-600 dark:text-violet-300",
};

export function RarityBadge({ rarity, className }: RarityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-w-6 items-center justify-center rounded-md border px-1.5 py-0.5 text-xs font-bold",
        rarityStyles[rarity] ?? "border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      {rarity}
    </span>
  );
}
