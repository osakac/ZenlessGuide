export const routes = {
  home: "/",
  tierlist: "/tierlist",
  characters: "/characters",
  character: (slug: string) => `/characters/${slug}`,
} as const;
