import Image from "next/image";

import { getAttributeIcon, getAttributeLabel } from "@/shared/config";
import { cn, getAttributeBorderStyle } from "@/shared/lib";

type AttributeIconBadgeProps = {
  attribute: string;
  className?: string;
};

/**
 * Компактный бейдж атрибута — только иконка, без подписи. Оверлей на портрете.
 * Лежит в shared, а не в entities/character, — тот же оверлей нужен и портрету
 * участника состава в entities/team, а слои entities друг у друга не импортируют.
 */
export function AttributeIconBadge({
  attribute,
  className,
}: AttributeIconBadgeProps) {
  const icon = getAttributeIcon(attribute);
  if (!icon) return null;

  return (
    <span
      title={getAttributeLabel(attribute)}
      className={cn(
        "flex size-7 items-center justify-center rounded-full border bg-black/55 backdrop-blur-sm",
        getAttributeBorderStyle(attribute),
        className,
      )}
    >
      <Image
        src={icon}
        alt={getAttributeLabel(attribute)}
        width={16}
        height={16}
        unoptimized
        className="size-4 object-contain"
      />
    </span>
  );
}
