import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../sidebar/sidebar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
    SidebarComponent,
    HttpClientModule, // ⭐ Important for API call
  ],
  templateUrl: './add.html',
  styleUrls: ['./add.css'],
})
export class Add implements OnInit {
  empForm!: FormGroup;
  submitted = false;

  department = [
    'Engineering',
    'QA',
    'IT Support',
    'HR',
    'Finance',
    'Sales',
    'Marketing',
    'Data Science',
  ];
  position = [
    'Software Engineer',
    'Java Developer',
    'QA Engineer',
    'Network Engineer',
    'HR Executive',
    'Data Analyst',
  ];

  constructor(private fb: FormBuilder, private http: HttpClient,private router:Router) {}

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

  onSubmit() {
    this.submitted = true;

    if (this.empForm.invalid) return;

    const empData = this.empForm.value;

    const token = localStorage.getItem('token'); // get token

    const headers = new HttpHeaders({
      Authorization: token ?? '',
    });

    this.http.post('http://localhost:3000/api/employee/add', empData, { headers }).subscribe({
      next: (res) => {
        console.log('Employee added:', res);
        alert('Employee added successfully!');

        this.router.navigate(["/employees/all"])
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Failed to add employee');
      },
    });
  }
}
