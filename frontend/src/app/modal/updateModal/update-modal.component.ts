import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UpdateModalService } from './update-modal.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalService } from '../alertModel/modal.service'; // your existing alert modal service

@Component({
  selector: 'app-update-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-modal.component.html',
  styleUrls: ['./update-modal.component.css'],
})
export class UpdateModalComponent implements OnInit, OnDestroy {
  visible = false;
  employee: any = null;

  // form model (copy of employee fields so editing won't mutate original until success)
  formModel: any = {
    name: '',
    age: null,
    gender: '',
    email: '',
    position: '',
    department: '',
    salary: null,
  };

  loading = false;
  private sub!: Subscription;

  // API base (adjust if different)
  private baseUrl = 'http://localhost:3000/api/employee';

  constructor(
    private updateModalService: UpdateModalService,
    private http: HttpClient,
    private modal: ModalService
  ) {}

  ngOnInit(): void {
    this.sub = this.updateModalService.state.subscribe((s) => {
      this.visible = s.visible;
      if (s.employee) {
        this.employee = s.employee;
        // copy fields into formModel
        this.formModel = {
          name: s.employee.name ?? '',
          age: s.employee.age ?? null,
          gender: s.employee.gender ?? '',
          email: s.employee.email ?? '',
          position: s.employee.position ?? '',
          department: s.employee.department ?? '',
          salary: s.employee.salary ?? null,
        };
      } else {
        this.employee = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // CANCEL pressed
  onCancel() {
    this.updateModalService.cancel();
  }

  // UPDATE pressed: validate and call API
  onUpdate(form: NgForm) {
    if (form.invalid) {
      // show error using existing ModalService
      this.modal.show('Please fix validation errors before updating.', 'error');
      return;
    }

    if (!this.employee?._id) {
      this.modal.show('Invalid employee selected.', 'error');
      return;
    }

    this.loading = true;

    const token = localStorage.getItem('token') ?? '';
    const headers = new HttpHeaders({ Authorization: token });

    const updatePayload = {
      name: this.formModel.name,
      age: this.formModel.age,
      gender: this.formModel.gender,
      email: this.formModel.email,
      position: this.formModel.position,
      department: this.formModel.department,
      salary: this.formModel.salary,
    };

    // PUT to your route: /update/:id
    this.http.put(`${this.baseUrl}/update/${this.employee._id}`, updatePayload, { headers }).subscribe({
      next: (res: any) => {
        this.loading = false;
        // Assume backend returns updated employee object; if not, we will merge manually.
        const updatedEmployee = res && res._id ? res : { ...this.employee, ...updatePayload };

        // resolve promise so caller (All component) can update UI
        this.updateModalService.confirm(updatedEmployee);

        // success message
        this.modal.show('Employee updated successfully!', 'success');
      },
      error: (err) => {
        this.loading = false;
        console.error('Update failed:', err);
        const msg = err?.error?.message || 'Failed to update employee.';
        this.modal.show(msg, 'error');
      },
    });
  }
}
