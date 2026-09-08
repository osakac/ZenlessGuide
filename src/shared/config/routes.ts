/**
 * Откуда пришли на страницу агента: кнопка возврата ведёт обратно туда же.
 * Источник хранится в query-параметре, а не в истории браузера, — так ссылку
 * можно переслать, и она ведёт себя одинаково при открытии в новой вкладке.
 */
export const backSources = ["tierlist", "characters"] as const;

export type BackSource = (typeof backSources)[number];

export const backParam = "from";

export const isBackSource = (value: unknown): value is BackSource =>
  backSources.includes(value as BackSource);

export const routes = {
  home: "/",
  tierlist: "/tierlist",
  characters: "/characters",
  character: (slug: string, from?: BackSource) =>
    from
      ? `/characters/${slug}?${backParam}=${from}`
      : `/characters/${slug}`,
} as const;
