export type CharacterFilterState = {
  search: string;
  attribute: string | null;
  specialty: string | null;
  rarity: string | null;
};

export const emptyFilterState: CharacterFilterState = {
  search: "",
  attribute: null,
  specialty: null,
  rarity: null,
};
