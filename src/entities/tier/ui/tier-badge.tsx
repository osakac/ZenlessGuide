import { cn } from "@/shared/lib";

import { getTierStyle } from "../lib/tier-styles";

type TierBadgeProps = {
  tierId: string;
  label?: string;
  size?: "sm" | "lg";
  className?: string;
};

export function TierBadge({
  tierId,
  label,
  size = "sm",
  className,
}: TierBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg border font-semibold tabular-nums",
        getTierStyle(tierId),
        size === "lg"
          ? "size-14 text-2xl"
          : "min-w-7 px-2 py-0.5 text-xs uppercase",
        className,
      )}
    >
      {label ?? tierId}
    </span>
  );
}
