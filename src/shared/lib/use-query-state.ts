"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Состояние страницы в query-параметрах: ссылку с ним можно скопировать
 * и переслать, а кнопка «назад» работает штатно.
 *
 * `fields` сопоставляет поле состояния с именем параметра и должен быть
 * константой модуля — иначе значения пересчитываются на каждый рендер.
 * Значение пишется в URL как есть, без trim: поле ввода читает его обратно
 * из URL, и обрезка съедала бы пробел между словами прямо во время набора.
 * Пустая строка или строка из пробелов параметр удаляет.
 *
 * Не реэкспортируется из `shared/lib/index.ts`: этот barrel импортируют
 * серверные компоненты (ради `cn`), а `next/navigation`-хуки в их граф
 * попадать не должны — сборка падает. Импорт: `@/shared/lib/use-query-state`.
 */
export function useQueryState<F extends string>(fields: Record<F, string>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const values = useMemo(
    () =>
      Object.fromEntries(
        Object.entries<string>(fields).map(([field, key]) => [
          field,
          searchParams.get(key),
        ]),
      ) as Record<F, string | null>,
    [fields, searchParams],
  );

  const replace = useCallback(
    (params: URLSearchParams) => {
      const query = params.toString();
      router.replace(query ? `?${query}` : "?", { scroll: false });
    },
    [router],
  );

  const set = useCallback(
    (next: Partial<Record<F, string | null>>) => {
      const params = new URLSearchParams(searchParams);

      for (const [field, value] of Object.entries<string | null | undefined>(next)) {
        const key = fields[field as F];
        if (value?.trim()) params.set(key, value);
        else params.delete(key);
      }

      replace(params);
    },
    [fields, replace, searchParams],
  );

  const reset = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    for (const key of Object.values<string>(fields)) params.delete(key);
    replace(params);
  }, [fields, replace, searchParams]);

  return { values, set, reset };
}
