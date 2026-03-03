type ErrorStructureType = { code: string; httpCode: number; message: string };

export class ErrorCodes {
  public static readonly EMPTY_RESPONSE: ErrorStructureType = {
    code: "EMPTY_RESPONSE",
    httpCode: 400,
    message: "Empty response",
  };

  public static readonly HTTP_ERROR: ErrorStructureType = {
    code: "HTTP_ERROR",
    httpCode: 500,
    message: "HTTP error",
  };

  public static readonly VALIDATION_FAILED: ErrorStructureType = {
    code: "VALIDATION_FAILED",
    httpCode: 400,
    message: "Validation failed",
  };

  public static readonly DUPLICATE_ENTRY: ErrorStructureType = {
    code: "DUPLICATE_ENTRY",
    httpCode: 409,
    message: "A record with this information already exists",
  };

  public static readonly FORBIDDEN: ErrorStructureType = {
    code: "FORBIDDEN",
    httpCode: 403,
    message: "Forbidden",
  };

  public static readonly NO_VALID_SESSION: ErrorStructureType = {
    code: "NO_VALID_SESSION",
    httpCode: 403,
    message: "No valid session",
  };

  public static readonly NO_SELECTED_ACCOUNT: ErrorStructureType = {
    code: "NO_SELECTED_ACCOUNT",
    httpCode: 404,
    message: "No selected account",
  };

  public static readonly NOT_FOUND: ErrorStructureType = {
    code: "NOT_FOUND",
    httpCode: 404,
    message: "Not found",
  };

  public static readonly NOT_IMPLEMENTED: ErrorStructureType = {
    code: "NOT_IMPLEMENTED",
    httpCode: 500,
    message: "Not implemented",
  };

  public static readonly INVALID_INSTANCE: ErrorStructureType = {
    code: "INVALID_INSTANCE",
    httpCode: 500,
    message: "Invalid instance",
  };

  public static readonly RESOURCE_EXPIRED: ErrorStructureType = {
    code: "RESOURCE_EXPIRED",
    httpCode: 400,
    message: "Resource expired",
  };

  public static readonly UNKNOWN: ErrorStructureType = {
    code: "UNKNOWN",
    httpCode: 500,
    message: "Unknown error",
  };

  public static find(code: string): ErrorStructureType | undefined {
    return Object.values(ErrorCodes).find((error) => error.code === code);
  }
}

export class ServerError extends Error {
  public code: string;
  public httpCode: number;
  public message: string;
  public details: Record<string, any>;

  constructor(code: ErrorStructureType, details?: Record<string, any>) {
    super(code.message);
    this.code = code.code;
    this.httpCode = code.httpCode;
    this.message = details?.message ?? code.message;
    this.details = Object.assign({}, { code: code.code, message: code.message }, details);
  }
}
