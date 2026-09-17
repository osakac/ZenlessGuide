"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

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
 * Чтение — через `useSyncExternalStore` из `location.search`, а не через
 * `useSearchParams`: на статической странице тот переводит всё до ближайшего
 * `<Suspense>` в рендер только на клиенте, и в HTML списков вместо карточек
 * оказывался скелетон. Серверный снимок — пустая строка: сервер и гидратация
 * рисуют список без фильтров, а параметры из URL применяются сразу после.
 *
 * Запись — через `window.history.replaceState`, а не `router.replace`:
 * фильтрация целиком клиентская, серверу новые параметры не нужны, а навигация
 * роутера на каждое нажатие клавиши шла переходом с запросом RSC. Об изменении
 * подписчики узнают из собственного события: `replaceState` событий не шлёт.
 * Текущие параметры читаются из `location` в момент вызова, поэтому `set`
 * и `reset` не пересоздаются при каждом изменении URL.
 *
 * Не реэкспортируется из `shared/lib/index.ts`: этот barrel импортируют
 * серверные компоненты (ради `cn`), а клиентский модуль с хуком в их графе
 * не нужен. Импорт: `@/shared/lib/use-query-state`.
 */

const QUERY_CHANGE_EVENT = "zenless-guide:querychange";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(QUERY_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(QUERY_CHANGE_EVENT, onChange);
  };
}

const getSnapshot = () => window.location.search;
const getServerSnapshot = () => "";

export function useQueryState<F extends string>(fields: Record<F, string>) {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const values = useMemo(() => {
    const searchParams = new URLSearchParams(search);
    return Object.fromEntries(
      Object.entries<string>(fields).map(([field, key]) => [
        field,
        searchParams.get(key),
      ]),
    ) as Record<F, string | null>;
  }, [fields, search]);

  const update = useCallback((apply: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(window.location.search);
    apply(params);

    const query = params.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
    window.dispatchEvent(new Event(QUERY_CHANGE_EVENT));
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
