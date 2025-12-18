import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Employee } from '../../interfaces/employee.interface';

import { UpdateModalService } from './update-modal.service';
import { ModalService } from '../alertModel/modal.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-update-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-modal.component.html',
  styleUrls: ['./update-modal.component.css'],
})
export class UpdateModalComponent implements OnInit, OnDestroy {
  private updateModalService = inject(UpdateModalService);
  private http = inject(HttpClient);
  private modal = inject(ModalService);

  visible = false;
  employee: Employee | null = null;

  formModel: Partial<Employee> = {
    name: '',
    age: undefined,
    gender: undefined,
    email: '',
    position: '',
    department: '',
    salary: undefined,
  };

  loading: boolean = false;
  private sub!: Subscription;

  baseUrl = `${environment.apiUrl}/api/employee`;

  // compatibility constructor removed by migration

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
      .put<
        Employee | Partial<Employee>
      >(`${this.baseUrl}/update/${this.employee?._id}`, payload, { headers })
      .subscribe({
        next: (res) => {
          this.loading = false;

          const updated =
            res && (res as Employee & { _id?: string })._id
              ? (res as Employee)
              : { ...this.employee, ...payload };

          this.updateModalService.confirm(updated as Employee);
          this.modal.show('Employee updated successfully!', 'success');
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.modal.show(err.error?.message || 'Update failed.', 'error');
        },
      });
  }
}
