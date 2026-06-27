import { SearchType } from "../value-objects";

export type SaveSearchCommand = {
  query: string;
  type: SearchType;
};
