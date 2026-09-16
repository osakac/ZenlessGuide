import type { ReactNode } from "react";

import { cn } from "@/shared/lib";

/** Заглушка на месте пустого списка: «ничего не найдено», «гайда ещё нет». */
export function EmptyState({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
