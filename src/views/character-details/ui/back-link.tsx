"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { backParam, isBackSource, routes } from "@/shared/config";

const targets = {
  tierlist: { href: routes.tierlist, label: "Вернуться в тир-лист" },
  characters: { href: routes.characters, label: "Все агенты" },
} as const;

function BackLinkView({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-primary"
    >
      <ChevronLeft className="size-4" />
      {label}
    </Link>
  );
}

/**
 * Пока параметр не прочитан (статический HTML до гидратации) показываем
 * возврат к списку агентов — он же и остаётся, если пришли не из тир-листа.
 */
export function BackLinkFallback() {
  return <BackLinkView {...targets.characters} />;
}

export function BackLink() {
  const source = useSearchParams().get(backParam);

  return (
    <BackLinkView
      {...(isBackSource(source) ? targets[source] : targets.characters)}
    />
  );
}
