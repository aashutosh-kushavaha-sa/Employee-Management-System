import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { UpdateModalService } from './update-modal.service';
import { ModalService } from '../alertModel/modal.service';
import { Employee } from '../../interfaces/employee.interface';
import { EmployeeUpdate } from '../../interfaces/employee-update.interface';

@Component({
  selector: 'app-update-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-modal.component.html',
  styleUrls: ['./update-modal.component.css'],
})
export class UpdateModalComponent implements OnInit, OnDestroy {

  visible: boolean = false;
  employee: Employee | null = null;

  formModel: EmployeeUpdate = {
    _id: '',
    name: '',
    age: undefined,
    gender: '',
    email: '',
    position: '',
    department: '',
    salary: undefined
  };

  loading: boolean = false;
  private sub!: Subscription;

  baseUrl = 'http://localhost:3000/api/employee';

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
        this.formModel = { ...s.employee };
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onCancel(): void {
    this.updateModalService.cancel();
  }

  onUpdate(form: NgForm): void {
    if (form.invalid) {
      this.modal.show('Please fix validation errors.', 'error');
      return;
    }

    if (!this.employee) return;

    this.loading = true;

    const token = localStorage.getItem('token') ?? '';
    const headers = new HttpHeaders({ Authorization: token });

    const payload: EmployeeUpdate = { ...this.formModel };

    this.http
      .put<EmployeeUpdate>(`${this.baseUrl}/update/${this.employee._id}`, payload, { headers })
      .subscribe({
        next: (res: EmployeeUpdate) => {
          this.loading = false;

          const updated = res?._id ? res : { ...this.employee!, ...payload };

          this.updateModalService.confirm(updated);
          this.modal.show('Employee updated successfully!', 'success');
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.modal.show(err.error?.message || 'Update failed.', 'error');
        },
      });
  }
}
