import { ApplicationError } from "@/shared/utils/errors";

export type Result<TData, TError = ApplicationError> =
  | {
      success: true;
      data: TData;
    }
  | {
      success: false;
      error: TError;
    };

export function ok<TData>(data: TData): Result<TData, never> {
    return {
        success: true,
        data,
    };
}
    
export function fail<TError>(error: TError): Result<never, TError> {
    return {
        success: false,
        error,
    };
}