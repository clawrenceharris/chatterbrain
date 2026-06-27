export type SearchResultItem = {
  id: string;
  label: string;
  type: SearchType;
};

export type SearchType = "scenarios" | "actors" | "users" | "saved" | "all";
