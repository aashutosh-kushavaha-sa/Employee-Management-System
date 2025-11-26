import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalService } from '../modal/alertModel/modal.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [CommonModule, ReactiveFormsModule]
})
export class Login {

  loginForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage: string | null = null;

  private apiUrl = 'http://localhost:3003/api/auth/login';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private modal: ModalService
  ) {
    this.createForm();
  }

  // ✅ Initialize FormGroup
  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  // ✅ Submit form + API call
  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      console.log('Invalid form');
      return;
    }

    this.loading = true;

    this.http
      .post<{ token: string; user: any }>(this.apiUrl, this.loginForm.value)
      .subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Login Successful!', response);

          localStorage.setItem('token', response.token);

          this.router.navigate(['/dashboard']);
        },

        error: (err: HttpErrorResponse) => {
          this.loading = false;
          console.error('Login error:', err);

          this.errorMessage = err.error?.message || 'Login failed due to a server error.';
          this.modal.show('Login failed due to a server error.', 'error');
        }
      });
  }
}
