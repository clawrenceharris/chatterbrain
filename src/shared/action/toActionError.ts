import { ApplicationError } from "@/shared/utils/errors";
import { ActionError } from "./ActionError";

export function toActionError(error: ApplicationError): ActionError {
  return {
    code: error.code,
    message: error.message,
    field: error.field,
  };
}
