export interface ErrorResponse {
  code: string;
  message: string;
  details?: unknown;
}

export function createResponse<T>(data: T | null, error?: ErrorResponse | string) {
  if (error) {
    if (typeof error === 'string') {
      return {
        success: false,
        error: {
          code: 'ERROR',
          message: error
        }
      };
    }
    
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