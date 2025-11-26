import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { UpdateModalService } from './update-modal.service';
import { ModalService } from '../alertModel/modal.service';

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

  onCancel() {
    this.updateModalService.cancel();
  }

  onUpdate(form: NgForm) {
    if (form.invalid) {
      this.modal.show('Please fix validation errors.', 'error');
      return;
    }

    this.loading = true;

    const token = localStorage.getItem('token') ?? '';
    const headers = new HttpHeaders({ Authorization: token });

    const payload = { ...this.formModel };

    this.http.put(`${this.baseUrl}/update/${this.employee._id}`, payload, { headers })
      .subscribe({
        next: (res: any) => {
          this.loading = false;

          const updated = res?._id ? res : { ...this.employee, ...payload };
          
          this.updateModalService.confirm(updated);
          this.modal.show('Employee updated successfully!', 'success');
        },
        error: (err) => {
          this.loading = false;
          this.modal.show(err.error?.message || 'Update failed.', 'error');
        }
      });
  }
}
