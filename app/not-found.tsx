import Link from "next/link";

import { routes } from "@/shared/config";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-4 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">
        Страница не найдена
      </h1>
      <p className="text-muted-foreground">
        Возможно, агента ещё нет в базе или ссылка устарела.
      </p>
      <Link
        href={routes.characters}
        className="rounded-lg border px-4 py-2 text-sm transition-colors hover:border-primary/60 hover:text-primary"
      >
        К списку агентов
      </Link>
    </div>
  );
}
