import { LoggerService } from '../core/logger.service';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { SidebarComponent } from '../sidebar/sidebar';
import { ModalService } from '../modal/alertModel/modal.service';
import { environment } from '../../environments/environment';

import { SignUpResponse } from '../interfaces/auth.interface';
import { SignUpForm } from '../interfaces/signup.interface';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, SidebarComponent],
})
export class SignUpComponent {
  constructor(private logger: LoggerService) {}

  private http = inject(HttpClient);
  private router = inject(Router);
  private modal = inject(ModalService);

  // Typed user form
  userData: SignUpForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  };

  private apiUrl = `${environment.apiUrl}/api/auth/signUp`;

  submitted = false;
  loading = false;
  errorMessage: string | null = null;

  // compatibility constructor removed by migration

  passwordsMatch(): boolean {
    return (
      !this.userData.password ||
      !this.userData.confirmPassword ||
      this.userData.password === this.userData.confirmPassword
    );
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    this.errorMessage = null;

    if (form.invalid || !this.passwordsMatch()) {
      this.logger.info('Form invalid or passwords do not match.')
      return;
    }

    this.loading = true;

    const { name, email, password } = this.userData;

    this.http.post<SignUpResponse>(this.apiUrl, { name, email, password }).subscribe({
      next: () => {
        this.loading = false;

        this.modal.show(`Admin Created Successfully!`, 'success', () =>
          this.router.navigate(['/dashboard']),
        );
      },

      error: (err: HttpErrorResponse) => {
        this.loading = false;

        this.errorMessage = err.error?.message || 'Registration failed due to a server error.';

        this.modal.show(`this.errorMessage`, 'error');
      },
    });
  }
}
