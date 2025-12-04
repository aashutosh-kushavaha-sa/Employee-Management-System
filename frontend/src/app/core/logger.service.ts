import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private dev = isDevMode();

  private format(value: unknown): string {
    try {
      return typeof value === 'string' ? value : JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  info(message: unknown, meta?: unknown): void {
    if (this.dev) {
      console.info('[INFO]', this.format(message), this.format(meta ?? ''));
    }
  }

  warn(message: unknown, meta?: unknown): void {
    if (this.dev) {
      console.warn('[WARN]', this.format(message), this.format(meta ?? ''));
    }
  }

  error(message: unknown, meta?: unknown): void {
    if (this.dev) {
      console.error('[ERROR]', this.format(message), this.format(meta ?? ''));
    }
  }

  debug(message: unknown, meta?: unknown): void {
    if (this.dev) {
      console.debug('[DEBUG]', this.format(message), this.format(meta ?? ''));
    }
  }
}
