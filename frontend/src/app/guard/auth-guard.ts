import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);

  // compatibility constructor removed by migration

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    // If no token → redirect to login
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // If token exists → allow access
    return true;
  }
}
