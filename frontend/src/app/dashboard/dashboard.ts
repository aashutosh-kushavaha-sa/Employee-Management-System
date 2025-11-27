import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  http = inject(HttpClient);
  adminName = '';
  employeeList: any[] = [];
  totalEmployees = 0;
  allDepartments: any[] = [];
  uniqueDepartments: any[] = [];
  departments = 0;
  recentEmployees: any[] = [];
  genderCount = { male: 0, female: 0, other: 0 };
  avgSalary = 0;
  highestSalary = 0;
  lowestSalary = 0;
  deptWiseCount: any[] = [];

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded: any = jwtDecode(token);
      this.adminName = decoded?.name || 'Admin';
    }
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
        // Save full list
        this.employeeList = res;
        this.totalEmployees = res.length;

        // Unique Department Count
        this.allDepartments = res.map((emp: any) => emp.department);
        this.uniqueDepartments = [...new Set(this.allDepartments)];
        this.departments = this.uniqueDepartments.length;

        // Recent Employees (Last 5)
        this.recentEmployees = [...res].slice(-5).reverse();

        // Gender Count
        this.genderCount = { male: 0, female: 0, other: 0 };
        res.forEach((emp: any) => {
          if (emp.gender.toLowerCase() === 'male') this.genderCount.male++;
          else if (emp.gender.toLowerCase() === 'female') this.genderCount.female++;
          else this.genderCount.other++;
        });

        // Salary Analytics
        const salaries = res.map((e: any) => e.salary);

        this.avgSalary = Math.round(
          salaries.reduce((a: any, b: any) => a + b, 0) / salaries.length
        );
        this.highestSalary = Math.max(...salaries);
        this.lowestSalary = Math.min(...salaries);

        // Department-wise Employee Count
        this.deptWiseCount = [];
        this.uniqueDepartments.forEach((dept) => {
          const count = res.filter((e: any) => e.department === dept).length;
          this.deptWiseCount.push({ department: dept, count });
        });
      });
  }
}
