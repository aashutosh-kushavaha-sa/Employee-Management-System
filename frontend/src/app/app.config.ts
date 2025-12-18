import { ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { routes } from './app.routes';

// Import interceptors
import { loaderInterceptor } from './loader/loader.interceptor';
import { httpErrorInterceptor } from './core/http-error.interceptor';
import { GlobalErrorHandler } from './core/global-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    // Global error handler for uncaught errors
    { provide: ErrorHandler, useClass: GlobalErrorHandler },

    // Router and HTTP client configuration
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        loaderInterceptor,
        httpErrorInterceptor, // Add HTTP error interceptor (functional interceptor)
      ]),
    ),

    // Material and animations
    provideAnimations(),
    importProvidersFrom(MatSnackBarModule),
  ],
};
