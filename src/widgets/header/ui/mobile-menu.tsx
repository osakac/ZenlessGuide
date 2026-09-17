"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftIcon, PanelRightIcon } from "lucide-react";

import { cn } from "@/shared/lib";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";
import { Switch, SWITCH_TRANSITION_MS } from "@/shared/ui/switch";

import { isNavItemActive, navigation } from "./navigation";

type MenuSide = "left" | "right";

const MENU_SIDE_STORAGE_KEY = "zenless-guide:menu-side";

/**
 * Модуль грузится только на клиенте (`ssr: false` в site-header.tsx), но
 * проверка оставлена: инициализатор не должен падать, если это изменится.
 */
function readStoredMenuSide(): MenuSide {
  if (typeof window === "undefined") return "right";
  return window.localStorage.getItem(MENU_SIDE_STORAGE_KEY) === "left"
    ? "left"
    : "right";
}

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const pathname = usePathname();
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        ref={sheetContentRef}
        side={menuSide}
        className="w-3/4 max-w-xs"
      >
        <SheetTitle className="sr-only">Навигация</SheetTitle>

        <nav className="flex flex-col gap-1 px-4 pt-12">
          {navigation.map((item) => {
            const active = isNavItemActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                  active
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
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
  );
}
