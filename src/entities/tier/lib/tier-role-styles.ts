import { FlaskConical, Ghost, HandFist, type LucideIcon } from "lucide-react";

/**
 * Иконки и цвета ролей позаимствованы у тир-листа prydwen.gg (Crit DPS /
 * Anomaly DPS / Support), чтобы категории считывались привычно тем, кто уже
 * пользовался их тир-листом.
 */
const roleIcons: Record<string, LucideIcon> = {
  "pure-dps": HandFist,
  "anomaly-dps": Ghost,
  support: FlaskConical,
};

const roleColors: Record<string, string> = {
  "pure-dps": "text-role-pure-dps",
  "anomaly-dps": "text-role-anomaly-dps",
  support: "text-role-support",
};

export function getTierRoleIcon(role: string): LucideIcon | undefined {
  return roleIcons[role];
}

export function getTierRoleColor(role: string): string {
  return roleColors[role] ?? "text-foreground";
}
