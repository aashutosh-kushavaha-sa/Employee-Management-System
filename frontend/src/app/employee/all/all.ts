import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarComponent } from "../../sidebar/sidebar";
import { ConfirmModalService } from '../../modal/confirm-model/confirm-modal.service';
import { UpdateModalService } from '../../modal/updateModal/update-modal.service';
import { UpdateModalComponent } from '../../modal/updateModal/update-modal.component';

// icons
import { faSearch } from '@fortawesome/free-solid-svg-icons';

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

  // filter values
  departmentList: any[] = [];
  selectedDepartment = "";
  selectedGender = "";
  searchValue = "";

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
    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: token ?? '',
    });

    this.http.get("http://localhost:3000/api/employee/getall", { headers })
      .subscribe((res: any) => {

        this.allData = res;
        this.filteredData = res;

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
    this.filteredData = this.allData.filter((emp) => {

      const matchSearch =
        emp.name.toLowerCase().includes(this.searchValue) ||
        emp.email.toLowerCase().includes(this.searchValue) ||
        emp.department.toLowerCase().includes(this.searchValue) ||
        emp.position.toLowerCase().includes(this.searchValue);

      const matchDepartment =
        !this.selectedDepartment ||
        emp.department.toLowerCase() === this.selectedDepartment;

      const matchGender =
        !this.selectedGender ||
        emp.gender.toLowerCase() === this.selectedGender;

      return matchSearch && matchDepartment && matchGender;
    });
  }

  // delete confirmation modal
  deleteEmployee(id: string) {
    this.confirmModal.show(
      "Are you sure you want to delete this employee?",
      () => this.deleteNow(id)
    );
  }

  // delete final
  deleteNow(id: string) {
    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: token ?? ''
    });

    this.http.delete(`http://localhost:3000/api/employee/delete/${id}`, { headers })
      .subscribe({
        next: () => {
          this.allData = this.allData.filter(emp => emp._id !== id);
          this.applyFilters();
        }
      });
  }

  // update modal
  openUpdate(emp: any) {
    this.updateModalService.show(emp).then((updatedEmployee) => {
      if (!updatedEmployee) return;

      const index = this.allData.findIndex(e => e._id === updatedEmployee._id);

      if (index !== -1) {
        this.allData[index] = { ...this.allData[index], ...updatedEmployee };
      }

      this.applyFilters();
    });
  }
}
