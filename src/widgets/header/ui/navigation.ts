import { routes } from "@/shared/config";

export const navigation = [
  { href: routes.home, label: "Главная" },
  { href: routes.tierlist, label: "Тир-лист" },
  { href: routes.characters, label: "Агенты" },
  { href: routes.teams, label: "Команды" },
];

export function isNavItemActive(pathname: string, href: string) {
  return href === routes.home ? pathname === href : pathname.startsWith(href);
}
