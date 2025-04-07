interface ErrorResponse {
  code: string;
  message: string;
  details?: unknown;
}

export function createResponse<T>(data: T | null, error?: ErrorResponse) {
  if (error) {
    return {
      success: false,
      error,
    };
  }

  return {
    success: true,
    data,
  };
} 