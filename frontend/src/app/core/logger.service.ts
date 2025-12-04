import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor() {}

  private dev = isDevMode();

  info(message: any, meta?: any) {
    if (this.dev) {
      console.info('[INFO]', message, meta ?? '');
    }
  }

  warn(message: any, meta?: any) {
    if (this.dev) {
      console.warn('[WARN]', message, meta ?? '');
    }
  }

  error(message: any, meta?: any) {
    if (this.dev) {
      console.error('[ERROR]', message, meta ?? '');
    }
  }

  debug(message: any, meta?: any) {
    if (this.dev) {
      console.debug('[DEBUG]', message, meta ?? '');
    }
  }
}
