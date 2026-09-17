"use client";

import { useSearchParams } from "next/navigation";
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
 * Запись — через `window.history.replaceState`, а не `router.replace`:
 * фильтрация целиком клиентская, серверу новые параметры не нужны, а навигация
 * роутера на каждое нажатие клавиши шла переходом с запросом RSC. Next.js
 * встраивает нативный History API в роутер, так что `useSearchParams`
 * обновляется так же. Текущие параметры читаются из `location` в момент
 * вызова, поэтому `set` и `reset` не пересоздаются при каждом изменении URL.
 *
 * Не реэкспортируется из `shared/lib/index.ts`: этот barrel импортируют
 * серверные компоненты (ради `cn`), а `next/navigation`-хуки в их граф
 * попадать не должны — сборка падает. Импорт: `@/shared/lib/use-query-state`.
 */
export function useQueryState<F extends string>(fields: Record<F, string>) {
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

  const update = useCallback((apply: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(window.location.search);
    apply(params);

    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
  }, []);

  const set = useCallback(
    (next: Partial<Record<F, string | null>>) =>
      update((params) => {
        for (const [field, value] of Object.entries<string | null | undefined>(next)) {
          const key = fields[field as F];
          if (value?.trim()) params.set(key, value);
          else params.delete(key);
        }
      }),
    [fields, update],
  );

  const reset = useCallback(
    () =>
      update((params) => {
        for (const key of Object.values<string>(fields)) params.delete(key);
      }),
    [fields, update],
  );

  return { values, set, reset };
}
