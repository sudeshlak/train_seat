import axios from "axios";

export enum ErrorType {
  UNAUTHENTICATED = "UNAUTHENTICATED", // 400 - redirect to login
  VALIDATION = "VALIDATION", // show in form
  NETWORK = "NETWORK", // popup with retry
  SERVER = "SERVER", // popup with retry
  UNKNOWN = "UNKNOWN", // popup with retry
}

export interface ApiError {
  type: ErrorType;
  message: string;
  statusCode?: number;
}

export function getApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;
    const message = error.response?.data?.message ?? "Something went wrong";

    // Categorize errors based on status code
    if (statusCode === 401 || statusCode === 400) {
      return {
        type: ErrorType.UNAUTHENTICATED,
        message,
        statusCode,
      };
    }

    if (statusCode === 422 || statusCode === 400) {
      // Validation errors often come as 422 or 400 with field-specific messages
      if (error.response?.data?.errors) {
        return {
          type: ErrorType.VALIDATION,
          message,
          statusCode,
        };
      }
    }

    if (statusCode && statusCode >= 500) {
      return {
        type: ErrorType.SERVER,
        message,
        statusCode,
      };
    }

    if (!error.response) {
      // Network error (no response)
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
