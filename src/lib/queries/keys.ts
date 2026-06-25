export const profileKeys = {
  all: ["profiles"] as const,
  lists: () => [...profileKeys.all, "list"] as const,
  details: () => [...profileKeys.all, "detail"] as const,
  detail: (profileId: string, shape: "base" | "detail" | "card" = "base") =>
    [...profileKeys.details(), profileId, shape] as const,
};
