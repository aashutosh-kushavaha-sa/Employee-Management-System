import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarComponent } from "../../sidebar/sidebar";
import { ConfirmModalService } from '../../modal/confirm-model/confirm-modal.service';
import { UpdateModalService } from '../../modal/updateModal/update-modal.service';
import { UpdateModalComponent } from '../../modal/updateModal/update-modal.component';

// FontAwesome Icon
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-all',
  standalone: true,
  imports: [CommonModule, SidebarComponent, UpdateModalComponent,FontAwesomeModule],
  templateUrl: './all.html',
  styleUrl: './all.css',
})
export class All implements OnInit {

  // FontAwesome Icon
  faSearch = faSearch;

  // Employee Data Arrays
  allData: any[] = [];
  filteredData: any[] = [];  // used for search

  // Inject HttpClient
  http = inject(HttpClient);

  constructor(
    private confirmModal: ConfirmModalService,
    private updateModalService: UpdateModalService
  ) {}

  // ----------------------------------------
  // 🔥 On component load → fetch all employees
  // ----------------------------------------
  ngOnInit(): void {
    this.getEmployee();
  }

  // ----------------------------------------
  // 🔥 Fetch all employees from API
  // ----------------------------------------
  getEmployee() {
    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: token ?? '',
    });

    this.http.get("http://localhost:3000/api/employee/getall", { headers })
      .subscribe((res: any) => {
        this.allData = res;
        this.filteredData = res;  // initial view = full list
        console.log("Employees Loaded:", this.allData);
      });
  }

  // ----------------------------------------
  // 🔎 Search employees (UI only)
  // ----------------------------------------
  search(event: any) {
    const value = event.target.value.toLowerCase();

    if (!value.trim()) {
      this.filteredData = [...this.allData];
      return;
    }

    this.filteredData = this.allData.filter((emp) =>
      emp.name.toLowerCase().includes(value) ||
      emp.email.toLowerCase().includes(value) ||
      emp.department.toLowerCase().includes(value) ||
      emp.position.toLowerCase().includes(value)
    );
  }

  // ----------------------------------------
  // 🗑 Delete Employee → Confirmation Popup
  // ----------------------------------------
  deleteEmployee(id: string) {
    this.confirmModal.show(
      "Are you sure you want to delete this employee?",
      () => this.deleteNow(id)
    );
  }

  // ----------------------------------------
  // 🗑 Final Delete Logic
  // ----------------------------------------
  deleteNow(id: string) {
    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: token ?? ''
    });

    this.http.delete(`http://localhost:3000/api/employee/delete/${id}`, { headers })
      .subscribe({
        next: () => {
          // Remove instantly from UI
          this.allData = this.allData.filter(emp => emp._id !== id);
          this.filteredData = this.filteredData.filter(emp => emp._id !== id);

          console.log("Employee deleted:", id);
        },
        error: (err) => {
          console.error("Delete failed:", err);
        }
      });
  }

  // ----------------------------------------
  // ✏️ Update Employee → Opens modal
  // ----------------------------------------
  openUpdate(emp: any) {
    this.updateModalService.show(emp).then((updatedEmployee) => {
      if (!updatedEmployee) return; // user clicked cancel

      // Find index in allData
      const index = this.allData.findIndex(e => e._id === updatedEmployee._id);

      if (index !== -1) {
        // Update original list
        this.allData[index] = { ...this.allData[index], ...updatedEmployee };
      }

      // Update filtered list (for search results)
      const i2 = this.filteredData.findIndex(e => e._id === updatedEmployee._id);
      if (i2 !== -1) {
        this.filteredData[i2] = { ...this.filteredData[i2], ...updatedEmployee };
      }

      console.log("Employee updated:", updatedEmployee);
    });
  }
}
