export const scenarioKeys = {
  all: ["scenarios"] as const,
  lists: () => [...scenarioKeys.all, "list"] as const,
  details: () => [...scenarioKeys.all, "detail"] as const,
  detail: (scenarioId: string) =>
    [...scenarioKeys.details(), scenarioId] as const,
  page: (scenarioId: string) =>
    [...scenarioKeys.details(), scenarioId, "page"] as const,
  previewById: (scenarioId: string) =>
    [...scenarioKeys.details(), scenarioId, "preview"] as const,
  related: (scenarioId: string) =>
    [...scenarioKeys.details(), scenarioId, "related"] as const,
  actors: (scenarioId: string) =>
    [...scenarioKeys.details(), scenarioId, "actors"] as const,
  actor: (scenarioId: string, actorProfileId: string) =>
    [...scenarioKeys.actors(scenarioId), actorProfileId] as const,
  likes: (scenarioId: string) =>
    [...scenarioKeys.details(), scenarioId, "likes"] as const,
  saves: (scenarioId: string) =>
    [...scenarioKeys.details(), scenarioId, "saves"] as const,
  userSaved: (userId: string) =>
    [...scenarioKeys.all, "user", userId, "saved"] as const,
  userCreated: (userId: string) =>
    [...scenarioKeys.all, "user", userId, "created"] as const,
};

export const encounterKeys = {
  all: ["encounters"] as const,
  listByUserId: (userId: string) =>
    [...encounterKeys.all, "list", userId] as const,
  page: (encounterId: string) =>
    [...encounterKeys.details(), encounterId, "page"] as const,
  lists: () => [...encounterKeys.all, "list"] as const,
  details: () => [...encounterKeys.all, "detail"] as const,
  detail: (encounterId: string) =>
    [...encounterKeys.details(), encounterId] as const,
  results: (encounterId: string) =>
    [...encounterKeys.details(), encounterId, "results"] as const,
};

export const domainKeys = {
  all: ["domains"] as const,
  lists: () => [...domainKeys.all, "list"] as const,
  details: () => [...domainKeys.all, "detail"] as const,
  detail: (slug: string) => [...domainKeys.details(), slug] as const,
  page: (slug: string) => [...domainKeys.all, "page", slug] as const,
};

export const profileKeys = {
  all: ["profiles"] as const,
  lists: () => [...profileKeys.all, "list"] as const,
  details: () => [...profileKeys.all, "detail"] as const,
  detail: (profileId: string, shape: "base" | "detail" | "card" = "base") =>
    [...profileKeys.details(), profileId, shape] as const,
  detailByUsername: (username: string) =>
    [...profileKeys.details(), username, "detail"] as const,
};

export const actorKeys = {
  all: ["actors"] as const,
  lists: () => [...actorKeys.all, "list"] as const,
  details: () => [...actorKeys.all, "detail"] as const,
  detail: (actorId: string) => [...actorKeys.details(), actorId] as const,
};

export const searchKeys = {
  all: ["search"] as const,
  page: (query: string) => [...searchKeys.all, query] as const,
};

export const homeKeys = {
  all: ["home"] as const,
  page: () => [...homeKeys.all, "page"] as const,
};

export const progressKeys = {
  all: ["progress"] as const,
  page: () => [...progressKeys.all, "page"] as const,
};

export const gamificationKeys = {
  all: ["gamification"] as const,
  summary: () => [...gamificationKeys.all, "summary"] as const,
};
