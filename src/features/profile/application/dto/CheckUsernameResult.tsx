import { InvalidUsernameReason } from "../../domain/value-objects";

export type CheckUsernameResult =
  | {
      isValid: true;
    }
  | { isValid: false; reason: InvalidUsernameReason; message: string };
