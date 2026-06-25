import { Prisma } from "@/lib/db/prisma";
import { AppErrorCode } from "@/types";
export class ApplicationError extends Error {
  constructor(
    public readonly details: {
      code: AppErrorCode;
      message?: string;
      field?: string;
      cause?: unknown;
    },
  ) {
    super(
      details.message ??
        errorMessages?.[details.code] ??
        errorMessages[AppErrorCode.UNKNOWN_ERROR],
    );
    this.name = "ApplicationError";
  }

  get code() {
    return this.details.code;
  }

  get field() {
    return this.details.field;
  }

  static unexpected(cause: unknown) {
    return new ApplicationError({
      code: AppErrorCode.UNKNOWN_ERROR,
      message: "Something went wrong. Please try again.",
      cause,
    });
  }
}

// Centralized error message mapping
export const errorMessages: Record<AppErrorCode, string> = {
  // Authentication
  [AppErrorCode.AUTH_INVALID_CREDENTIALS]:
    "That login didn’t work. Check your email and password.",
  [AppErrorCode.AUTH_USER_NOT_FOUND]:
    "We couldn’t find an account for that email.",
  [AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED]:
    "Please confirm your email before signing in.",
  [AppErrorCode.AUTH_PASSWORD_TOO_WEAK]:
    "That password is too weak. Try adding numbers and symbols.",
  [AppErrorCode.AUTH_EMAIL_ALREADY_EXISTS]:
    "Looks like this email already has an account. Try logging in instead.",
  [AppErrorCode.AUTH_SESSION_EXPIRED]:
    "Your session expired. Please sign in again.",
  [AppErrorCode.AUTH_RATE_LIMITED]:
    "Slow down a bit. We’re protecting the site.",
  [AppErrorCode.AUTH_UNAUTHENTICATED]: "You need to sign in before doing that.",
  [AppErrorCode.AUTH_PASSWORD_ALREADY_USED]:
    "This password looks familiar. Try using a different one.",
  [AppErrorCode.AUTH_PROVIDER_ERROR]: "Authentication failed.",
  [AppErrorCode.USERNAME_ALREADY_EXISTS]:
    "This username already exists. Try a different one.",

  // Authorization
  [AppErrorCode.PERMISSION_DENIED]: "You don’t have permission to do that.",

  // Validation
  [AppErrorCode.VALIDATION_FAILED]:
    "Something didn’t look right. Please check your input.",
  [AppErrorCode.FILE_TOO_LARGE]: "That file is too large. Try a smaller one.",

  // Network
  [AppErrorCode.NETWORK_OFFLINE]:
    "No internet detected. Please check your connection.",
  [AppErrorCode.NETWORK_TIMEOUT]:
    "That request took too long. Please try again.",
  [AppErrorCode.NETWORK_SERVER_ERROR]:
    "Something broke on the server. Our team is looking at it.",
  [AppErrorCode.RATE_LIMITED]:
    "Too many requests. Please wait a moment and try again.",

  // Database
  [AppErrorCode.DATABASE_ERROR]:
    "Something went wrong on our side. Please try again in a moment.",
  [AppErrorCode.RESOURCE_ALREADY_EXISTS]:
    "That item already exists or can’t be updated right now.",
  [AppErrorCode.RESOURCE_NOT_FOUND]:
    "We couldn’t find what you were looking for.",

  // External
  [AppErrorCode.EXTERNAL_SERVICE_ERROR]:
    "A service we depend on failed. Please try again soon.",

  // Generic
  [AppErrorCode.UNKNOWN_ERROR]:
    "Something went wrong on our side. Please stand by while we fix it.",
  [AppErrorCode.NOTEBOOK_TIMEOUT]:
    "That notebook took too long to load. Please try again.",
  [AppErrorCode.INTERNAL_SERVER_ERROR]:
    "Something went wrong on our side. Please try again in a moment.",
};

export function getUserErrorMessage(error: unknown): string {
  const normalizedError = normalizeError(error);
  if (normalizedError instanceof ApplicationError) {
    return normalizedError.message;
  }
  return errorMessages[AppErrorCode.UNKNOWN_ERROR];
}

function isPrismaKnownRequestError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "meta" in error &&
    (error as { name?: string }).name === "PrismaClientKnownRequestError"
  );
}

export function isSupabaseError(error: unknown): error is {
  message: string;
  status?: number;
  code?: string;
  details?: string;
} {
  return (
    typeof error === "object" &&
    error !== null &&
    !(error instanceof Error) &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
}

function normalizePrismaError(
  error: Prisma.PrismaClientKnownRequestError,
): ApplicationError {
  const normalizedMessage = error.message?.toLowerCase() ?? "";

  if (error.code === "P2002") {
    return new ApplicationError({ code: AppErrorCode.RESOURCE_ALREADY_EXISTS });
  }

  if (error.code === "P2025") {
    return new ApplicationError({ code: AppErrorCode.RESOURCE_NOT_FOUND });
  }

  if (error.code === "P2003") {
    return new ApplicationError({ code: AppErrorCode.DATABASE_ERROR });
  }

  if (error.code === "P2004" || error.code === "P5034") {
    return new ApplicationError({ code: AppErrorCode.DATABASE_ERROR });
  }

  if (
    normalizedMessage.includes("unique constraint") ||
    normalizedMessage.includes("duplicate")
  ) {
    return new ApplicationError({ code: AppErrorCode.RESOURCE_ALREADY_EXISTS });
  }

  return new ApplicationError({ code: AppErrorCode.DATABASE_ERROR });
}

function normalizeSupabaseError(error: {
  message: string;
  status?: number;
  code?: string;
  details?: string;
}): ApplicationError {
  const normalizedMessage = error.message.toLowerCase();

  if (normalizedMessage.includes("invalid login credentials")) {
    return new ApplicationError({
      code: AppErrorCode.AUTH_INVALID_CREDENTIALS,
    });
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return new ApplicationError({
      code: AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED,
    });
  }

  if (normalizedMessage.includes("user already registered")) {
    return new ApplicationError({
      code: AppErrorCode.AUTH_EMAIL_ALREADY_EXISTS,
    });
  }

  if (
    normalizedMessage.includes("forbidden") ||
    normalizedMessage.includes("permission denied")
  ) {
    return new ApplicationError({ code: AppErrorCode.PERMISSION_DENIED });
  }

  if (normalizedMessage.includes("not found") || error.status === 404) {
    return new ApplicationError({ code: AppErrorCode.RESOURCE_NOT_FOUND });
  }

  if (
    normalizedMessage.includes("body size limit") ||
    normalizedMessage.includes("payload too large") ||
    error.status === 413
  ) {
    return new ApplicationError({ code: AppErrorCode.FILE_TOO_LARGE });
  }

  if (
    error.status === 401 ||
    normalizedMessage.includes("unauthorized") ||
    normalizedMessage.includes("invalid token")
  ) {
    return new ApplicationError({ code: AppErrorCode.AUTH_UNAUTHENTICATED });
  }

  if (error.status === 429 || normalizedMessage.includes("rate limit")) {
    return new ApplicationError({ code: AppErrorCode.RATE_LIMITED });
  }

  if (error.status && error.status >= 500) {
    return new ApplicationError({ code: AppErrorCode.EXTERNAL_SERVICE_ERROR });
  }

  return new ApplicationError({ code: AppErrorCode.UNKNOWN_ERROR });
}

export function normalizeError(error: unknown): ApplicationError {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    "message" in error
  ) {
    if (
      Object.values(AppErrorCode).includes(
        (error as { code: string }).code as AppErrorCode,
      )
    ) {
      return new ApplicationError({
        code: error.code as AppErrorCode,
        message: error.message as string,
      });
    }
  }

  if (isPrismaKnownRequestError(error)) {
    return normalizePrismaError(error);
  }

  if (isSupabaseError(error)) {
    return normalizeSupabaseError(error);
  }

  // Network/fetch errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return new ApplicationError({ code: AppErrorCode.NETWORK_OFFLINE });
  }

  if (error instanceof Error) {
    return new ApplicationError({ code: AppErrorCode.UNKNOWN_ERROR });
  }

  return new ApplicationError({ code: AppErrorCode.UNKNOWN_ERROR });
}

// Central error logging
export function logError(
  error: ApplicationError,
  context?: Record<string, any>,
) {
  const errorLog = {
    code: error.code,
    message: error.message,
    context,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : "server",
    url: typeof window !== "undefined" ? window.location.href : "server",
  };

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("App Error:", errorLog);
  }
  //Production logic will be under here
}
