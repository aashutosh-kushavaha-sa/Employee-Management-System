import { ErrorHandler, Injectable, inject } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private logger = inject(LoggerService);

  handleError(error: unknown): void {
    try {
      if (typeof error === 'object' && error !== null && 'stack' in error) {
        const withStack = error as { stack?: unknown };
        this.logger.error('Unhandled Error', withStack.stack ?? error);
      } else {
        this.logger.error('Unhandled Error', error);
      }
    } catch (e) {
      this.logger.error('Error in GlobalErrorHandler', e);
    }
  }
}
