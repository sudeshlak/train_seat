import axios from "axios";

export enum ErrorType {
  UNAUTHENTICATED = "UNAUTHENTICATED",
  VALIDATION = "VALIDATION",
  CONFLICT = "CONFLICT",
  NETWORK = "NETWORK",
  SERVER = "SERVER",
  UNKNOWN = "UNKNOWN",
}

export interface ApiError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  details?: Record<string, string>;
}

function isDetailsMap(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  return Object.values(value).every((entry) => typeof entry === "string");
}

export function getApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;
    const data = error.response?.data as
      | { message?: string; details?: unknown }
      | undefined;
    const message = data?.message ?? "Something went wrong";
    const details = isDetailsMap(data?.details) ? data.details : undefined;

    if (statusCode === 401) {
      return {
        type: ErrorType.UNAUTHENTICATED,
        message,
        statusCode,
      };
    }

    if (statusCode === 400 || statusCode === 422) {
      return {
        type: ErrorType.VALIDATION,
        message,
        statusCode,
        details,
      };
    }

    if (statusCode === 409) {
      return {
        type: ErrorType.CONFLICT,
        message,
        statusCode,
      };
    }

    if (statusCode && statusCode >= 500) {
      return {
        type: ErrorType.SERVER,
        message,
        statusCode,
      };
    }

    if (!error.response) {
      return {
        type: ErrorType.NETWORK,
        message: "Network error. Please check your connection.",
      };
    }

    return {
      type: ErrorType.UNKNOWN,
      message,
      statusCode,
    };
  }

  return {
    type: ErrorType.UNKNOWN,
    message: "Unexpected error occurred",
  };
}

export function getApiErrorMessage(error: unknown): string {
  return getApiError(error).message;
}
