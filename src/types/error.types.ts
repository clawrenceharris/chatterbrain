// Error severity levels
export enum ErrorSeverity {
  LOW = "low", // Non-critical, user can continue
  MEDIUM = "medium", // Important but recoverable
  HIGH = "high", // Critical, blocks user flow
  CRITICAL = "critical", // System failure, requires immediate attention
}

// Error categories for better organization
export enum ErrorCategory {
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  VALIDATION = "validation",
  NETWORK = "network",
  DATABASE = "database",
  EXTERNAL_API = "external_api",
  BUSINESS_LOGIC = "business_logic",
  SYSTEM = "system",
}

// Centralized error codes with user-friendly messages
export enum AppErrorCode {
  // Authentication Errors
  AUTH_INVALID_CREDENTIALS = "auth_invalid_credentials",
  AUTH_USER_NOT_FOUND = "auth_user_not_found",
  AUTH_EMAIL_NOT_CONFIRMED = "auth_email_not_confirmed",
  AUTH_PASSWORD_TOO_WEAK = "auth_password_too_weak",
  AUTH_EMAIL_ALREADY_EXISTS = "auth_email_already_exists",
  AUTH_SESSION_EXPIRED = "auth_session_expired",
  AUTH_RATE_LIMITED = "auth_rate_limited",
  AUTH_UNAUTHENTICATED = "auth_unauthenticated",
  AUTH_PASSWORD_ALREADY_USED = "auth_password_already_used",

  // Authorization Errors
  PERMISSION_DENIED = "permission_denied",

  // Validation Errors
  VALIDATION_FAILED = "validation_failed",
  FILE_TOO_LARGE = "file_too_large",

  // Network Errors
  NETWORK_OFFLINE = "network_offline",
  NETWORK_TIMEOUT = "network_timeout",
  NETWORK_SERVER_ERROR = "network_server_error",
  RATE_LIMITED = "rate_limited",

  // Database Errors
  DATABASE_ERROR = "database_error",
  RESOURCE_ALREADY_EXISTS = "resource_already_exists",
  RESOURCE_NOT_FOUND = "resource_not_found",

  // External Errors
  EXTERNAL_SERVICE_ERROR = "external_service_error",

  // Generic Errors
  UNKNOWN_ERROR = "unknown_error",
  AUTH_PROVIDER_ERROR = "auth_provider_error",
  USERNAME_ALREADY_EXISTS = "username_already_exists",
  NOTEBOOK_TIMEOUT = "notebook_timeout",
  INTERNAL_SERVER_ERROR = "internal_server_error",
}
