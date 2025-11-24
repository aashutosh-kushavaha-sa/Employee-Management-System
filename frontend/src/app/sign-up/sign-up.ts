import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { ModalService } from '../modal/alertModel/modal.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, SidebarComponent],
})
export class SignUpComponent {
  userData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  };

  private apiUrl = 'http://localhost:3003/api/auth/signUp';

  submitted: boolean = false;
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router, private modal: ModalService) {}

  passwordsMatch(): boolean {
    if (!this.userData.password || !this.userData.confirmPassword) {
      return true;
    }
    return this.userData.password === this.userData.confirmPassword;
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    this.errorMessage = null;

    if (form.invalid || !this.passwordsMatch()) {
      console.log('Form invalid or passwords do not match.');
      return;
    }

    this.loading = true;

    const { name, email, password } = this.userData;

    this.http.post<{ token: string; user: any }>(this.apiUrl, { name, email, password }).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Registration successful!', response);

        // ✔️ Show modal, navigate when OK clicked
        this.modal.show(
          `Admin Created Successfully!`,
          'success',
          () => {
            this.router.navigate(['/dashboard']);
          }
        );
      },

      error: (err: HttpErrorResponse) => {
        this.loading = false;
        console.error('Registration error:', err);

        this.errorMessage =
          err.error?.message || 'Registration failed due to a server error.';
          
        this.modal.show('Registration failed.', 'error');
      },
    });
  }
}
