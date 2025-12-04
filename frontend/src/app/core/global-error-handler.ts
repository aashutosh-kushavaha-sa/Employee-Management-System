import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private logger: LoggerService, private injector: Injector) {}

  handleError(error: any): void {
    const logger = this.injector.get(LoggerService);
    try {
      logger.error('Unhandled Error', error && error.stack ? error.stack : error);
    } catch (e) {
      this.logger.error('Error in GlobalErrorHandler', e)
    }
  }
}
