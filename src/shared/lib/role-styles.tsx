import type { ReactNode } from "react";
import { FlaskConical, Ghost, HandFist, type LucideIcon } from "lucide-react";

/**
 * Иконки и цвета ролей — общие для колонок тир-листа и бейджа состава на
 * карточке команды. Позаимствованы у тир-листа prydwen.gg (Crit DPS /
 * Anomaly DPS / Support), чтобы категории считывались привычно тем, кто уже
 * пользовался их тир-листом. Лежат в shared, а не в entities/tier, — их
 * использует и entities/team, а слои entities не импортируют друг друга.
 */
const roleIcons: Record<string, LucideIcon> = {
  "pure-dps": HandFist,
  "anomaly-dps": Ghost,
  support: FlaskConical,
};

const roleTextColors: Record<string, string> = {
  "pure-dps": "text-role-pure-dps",
  "anomaly-dps": "text-role-anomaly-dps",
  support: "text-role-support",
};

const roleBadgeStyles: Record<string, string> = {
  "pure-dps": "border-role-pure-dps/40 bg-role-pure-dps/15 text-role-pure-dps",
  "anomaly-dps":
    "border-role-anomaly-dps/40 bg-role-anomaly-dps/15 text-role-anomaly-dps",
  support: "border-role-support/40 bg-role-support/15 text-role-support",
};

/** Та же палитра, что и у бейджа, но применяется только к выбранной кнопке тоггла. */
const roleToggleStyles: Record<string, string> = {
  "pure-dps":
    "data-[state=on]:border-role-pure-dps/40 data-[state=on]:bg-role-pure-dps/15 data-[state=on]:text-role-pure-dps data-[state=on]:hover:bg-role-pure-dps/20",
  "anomaly-dps":
    "data-[state=on]:border-role-anomaly-dps/40 data-[state=on]:bg-role-anomaly-dps/15 data-[state=on]:text-role-anomaly-dps data-[state=on]:hover:bg-role-anomaly-dps/20",
  support:
    "data-[state=on]:border-role-support/40 data-[state=on]:bg-role-support/15 data-[state=on]:text-role-support data-[state=on]:hover:bg-role-support/20",
};

export function getRoleIcon(role: string): LucideIcon | undefined {
  return roleIcons[role];
}

/**
 * Рисует иконку роли готовым узлом, а не отдаёт компонент вызывающей
 * стороне: если рендерить `<Icon />` из переменной, вычисленной прямо в теле
 * компонента, react-hooks/static-components ругается на «создание компонента
 * во время рендера» (Icon в её глазах не отличить от нестабильной фабрики).
 * Функция ниже — не компонент, и это её и не касается.
 */
export function renderRoleIcon(role: string, className?: string): ReactNode {
  const Icon = roleIcons[role];
  return Icon ? <Icon className={className} aria-hidden /> : null;
}

export function getRoleTextColor(role: string): string {
  return roleTextColors[role] ?? "text-foreground";
}

export function getRoleBadgeStyle(role: string): string {
  return roleBadgeStyles[role] ?? "border-border bg-muted text-muted-foreground";
}

export function getRoleToggleStyle(role: string): string {
  return roleToggleStyles[role] ?? "";
}
