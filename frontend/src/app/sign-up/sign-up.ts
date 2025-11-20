import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Import HttpClient
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink]
})
export class SignUpComponent {
  userData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  };

  // API URL
  private apiUrl = 'http://localhost:3003/api/auth/signUp';

  // --- STATE FOR UI AND ERROR HANDLING ---
  submitted: boolean = false;
  loading: boolean = false; // Added: State for showing a loading spinner
  errorMessage: string | null = null; // Added: Variable to display backend errors

  constructor(private http: HttpClient , private router : Router) { }

  /**
   * Checks if the password and confirm password fields match.
   */
  passwordsMatch(): boolean {
    // Return true if both are empty (relying on 'required' for initial error)
    if (!this.userData.password || !this.userData.confirmPassword) {
        return true;
    }
    // Return true only if values are identical
    return this.userData.password === this.userData.confirmPassword;
  }

  /**
   * Handles the form submission logic and API call.
   * @param form The Angular NgForm object.
   */
  onSubmit(form: NgForm) {
    this.submitted = true;
    this.errorMessage = null; // Reset error message

    // 1. Check if Angular's validation passes and passwords match
    if (form.invalid || !this.passwordsMatch()) {
      console.log('Form is invalid or passwords do not match. Please check fields.');
      return;
    }

    this.loading = true; // Start loading state

    // Destructure to send only necessary data to the backend
    const { name, email, password } = this.userData;

    // --- CONNECT TO NODE.JS BACKEND ---
    this.http.post<{ token: string, user: any }>(this.apiUrl, { name, email, password }).subscribe({
      next: (response) => {
        // ✅ SUCCESS: Handle the token and user data
        this.loading = false;
        console.log('Registration successful!', response);

        // Common practice: Log the user in directly after a successful signup
        localStorage.setItem('token', response.token);

        // NOTE: Use a custom modal instead of alert() in production Angular apps
        alert(`Registration successful! Welcome, ${response.user?.name || 'User'}! You are now logged in.`);
        // TODO: Implement Router navigation here: this.router.navigate(['/dashboard']);
        this.router.navigate(['/dashboard']);


      },
      error: (err: HttpErrorResponse) => {
        // ❌ ERROR: Handle backend failure messages
        this.loading = false;
        console.error('Registration error:', err);

        // Extract and display the error message sent from Node.js
        this.errorMessage = err.error && err.error.message ? err.error.message : 'Registration failed due to a server error.';

        // NOTE: Use a custom modal instead of alert() in production Angular apps
        alert("Registration failed.")
      }
    });
  }
}
