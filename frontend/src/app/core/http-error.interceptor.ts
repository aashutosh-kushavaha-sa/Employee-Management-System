import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private logger = inject(LoggerService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.logger.error('HTTP Error', {
          url: req.url,
          status: error.status,
          message: error.message,
        });
        return throwError(() => error);
      }),
    );
  }
}
