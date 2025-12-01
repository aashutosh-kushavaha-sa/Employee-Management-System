import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Employee } from '../../app/interfaces/employee.interface';
import { GenderCount, DepartmentCount } from '../../app/interfaces/dashboard-analytics.interface';
import { AdminTokenData } from '../../app/interfaces/admin.interface';

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

  employeeList: Employee[] = [];
  totalEmployees = 0;

  allDepartments: string[] = [];
  uniqueDepartments: string[] = [];
  departments = 0;

  recentEmployees: Employee[] = [];

  genderCount: GenderCount = { male: 0, female: 0, other: 0 };

  avgSalary = 0;
  highestSalary = 0;
  lowestSalary = 0;

  deptWiseCount: DepartmentCount[] = [];

  ngOnInit(): void {  
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode<AdminTokenData>(token);
      this.adminName = decoded?.name || 'Admin';
    }

    this.getEmployee();
  }

  getEmployee(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: token ?? '',
    });

    this.http
      .get<Employee[]>('http://localhost:3000/api/employee/getall', { headers })
      .subscribe((res: Employee[]) => {
        
        this.employeeList = res;
        this.totalEmployees = res.length;

        // Departments
        this.allDepartments = res.map(emp => emp.department);
        this.uniqueDepartments = [...new Set(this.allDepartments)];
        this.departments = this.uniqueDepartments.length;

        // Recent Employees
        this.recentEmployees = [...res].slice(-5).reverse();

        // Gender Count
        this.genderCount = { male: 0, female: 0, other: 0 };
        res.forEach(emp => {
          const gender = emp.gender.toLowerCase();
          if (gender === 'male') this.genderCount.male++;
          else if (gender === 'female') this.genderCount.female++;
          else this.genderCount.other++;
        });

        // Salary Analytics
        const salaries = res.map(e => e.salary);
        this.avgSalary = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
        this.highestSalary = Math.max(...salaries);
        this.lowestSalary = Math.min(...salaries);

        // Department-wise counts
        this.deptWiseCount = this.uniqueDepartments.map(dept => ({
          department: dept,
          count: res.filter(e => e.department === dept).length
        }));
      });
  }
}
