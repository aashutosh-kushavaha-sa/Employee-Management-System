import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // 👈 Import HttpClient
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true //  component is standalone
})
export class Login {
  userData = {
    email: '',
    password: '',
  };

  //  URL points to Node.js server (5000) and the login endpoint
  private apiUrl = 'http://localhost:3003/api/auth/login';

  constructor(private http: HttpClient , private router : Router) { }

  submitted: boolean = false;
  loading: boolean = false;
  errorMessage: string | null = null; // Variable to display backend errors

  /**
   * Handles the form submission logic and API call.
   */
  onSubmit(form: NgForm) {
    this.submitted = true;
    this.errorMessage = null;

    if (form.invalid) {
      console.log('Form is invalid. Please check required fields.');
      return;
    }

    this.loading = true;

    // --- CONNECT TO NODE.JS BACKEND ---
    this.http.post<{ token: string, user: any }>(this.apiUrl, this.userData).subscribe({
      next: (response) => {
        // ✅ SUCCESS: Handle the token and user data
        this.loading = false;
        console.log('Login successful!', response);
        localStorage.setItem('token', response.token);
        // alert(`Welcome, Admin! Token received: ${response.token.substring(0, 20)}...`);
        // TODO: Implement Router navigation here: this.router.navigate(['/dashboard']);
        this.router.navigate(['/dashboard']);

      },
      error: (err: HttpErrorResponse) => {
        // ❌ ERROR: Handle backend failure messages
        this.loading = false;
        console.error('Login error:', err);
        // Extract and display the error message sent from Node.js
        this.errorMessage = err.error && err.error.message ? err.error.message : 'Login failed due to a server error.';
        alert("Login failed due to a server error.")
      }
    });
  }
}
