import { getAttributeLabel } from "@/shared/config";
import { cn, getAttributeStyle } from "@/shared/lib";

type AttributeBadgeProps = {
  attribute: string;
  className?: string;
};

export function AttributeBadge({ attribute, className }: AttributeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        getAttributeStyle(attribute),
        className,
      )}
    >
      {getAttributeLabel(attribute)}
    </span>
  );
}
