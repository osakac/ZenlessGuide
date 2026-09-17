"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

import { routes } from "@/shared/config";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/button";

import { isNavItemActive, navigation } from "./navigation";
import { ThemeToggle } from "./theme-toggle";

/**
 * Меню нужно только на узких экранах и только после клика, а Radix Dialog
 * с блокировкой скролла и ловушкой фокуса — самая тяжёлая часть шапки.
 * Поэтому модуль грузится отдельным чанком: заранее — при наведении, фокусе
 * или касании кнопки, в крайнем случае — по самому клику.
 */
const loadMobileMenu = () => import("./mobile-menu");

const MobileMenu = dynamic(
  () => loadMobileMenu().then((module) => module.MobileMenu),
  { ssr: false },
);

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Меню монтируется при первом открытии и дальше живёт, чтобы анимация
  // закрытия доигрывала, а выбранная сторона не перечитывалась.
  const [isMenuRequested, setIsMenuRequested] = useState(false);

  function openMenu() {
    setIsMenuRequested(true);
    setIsMenuOpen(true);
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:gap-6">
        <Link href={routes.home} className="font-semibold tracking-tight">
          Zenless<span className="text-primary">Guide</span>
        </Link>

        <nav className="hidden items-center gap-1 overflow-x-auto text-sm [scrollbar-width:none] sm:flex [&::-webkit-scrollbar]:hidden">
          {navigation.map((item) => {
            const active = isNavItemActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-2 py-1.5 whitespace-nowrap transition-colors hover:bg-muted sm:px-3",
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

        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon-sm"
            className="sm:hidden"
            onPointerEnter={loadMobileMenu}
            onPointerDown={loadMobileMenu}
            onFocus={loadMobileMenu}
            onClick={openMenu}
            aria-label="Открыть меню"
            aria-expanded={isMenuOpen}
          >
            <MenuIcon />
          </Button>

          {isMenuRequested ? (
            <MobileMenu open={isMenuOpen} onOpenChange={setIsMenuOpen} />
          ) : null}
        </div>
      </div>
    </header>
  );
}
