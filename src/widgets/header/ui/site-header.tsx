"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, PanelLeftIcon, PanelRightIcon } from "lucide-react";

import { routes } from "@/shared/config";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";
import { Switch, SWITCH_TRANSITION_MS } from "@/shared/ui/switch";

import { ThemeToggle } from "./theme-toggle";

const navigation = [
  { href: routes.home, label: "Главная" },
  { href: routes.tierlist, label: "Тир-лист" },
  { href: routes.characters, label: "Агенты" },
  { href: routes.teams, label: "Команды" },
];

type MenuSide = "left" | "right";

const MENU_SIDE_STORAGE_KEY = "zenless-guide:menu-side";

/** На сервере localStorage недоступен — там сторона всегда «справа» (дефолт). */
function readStoredMenuSide(): MenuSide {
  if (typeof window === "undefined") return "right";
  return window.localStorage.getItem(MENU_SIDE_STORAGE_KEY) === "left"
    ? "left"
    : "right";
}

function useIsActive(pathname: string) {
  return (href: string) =>
    href === routes.home ? pathname === href : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const isActive = useIsActive(pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuSide, setMenuSide] = useState<MenuSide>(readStoredMenuSide);
  // Выбранная, но ещё не применённая сторона: свитч и иконки сначала
  // доезжают по ней, и только потом меню переезжает — иначе панель
  // перескакивала на другой край посреди анимации бегунка.
  const [pendingSide, setPendingSide] = useState<MenuSide | null>(null);
  const shownSide = pendingSide ?? menuSide;
  const sideTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const sheetContentRef = useRef<HTMLDivElement>(null);
  const shouldAnimateSideRef = useRef(false);

  useEffect(() => () => clearTimeout(sideTimeoutRef.current), []);

  // Смена `side` переставляет панель к другому краю мгновенно (left/right
  // не анимируются), поэтому на новом месте она коротко въезжает от края —
  // так же, как при открытии. Только после переключения пользователем,
  // не при открытии меню.
  useEffect(() => {
    if (!shouldAnimateSideRef.current) return;
    shouldAnimateSideRef.current = false;
    sheetContentRef.current?.animate(
      [
        {
          opacity: 0,
          transform: `translateX(${menuSide === "left" ? "-2.5rem" : "2.5rem"})`,
        },
        { opacity: 1, transform: "translateX(0)" },
      ],
      { duration: 200, easing: "ease-out" },
    );
  }, [menuSide]);

  function handleMenuSideChange(next: MenuSide) {
    setPendingSide(next);
    clearTimeout(sideTimeoutRef.current);
    sideTimeoutRef.current = setTimeout(() => {
      shouldAnimateSideRef.current = next !== menuSide;
      setMenuSide(next);
      setPendingSide(null);
      window.localStorage.setItem(MENU_SIDE_STORAGE_KEY, next);
    }, SWITCH_TRANSITION_MS);
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:gap-6">
        <Link href={routes.home} className="font-semibold tracking-tight">
          Zenless<span className="text-primary">Guide</span>
        </Link>

        <nav className="hidden items-center gap-1 overflow-x-auto text-sm [scrollbar-width:none] sm:flex [&::-webkit-scrollbar]:hidden">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-2 py-1.5 whitespace-nowrap transition-colors hover:bg-muted sm:px-3",
                isActive(item.href)
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <Button
              variant="ghost"
              size="icon-sm"
              className="sm:hidden"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Открыть меню"
            >
              <MenuIcon />
            </Button>

            <SheetContent
              ref={sheetContentRef}
              side={menuSide}
              className="w-3/4 max-w-xs"
            >
              <SheetTitle className="sr-only">Навигация</SheetTitle>

              <nav className="flex flex-col gap-1 px-4 pt-12">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                      isActive(item.href)
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div
                className={cn(
                  "mt-auto flex flex-col gap-1.5 border-t px-4 py-4",
                  menuSide === "right" ? "items-end" : "items-start",
                )}
              >
                <span className="text-xs font-medium text-muted-foreground">
                  Сторона меню
                </span>
                {/* Не `<label>`: см. комментарий в theme-toggle.tsx про двойной клик по `Switch`. */}
                <div className="flex items-center gap-2">
                  <PanelLeftIcon
                    className={cn(
                      "size-4 transition-colors duration-300",
                      shownSide === "left" ? "text-foreground" : "text-muted-foreground",
                    )}
                  />
                  <Switch
                    checked={shownSide === "right"}
                    onCheckedChange={(checked) =>
                      handleMenuSideChange(checked ? "right" : "left")
                    }
                    aria-label="Сторона меню"
                  />
                  <PanelRightIcon
                    className={cn(
                      "size-4 transition-colors duration-300",
                      shownSide === "right" ? "text-foreground" : "text-muted-foreground",
                    )}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
