import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { ModalService } from '../modal/alertModel/modal.service';

import { SignupResponse } from '../../app/interfaces/signup-response.interface';
import { SignupRequest } from '../../app/interfaces/signup-request.interface';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, SidebarComponent],
})
export class SignUpComponent {

  userData: SignupRequest & { confirmPassword: string; terms: boolean } = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  };

  private apiUrl = 'http://localhost:3003/api/auth/signUp';

  submitted: boolean = false;
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private modal: ModalService
  ) {}

  passwordsMatch(): boolean {
    const { password, confirmPassword } = this.userData;
    if (!password || !confirmPassword) return true;

    return password === confirmPassword;
  }

  onSubmit(form: NgForm): void {
    this.submitted = true;
    this.errorMessage = null;

    if (form.invalid || !this.passwordsMatch()) {
      console.log('Form invalid or passwords do not match.');
      return;
    }

    this.loading = true;

    const requestBody: SignupRequest = {
      name: this.userData.name,
      email: this.userData.email,
      password: this.userData.password
    };

    this.http.post<SignupResponse>(this.apiUrl, requestBody).subscribe({
      next: (response: SignupResponse) => {
        this.loading = false;
        console.log('Registration successful!', response);

        this.modal.show(
          `Admin Created Successfully!`,
          'success',
          () => this.router.navigate(['/dashboard'])
        );
      },

      error: (err: HttpErrorResponse) => {
        this.loading = false;
        console.error('Registration error:', err);

        this.errorMessage =
          err.error?.message || 'Registration failed due to a server error.';

        this.modal.show(`this.errorMessage`, 'error');
      },
    });
  }
}
