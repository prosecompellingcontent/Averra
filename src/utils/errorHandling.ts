/**
 * Global Error Handling Utilities
 * Provides consistent error messages and handling across the application
 */

export type ErrorType =
  | "auth"
  | "network"
  | "database"
  | "validation"
  | "subscription"
  | "verification"
  | "realtime"
  | "stripe"
  | "unknown";

export interface AppError {
  type: ErrorType;
  message: string;
  userMessage: string;
  originalError?: any;
  retryable: boolean;
  timestamp: Date;
}

/**
 * Creates a user-friendly error from any error type
 */
export function createAppError(
  error: any,
  type: ErrorType = "unknown",
  customMessage?: string
): AppError {
  const timestamp = new Date();

  // Handle Supabase errors
  if (error?.message) {
    const supabaseError = handleSupabaseError(error, type);
    if (supabaseError) return supabaseError;
  }

  // Handle fetch errors
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return {
      type: "network",
      message: "Network connection failed",
      userMessage: customMessage || "Unable to connect to the server. Please check your connection and try again.",
      originalError: error,
      retryable: true,
      timestamp,
    };
  }

  // Handle auth errors
  if (error?.name === "AuthApiError" || error?.status === 401) {
    return {
      type: "auth",
      message: error.message || "Authentication failed",
      userMessage: customMessage || "Your session has expired. Please log in again.",
      originalError: error,
      retryable: false,
      timestamp,
    };
  }

  // Generic error
  return {
    type,
    message: error?.message || String(error),
    userMessage: customMessage || "Something went wrong. Please try again.",
    originalError: error,
    retryable: false,
    timestamp,
  };
}

/**
 * Handle Supabase-specific errors
 */
function handleSupabaseError(error: any, type: ErrorType): AppError | null {
  const errorCode = error.code;
  const errorMessage = error.message?.toLowerCase() || "";
  const timestamp = new Date();

  // Authentication errors
  if (errorMessage.includes("invalid login credentials")) {
    return {
      type: "auth",
      message: "Invalid login credentials",
      userMessage: "The email or password you entered is incorrect. Please try again.",
      originalError: error,
      retryable: false,
      timestamp,
    };
  }

  if (errorMessage.includes("email not confirmed")) {
    return {
      type: "auth",
      message: "Email not confirmed",
      userMessage: "Please check your email and confirm your account before logging in.",
      originalError: error,
      retryable: false,
      timestamp,
    };
  }

  // Database errors
  if (errorCode === "PGRST116" || errorMessage.includes("row not found")) {
    return {
      type: "database",
      message: "Record not found",
      userMessage: type === "auth"
        ? "Unable to find your account. Please contact support."
        : "The requested data could not be found.",
      originalError: error,
      retryable: false,
      timestamp,
    };
  }

  // Duplicate key errors
  if (errorCode === "23505" || errorMessage.includes("duplicate key")) {
    return {
      type: "validation",
      message: "Duplicate record",
      userMessage: "This username or email is already taken. Please choose another.",
      originalError: error,
      retryable: false,
      timestamp,
    };
  }

  // Connection errors
  if (errorMessage.includes("connection") || errorMessage.includes("timeout")) {
    return {
      type: "network",
      message: "Connection error",
      userMessage: "Unable to connect to the database. Please try again.",
      originalError: error,
      retryable: true,
      timestamp,
    };
  }

  return null;
}

/**
 * Fetch with automatic retry and better error handling
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 2
): Promise<Response> {
  let lastError: any;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // If response is ok or it's a 4xx error (don't retry client errors)
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      // Server error, retry
      lastError = new Error(`Server error: ${response.status}`);

      // Wait before retry (exponential backoff)
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    } catch (error) {
      lastError = error;

      // Wait before retry for network errors
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  throw lastError;
}

/**
 * Log errors to console with context
 */
export function logError(context: string, error: AppError | any) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ${context}:`, {
    type: error.type || "unknown",
    message: error.message || String(error),
    userMessage: error.userMessage,
    retryable: error.retryable,
    originalError: error.originalError || error,
  });
}

/**
 * Handle async operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string,
  type: ErrorType = "unknown",
  customMessage?: string
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (err) {
    const appError = createAppError(err, type, customMessage);
    logError(context, appError);
    return { data: null, error: appError };
  }
}
