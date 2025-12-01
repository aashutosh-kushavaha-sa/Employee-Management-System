import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarComponent } from '../../sidebar/sidebar';
import { ConfirmModalService } from '../../modal/confirm-model/confirm-modal.service';
import { UpdateModalService } from '../../modal/updateModal/update-modal.service';
import { UpdateModalComponent } from '../../modal/updateModal/update-modal.component';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { Employee } from '../../../app/interfaces/employee.interface';
import { EmployeeUpdate } from '../../../app/interfaces/employee-update.interface';

@Component({
  selector: 'app-all',
  standalone: true,
  imports: [CommonModule, SidebarComponent, UpdateModalComponent, FontAwesomeModule],
  templateUrl: './all.html',
  styleUrl: './all.css',
})
export class All implements OnInit {
  // icons
  faSearch = faSearch;

  // data arrays
  allData: Employee[] = [];
  filteredData: Employee[] = [];
  pagedData: Employee[] = [];

  // filter values
  departmentList: string[] = [];
  selectedDepartment = '';
  selectedGender = '';
  searchValue = '';

  // sorting value
  sortColumn: keyof Employee | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // pagination values
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  http = inject(HttpClient);

  constructor(
    private confirmModal: ConfirmModalService,
    private updateModalService: UpdateModalService
  ) {}

  ngOnInit(): void {
    this.getEmployee();
  }

  // fetch all employee data
  getEmployee(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: token ?? '',
    });

    this.http
      .get<Employee[]>('http://localhost:3000/api/employee/getall', { headers })
      .subscribe({
        next: (res: Employee[]) => {
          this.allData = res;
          this.filteredData = res;
          this.updatePagination();

          // extract unique department list
          this.departmentList = [...new Set(res.map((e) => e.department))];
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error fetching employees:', err);
        },
      });
  }

  // search filter
  search(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchValue = input.value.toLowerCase();
    this.applyFilters();
  }

  // department filter
  filterDepartment(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedDepartment = select.value.toLowerCase();
    this.applyFilters();
  }

  // gender filter
  filterGender(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedGender = select.value.toLowerCase();
    this.applyFilters();
  }

  // master filter (search + gender + department)
  applyFilters(): void {
    const search = this.searchValue;
    const selectedDept = this.selectedDepartment;
    const selectedGen = this.selectedGender;

    const data = this.allData.filter((emp: Employee) => {
      const matchSearch =
        emp.name.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search) ||
        emp.department.toLowerCase().includes(search) ||
        (emp.position ?? '').toLowerCase().includes(search);

      const matchDepartment =
        !selectedDept || emp.department.toLowerCase() === selectedDept;

      const matchGender =
        !selectedGen || emp.gender.toLowerCase() === selectedGen;

      return matchSearch && matchDepartment && matchGender;
    });

    this.filteredData = data;
    this.currentPage = 1; // Reset to first page when filters change

    // sort again after filtering
    if (this.sortColumn) {
      // cast is safe here because sortColumn is keyof Employee
      this.sortData(this.sortColumn as keyof Employee);
    } else {
      this.updatePagination();
    }
  }

  // SORTING LOGIC
  sortData(column: keyof Employee): void {
    // toggle direction when clicking same column
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // apply sorting to filteredData only
    this.filteredData.sort((a: Employee, b: Employee) => {
      // get values in a safe, typed manner
      const valA = a[column] as unknown;
      const valB = b[column] as unknown;

      // If both are numbers -> numeric compare
      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortDirection === 'asc' ? (valA - (valB as number)) : ((valB as number) - valA);
      }

      // Otherwise compare as strings (safe guard with String())
      const strA = String(valA ?? '').toLowerCase();
      const strB = String(valB ?? '').toLowerCase();

      if (strA === strB) return 0;
      if (this.sortDirection === 'asc') return strA > strB ? 1 : -1;
      return strA < strB ? 1 : -1;
    });

    this.updatePagination();
  }

  // PAGINATION METHODS
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize) || 1;

    // Ensure current page is valid
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

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const parsed = parseInt(select.value, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      this.pageSize = parsed;
    } else {
      this.pageSize = 10;
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  // delete confirmation modal
  deleteEmployee(id: string): void {
    this.confirmModal.show('Are you sure you want to delete this employee?', () =>
      this.deleteNow(id)
    );
  }

  // delete final
  deleteNow(id: string): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: token ?? '',
    });

    this.http.delete(`http://localhost:3000/api/employee/delete/${id}`, { headers }).subscribe({
      next: () => {
        this.allData = this.allData.filter((emp) => emp._id !== id);
        this.applyFilters();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Delete error:', err);
      },
    });
  }

  // update modal
  openUpdate(emp: Employee): void {
    this.updateModalService.show(emp).then((updatedEmployee: EmployeeUpdate | null) => {
      if (!updatedEmployee) return;

      const index = this.allData.findIndex((e) => e._id === updatedEmployee._id);

      if (index !== -1) {
        // Merge partial update safely (EmployeeUpdate is a Partial-like type)
        this.allData[index] = { ...this.allData[index], ...updatedEmployee } as Employee;
      }

      this.applyFilters();
    });
  }
}
