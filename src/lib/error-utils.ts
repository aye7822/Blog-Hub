/**
 * Utility functions for safe error handling
 */

export interface ErrorInfo {
  message: string
  status?: number
  httpStatus?: number
  code?: string
  isClientError: boolean
  isNetworkError: boolean
  shouldRetry: boolean
}

/**
 * Safely extracts error information from unknown error objects
 */
export function getErrorInfo(error: unknown): ErrorInfo {
  const defaultInfo: ErrorInfo = {
    message: 'An unknown error occurred',
    isClientError: false,
    isNetworkError: false,
    shouldRetry: true
  }

  if (!error || typeof error !== 'object') {
    return defaultInfo
  }

  try {
    const errorObj = error as any
    let message = 'An unknown error occurred'
    let status: number | undefined
    let httpStatus: number | undefined
    let code: string | undefined

    // Extract message
    if (errorObj.message) {
      message = String(errorObj.message)
    } else if (errorObj.error?.message) {
      message = String(errorObj.error.message)
    }

    // Extract status codes
    if (errorObj.status && typeof errorObj.status === 'number') {
      status = errorObj.status
    }
    if (errorObj.httpStatus && typeof errorObj.httpStatus === 'number') {
      httpStatus = errorObj.httpStatus
    }
    if (errorObj.data?.httpStatus && typeof errorObj.data.httpStatus === 'number') {
      httpStatus = errorObj.data.httpStatus
    }
    if (errorObj.data?.status && typeof errorObj.data.status === 'number') {
      status = errorObj.data.status
    }

    // Extract error code
    if (errorObj.code) {
      code = String(errorObj.code)
    } else if (errorObj.data?.code) {
      code = String(errorObj.data.code)
    }

    // Determine error type
    const statusCode = httpStatus || status
    const isClientError = statusCode ? statusCode >= 400 && statusCode < 500 : false
    const isNetworkError = message.toLowerCase().includes('network') || 
                          message.toLowerCase().includes('fetch') ||
                          message.toLowerCase().includes('timeout') ||
                          message.toLowerCase().includes('connection')

    return {
      message,
      status,
      httpStatus,
      code,
      isClientError,
      isNetworkError,
      shouldRetry: !isClientError && !isNetworkError
    }
  } catch {
    return defaultInfo
  }
}

/**
 * Safe retry logic for React Query
 */
export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  const errorInfo = getErrorInfo(error)
  
  // Don't retry client errors (4xx)
  if (errorInfo.isClientError) {
    return false
  }
  
  // Limit retries for network errors
  if (errorInfo.isNetworkError) {
    return failureCount < 2
  }
  
  // Default retry logic
  return failureCount < 3
}

/**
 * Safe retry logic for mutations
 */
export function shouldRetryMutation(failureCount: number, error: unknown): boolean {
  const errorInfo = getErrorInfo(error)
  
  // Generally don't retry mutations
  return false
}

/**
 * Logs error safely without throwing
 */
export function logError(error: unknown, context?: string): void {
  try {
    const errorInfo = getErrorInfo(error)
    const logMessage = context ? `[${context}] ${errorInfo.message}` : errorInfo.message
    
    console.error(logMessage, {
      error,
      errorInfo,
      timestamp: new Date().toISOString()
    })
  } catch {
    console.error('Failed to log error safely', error)
  }
}

/**
 * Creates a user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  const errorInfo = getErrorInfo(error)
  
  if (errorInfo.isClientError) {
    switch (errorInfo.status || errorInfo.httpStatus) {
      case 400:
        return 'Invalid request. Please check your input and try again.'
      case 401:
        return 'You need to be logged in to perform this action.'
      case 403:
        return 'You do not have permission to perform this action.'
      case 404:
        return 'The requested resource was not found.'
      case 409:
        return 'This resource already exists. Please try with different data.'
      case 422:
        return 'The data you provided is invalid. Please check and try again.'
      case 429:
        return 'Too many requests. Please wait a moment and try again.'
      default:
        return 'Something went wrong. Please try again.'
    }
  }
  
  if (errorInfo.isNetworkError) {
    return 'Network error. Please check your connection and try again.'
  }
  
  return errorInfo.message || 'An unexpected error occurred. Please try again.'
}
