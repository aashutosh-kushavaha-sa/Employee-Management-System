import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalService } from '../modal/alertModel/modal.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login {
  userData = {
    email: '',
    password: '',
  };

  private apiUrl = 'http://localhost:3003/api/auth/login';

  constructor(private http: HttpClient, private router: Router,private modal: ModalService) {}

  submitted: boolean = false;
  loading: boolean = false;
  errorMessage: string | null = null;

  onSubmit(form: NgForm) {
    this.submitted = true;
    this.errorMessage = null;

    // ✅ STOP here if form is invalid
    if (form.invalid) {
      console.log('Form is invalid. Please check required fields.');
      return;
    }

    this.loading = true;

    this.http.post<{ token: string; user: any }>(this.apiUrl, this.userData).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login successful!', response);
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
      },

      error: (err: HttpErrorResponse) => {
        this.loading = false;
        console.error('Login error:', err);
        this.errorMessage =
          err.error && err.error.message
            ? err.error.message
            : 'Login failed due to a server error.';
        this.modal.show('Login failed due to a server error.', 'error');
      },
    });
  }
}
