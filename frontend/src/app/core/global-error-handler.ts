import { ErrorHandler, Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggerService } from './logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private logger = inject(LoggerService);
  private snackBar = inject(MatSnackBar);

  handleError(error: unknown): void {
    try {
      let errorMessage = 'An unexpected error occurred';

      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String((error as { message: unknown }).message);
      }

      // Log the error
      this.logger.error('Application Error', error);

      // Show error to user
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    } catch (e) {
      // Fallback error handling if our error handling fails
      console.error('Error in GlobalErrorHandler', e);
      this.snackBar.open('An error occurred', 'Close');
    }
  }
}
