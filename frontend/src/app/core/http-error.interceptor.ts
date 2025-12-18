import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
  HttpStatusCode,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from './logger.service';

// Helper function to get server error message
function getServerErrorMessage(error: HttpErrorResponse): string {
  // Handle specific error cases
  switch (error.status) {
    case HttpStatusCode.BadRequest: // 400
      return getValidationErrorMessage(error) || 'Invalid request. Please check your input.';
    case HttpStatusCode.Unauthorized: // 401
      return 'Your session has expired. Please log in again.';
    case HttpStatusCode.Forbidden: // 403
      return 'You do not have permission to access this resource.';
    case HttpStatusCode.NotFound: // 404
      return 'The requested resource was not found.';
    case HttpStatusCode.InternalServerError: // 500
      return 'A server error occurred. Please try again later.';
    case 0:
      // Network or CORS error
      return 'Unable to connect to the server. Please check your internet connection.';
    default:
      return error.error?.message || error.message || 'An unexpected error occurred';
  }
}

// Helper function to get validation error messages
function getValidationErrorMessage(error: HttpErrorResponse): string | null {
  if (error.error?.errors) {
    // Handle validation errors (assuming they come in { errors: { field: string[] } } format)
    const errors = Object.values(error.error.errors).flat();
    return Array.isArray(errors) ? errors.join('\n') : null;
  }
  return null;
}

// Helper function to check if error notification should be skipped
function shouldSkipErrorNotification(req: HttpRequest<unknown>, error: HttpErrorResponse): boolean {
  // Skip notifications for 401 errors on login requests
  if (req.url.includes('/auth/login') && error.status === HttpStatusCode.Unauthorized) {
    return true;
  }
  // Skip notifications for specific endpoints if needed
  const skipEndpoints = ['/api/logs/error'];
  return skipEndpoints.some((endpoint) => req.url.includes(endpoint));
}

// Main interceptor function
export function httpErrorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const logger = inject(LoggerService);
  const snackBar = inject(MatSnackBar);

  // Skip error handling for specific requests if needed
  if (req.headers.has('X-Skip-Error-Handling')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage = getServerErrorMessage(error);

      // Log the error
      logger.error('HTTP Error', {
        url: req.url,
        status: error.status,
        message: error.message,
        error: error.error,
      });

      // Show error to user
      if (!shouldSkipErrorNotification(req, error)) {
        snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }

      return throwError(() => error);
    }),
  );
}
