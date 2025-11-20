import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  activeEmployees = 38;

  http = inject(HttpClient);
  employeeList: any[] = [];
  totalEmployees = 0;
  allDepartments : any[] = [];
  uniqueDepartments : any[] = [];
  departments = 0;

  ngOnInit(): void {
    this.getEmployee();
  }

  getEmployee() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: token ?? '',
    });

    this.http
      .get('http://localhost:3000/api/employee/getall', { headers })
      .subscribe((res: any) => {
        this.employeeList = res;
        this.totalEmployees = this.employeeList.length;
        console.log('Employee List:', this.totalEmployees);

        // fetch Department from employeeList
        this.allDepartments = this.employeeList.map((emp) => emp.department);
        // Get Unique Departmnet
        this.uniqueDepartments = [...new Set(this.allDepartments)];

        this.departments = this.uniqueDepartments.length;
      });
  }
}
