import { AppErrorCode } from "@/types";

export type ActionError = {
  code: AppErrorCode;
  message: string;
  cause?: unknown;
  field?: string;
};

export type ActionResult<TData> =
  | {
      success: true;
      data: TData;
    }
  | {
      success: false;
      error: ActionError;
    };
