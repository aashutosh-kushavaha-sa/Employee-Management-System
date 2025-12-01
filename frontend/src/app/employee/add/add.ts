import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { SidebarComponent } from '../../sidebar/sidebar';
import { Router } from '@angular/router';
import { ModalService } from '../../modal/alertModel/modal.service';

import { EmployeeAddRequest } from '../../../app/interfaces/employee-add-request.interface';
import { EmployeeResponse } from '../../../app/interfaces/employee-response.interface';

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
      age: ['', [Validators.required, Validators.min(18), Validators.max(70)]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      department: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]],
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.empForm.invalid) return;

    const empData: EmployeeAddRequest = this.empForm.value;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: token ?? '',
    });

    this.http
      .post<EmployeeResponse>('http://localhost:3000/api/employee/add', empData, { headers })
      .subscribe({
        next: (res: EmployeeResponse) => {
          console.log('Employee added:', res);

          this.modal.show('Employee added successfully!', 'success', () => {
            this.router.navigate(['/employees/all']);
          });
        },

        error: (err: HttpErrorResponse) => {
          console.error('Error:', err);

          this.modal.show('Failed to add employee!', 'error');
        },
      });
  }
}
