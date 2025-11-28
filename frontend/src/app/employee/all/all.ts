import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarComponent } from '../../sidebar/sidebar';
import { ConfirmModalService } from '../../modal/confirm-model/confirm-modal.service';
import { UpdateModalService } from '../../modal/updateModal/update-modal.service';
import { UpdateModalComponent } from '../../modal/updateModal/update-modal.component';

// icons
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../environments/environment';


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
  allData: any[] = [];
  filteredData: any[] = [];
  pagedData: any[] = [];

  // filter values
  departmentList: any[] = [];
  selectedDepartment = '';
  selectedGender = '';
  searchValue = '';

  // sorting value
  sortColumn = '';
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
  getEmployee() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: token ?? '',
    });

    this.http
      .get(`${environment.apiUrl}/api/employee/getall`, { headers })
      .subscribe((res: any) => {
        this.allData = res;
        this.filteredData = res;
        this.updatePagination();

        // extract unique department list
        this.departmentList = [...new Set(res.map((e: any) => e.department))];
      });
  }

  // search filter
  search(event: any) {
    this.searchValue = event.target.value.toLowerCase();
    this.applyFilters();
  }

  // department filter
  filterDepartment(event: any) {
    this.selectedDepartment = event.target.value.toLowerCase();
    this.applyFilters();
  }

  // gender filter
  filterGender(event: any) {
    this.selectedGender = event.target.value.toLowerCase();
    this.applyFilters();
  }

  // master filter (search + gender + department)
  applyFilters() {
    let data = this.allData.filter((emp) => {
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
    this.currentPage = 1; // Reset to first page when filters change

    // sort again after filtering
    if (this.sortColumn) {
      this.sortData(this.sortColumn);
    } else {
      this.updatePagination();
    }
  }

  // SORTING LOGIC
  sortData(column: string) {
    // toggle direction when clicking same column
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // apply sorting to filteredData only
    this.filteredData.sort((a: any, b: any) => {
      let valA = a[column];
      let valB = b[column];

      // handle string sorting (name, department)
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (this.sortDirection === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

    this.updatePagination();
  }

  // PAGINATION METHODS
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    
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

  onPageSizeChange(event: any) {
    this.pageSize = parseInt(event.target.value);
    this.currentPage = 1;
    this.updatePagination();
  }

  // delete confirmation modal
  deleteEmployee(id: string) {
    this.confirmModal.show('Are you sure you want to delete this employee?', () =>
      this.deleteNow(id)
    );
  }

  // delete final
  deleteNow(id: string) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: token ?? '',
    });

    this.http.delete(`${environment.apiUrl}/api/employee/delete/${id}`, { headers }).subscribe({
      next: () => {
        this.allData = this.allData.filter((emp) => emp._id !== id);
        this.applyFilters();
      },
    });
  }

  // update modal
  openUpdate(emp: any) {
    this.updateModalService.show(emp).then((updatedEmployee) => {
      if (!updatedEmployee) return;

      const index = this.allData.findIndex((e) => e._id === updatedEmployee._id);

      if (index !== -1) {
        this.allData[index] = { ...this.allData[index], ...updatedEmployee };
      }

      this.applyFilters();
    });
  }
}