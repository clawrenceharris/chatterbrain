import { AppErrorCode } from "@/types";

export type ActionError = {
  code: AppErrorCode;
  message: string;
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
