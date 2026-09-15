import type { TeamDamageType } from "@/entities/team";

export type TeamFilterState = {
  agentName: string;
  damageType: TeamDamageType | null;
};

export const emptyFilterState: TeamFilterState = {
  agentName: "",
  damageType: null,
};
