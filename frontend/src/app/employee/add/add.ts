import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { SidebarComponent } from '../../sidebar/sidebar';
import { Router } from '@angular/router';
import { ModalService } from '../../modal/alertModel/modal.service';
import { environment } from '../../../environments/environment';

import { EmployeeCreateRequest } from '../../interfaces/employee-create.interface';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
    SidebarComponent,
    HttpClientModule,
  ],
  templateUrl: './add.html',
  styleUrls: ['./add.css'],
})
export class Add implements OnInit {
  
  empForm!: FormGroup;
  submitted = false;

  // Typed option lists
  department: string[] = [
    'Engineering',
    'QA',
    'IT Support',
    'HR',
    'Finance',
    'Sales',
    'Marketing',
    'Data Science',
  ];

  position: string[] = [
    'Software Engineer',
    'Java Developer',
    'QA Engineer',
    'Network Engineer',
    'HR Executive',
    'Data Analyst',
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private modal: ModalService
  ) {}

  ngOnInit(): void {
    this.empForm = this.fb.group({
      name: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(18), Validators.max(70)]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      department: ['', Validators.required],
      salary: [null, [Validators.required, Validators.min(1000)]],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.empForm.invalid) return;

    // ✔ TS typed employee data
    const empData: EmployeeCreateRequest = this.empForm.value;

    const token = localStorage.getItem('token') ?? '';

    const headers = new HttpHeaders({
      Authorization: token,
    });

    this.http.post(`${environment.apiUrl}/api/employee/add`, empData, { headers })
      .subscribe({
        next: () => {
          this.modal.show('Employee added successfully!', 'success', () => {
            this.router.navigate(['/employees/all']);
          });
        },

        error: (err: HttpErrorResponse) => {
          console.error('Error:', err);
          this.modal.show('Failed to add employee!', 'error');
        }
      });
  }
}
