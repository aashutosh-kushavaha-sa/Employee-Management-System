import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { SidebarComponent } from "../../sidebar/sidebar";

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    ReactiveFormsModule, // 👈 required for Reactive Forms
    NgClass, // 👈 required for [ngClass]
    NgIf // 👈 required for *ngIf
    ,
    SidebarComponent
],
  templateUrl: './add.html',
  styleUrls: ['./add.css'],
})
export class Add implements OnInit {

  empForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

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

    console.log("Employee form submitted:", this.empForm.value);
  }

  department = ["Engineering","QA","IT Support","HR","Finance","Sales","Marketing","Data Science"];
  position = ["Software Engineer","Java Developer","QA Engineer","Network Engineer","HR Executive","Data Analyst"];
}
