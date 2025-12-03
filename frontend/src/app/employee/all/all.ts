import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarComponent } from '../../sidebar/sidebar';
import { ConfirmModalService } from '../../modal/confirm-model/confirm-modal.service';
import { UpdateModalService } from '../../modal/updateModal/update-modal.service';
import { UpdateModalComponent } from '../../modal/updateModal/update-modal.component';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../environments/environment';
import { Employee } from '../../interfaces/employee.interface';

@Component({
  selector: 'app-all',
  standalone: true,
  imports: [CommonModule, SidebarComponent, UpdateModalComponent, FontAwesomeModule],
  templateUrl: './all.html',
  styleUrl: './all.css',
})
export class All implements OnInit {
  private confirmModal = inject(ConfirmModalService);
  private updateModalService = inject(UpdateModalService);

  // ICON
  faSearch = faSearch;

  // DATA ARRAYS (TYPED)
  allData: Employee[] = [];
  filteredData: Employee[] = [];
  pagedData: Employee[] = [];

  // FILTERS
  departmentList: string[] = [];
  selectedDepartment = '';
  selectedGender = '';
  searchValue = '';

  // SORTING
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // PAGINATION
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  http = inject(HttpClient);

  // compatibility constructor removed by migration

  ngOnInit(): void {
    this.getEmployee();
  }

  // FETCH ALL EMPLOYEE DATA
  getEmployee() {
    const token = localStorage.getItem('token') ?? '';

    const headers = new HttpHeaders({
      Authorization: token,
    });

    this.http
      .get<Employee[]>(`${environment.apiUrl}/api/employee/getall`, { headers })
      .subscribe((res) => {
        this.allData = res;
        this.filteredData = res;
        this.updatePagination();

        // Unique departments
        this.departmentList = [...new Set(res.map((e) => e.department))];
      });
  }

  // SEARCH FILTER
  search(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchValue = target.value.toLowerCase();
    this.applyFilters();
  }

  // DEPARTMENT FILTER
  filterDepartment(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedDepartment = target.value.toLowerCase();
    this.applyFilters();
  }

  // GENDER FILTER
  filterGender(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedGender = target.value.toLowerCase();
    this.applyFilters();
  }

  // MASTER FILTER
  applyFilters() {
    const data = this.allData.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(this.searchValue) ||
        emp.email.toLowerCase().includes(this.searchValue) ||
        emp.department.toLowerCase().includes(this.searchValue) ||
        emp.position.toLowerCase().includes(this.searchValue);

      const matchDepartment =
        !this.selectedDepartment || emp.department.toLowerCase() === this.selectedDepartment;

      const matchGender = !this.selectedGender || emp.gender.toLowerCase() === this.selectedGender;

      return matchSearch && matchDepartment && matchGender;
    });

    this.filteredData = data;
    this.currentPage = 1;

    if (this.sortColumn) {
      this.sortData(this.sortColumn);
    } else {
      this.updatePagination();
    }
  }

  // SORTING
  sortData(column: keyof Employee | string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a, b) => {
      const valA = a[column as keyof Employee];
      const valB = b[column as keyof Employee];

      const A: string | number = typeof valA === 'string' ? valA.toLowerCase() : (valA ?? 0);

      const B: string | number = typeof valB === 'string' ? valB.toLowerCase() : (valB ?? 0);

      if (this.sortDirection === 'asc') {
        return A > B ? 1 : -1;
      } else {
        return A < B ? 1 : -1;
      }
    });

    this.updatePagination();
  }

  // PAGINATION
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.pagedData = this.filteredData.slice(startIndex, endIndex);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredData.length);
  }

  getTotalPages(): number {
    return this.totalPages;
  }

  getPageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 4) {
      return [1, 2, 3, 4, 5, 0, total];
    }

    if (current >= total - 3) {
      return [1, 0, total - 4, total - 3, total - 2, total - 1, total];
    }

    return [1, 0, current - 1, current, current + 1, 0, total];
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.pageSize = parseInt(target.value);
    this.currentPage = 1;
    this.updatePagination();
  }

  // DELETE CONFIRMATION MODAL
  deleteEmployee(id: string) {
    this.confirmModal.show('Are you sure you want to delete this employee?', () =>
      this.deleteNow(id),
    );
  }

  // FINAL DELETE
  deleteNow(id: string) {
    const token = localStorage.getItem('token') ?? '';

    const headers = new HttpHeaders({ Authorization: token });

    this.http
      .delete(`${environment.apiUrl}/api/employee/delete/${id}`, { headers })
      .subscribe(() => {
        this.allData = this.allData.filter((emp) => emp._id !== id);
        this.applyFilters();
      });
  }

  // UPDATE MODAL
  openUpdate(emp: Employee) {
    this.updateModalService.show(emp).then((updatedEmployee) => {
      if (!updatedEmployee) return;

      const index = this.allData.findIndex((e) => e._id === updatedEmployee._id);

      if (index !== -1) {
        this.allData[index] = {
          ...this.allData[index],
          ...updatedEmployee,
        };
      }

      this.applyFilters();
    });
  }
}
