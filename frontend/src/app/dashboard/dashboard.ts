import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { Employee } from '../interfaces/employee.interface';

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

  // 🔥 Type improvements (no more any)
  employeeList: Employee[] = [];
  allDepartments: string[] = [];
  uniqueDepartments: string[] = [];
  recentEmployees: Employee[] = [];
  deptWiseCount: { department: string; count: number }[] = [];

  totalEmployees = 0;
  departments = 0;

  genderCount = { male: 0, female: 0, other: 0 };

  avgSalary = 0;
  highestSalary = 0;
  lowestSalary = 0;

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded: any = jwtDecode(token);
      this.adminName = decoded?.name || 'Admin';
    }

    this.getEmployee();
  }

  getEmployee() {
    const token = localStorage.getItem('token') ?? '';

    const headers = new HttpHeaders({
      Authorization: token,
    });

    this.http.get<Employee[]>(`${environment.apiUrl}/api/employee/getall`, { headers })
      .subscribe({
        next: (res: Employee[]) => {

          // Save full list
          this.employeeList = res;
          this.totalEmployees = res.length;

          // Departments
          this.allDepartments = res.map(emp => emp.department);
          this.uniqueDepartments = [...new Set(this.allDepartments)];
          this.departments = this.uniqueDepartments.length;

          // Recent Employees (Last 5)
          this.recentEmployees = [...res].slice(-5).reverse();

          // Gender Count
          this.genderCount = { male: 0, female: 0, other: 0 };
          res.forEach(emp => {
            const g = emp.gender.toLowerCase();
            if (g === 'male') this.genderCount.male++;
            else if (g === 'female') this.genderCount.female++;
            else this.genderCount.other++;
          });

          // Salary Analytics
          const salaries = res.map(e => e.salary);

          this.avgSalary = Math.round(
            salaries.reduce((a, b) => a + b, 0) / salaries.length
          );
          this.highestSalary = Math.max(...salaries);
          this.lowestSalary = Math.min(...salaries);

          // Department-wise Count
          this.deptWiseCount = this.uniqueDepartments.map(dept => ({
            department: dept,
            count: res.filter(e => e.department === dept).length
          }));
        },

        error: (err: HttpErrorResponse) => {
          console.error("Error fetching employee data:", err);
        }
      });
  }
}
