import { Component, OnInit, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { SidebarComponent } from '../sidebar/sidebar';
import { environment } from '../../environments/environment';
import { Employee } from '../interfaces/employee.interface';

@Component({
  selector: 'app-analytics-charts',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './simple-charts.html',
  styleUrls: ['./simple-charts.css'],
})
export class AnalyticsChartsComponent implements OnInit, AfterViewInit, OnDestroy {
  // Typed employees
  employees: Employee[] = [];

  isLoading = false;
  hasError = false;

  // Typed chart instances
  genderChart: Chart | null = null;
  departmentChart: Chart | null = null;
  salaryChart: Chart | null = null;

  private http = inject(HttpClient);

  ngOnInit() {
    this.loadEmployeeData();
  }

  // removed empty lifecycle hook

  ngOnDestroy() {
    this.destroyCharts();
  }

  // Load employee data
  loadEmployeeData() {
    this.isLoading = true;
    this.hasError = false;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    this.http.get<Employee[]>(`${environment.apiUrl}/api/employee/getall`, { headers }).subscribe({
      next: (res) => {
        this.employees = res;
        this.isLoading = false;
        setTimeout(() => this.buildCharts(), 100);
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
        this.employees = [];
      },
    });
  }

  // Build all charts
  buildCharts() {
    if (this.employees.length === 0) return;

    this.destroyCharts();

    this.buildGenderChart();
    this.buildDepartmentChart();
    this.buildSalaryChart();
  }

  // Gender Chart
  private buildGenderChart() {
    const male = this.employees.filter((e) => e.gender?.toLowerCase() === 'male').length;
    const female = this.employees.filter((e) => e.gender?.toLowerCase() === 'female').length;
    const other = this.employees.filter((e) => e.gender?.toLowerCase() === 'other').length;

    this.genderChart = new Chart('genderChartCanvas', {
      type: 'pie',
      data: {
        labels: ['Male', 'Female', 'Other'],
        datasets: [
          {
            data: [male, female, other],
            backgroundColor: ['#3B82F6', '#EC4899', '#8B5CF6'],
            borderWidth: 2,
            hoverOffset: 15,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: true },
    });
  }

  // Helper
  getGenderCount(gender: string): number {
    return this.employees.filter((e) => e.gender?.toLowerCase() === gender.toLowerCase()).length;
  }

  // Department Chart
  private buildDepartmentChart() {
    const deptMap: Record<string, number> = {};
    this.employees.forEach((emp) => {
      const dept = emp.department || 'Unknown';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    this.departmentChart = new Chart('departmentChartCanvas', {
      type: 'bar',
      data: {
        labels: Object.keys(deptMap),
        datasets: [
          {
            label: 'Employees',
            data: Object.values(deptMap),
            backgroundColor: 'rgba(34, 197, 94, 0.7)',
            borderColor: '#22C55E',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
      },
    });
  }

  // Salary Chart
  private buildSalaryChart() {
    const salaries = this.employees.map((e) => e.salary).filter((s) => typeof s === 'number');

    const ranges = ['0-20k', '20k-40k', '40k-60k', '60k-80k', '80k-100k', '100k+'];
    const counts = [0, 0, 0, 0, 0, 0];

    salaries.forEach((s) => {
      if (s <= 20000) counts[0]++;
      else if (s <= 40000) counts[1]++;
      else if (s <= 60000) counts[2]++;
      else if (s <= 80000) counts[3]++;
      else if (s <= 100000) counts[4]++;
      else counts[5]++;
    });

    this.salaryChart = new Chart('salaryChartCanvas', {
      type: 'line',
      data: {
        labels: ranges,
        datasets: [
          {
            label: 'Number of Employees',
            data: counts,
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
      },
    });
  }

  getUniqueDepartments(): string[] {
    return Array.from(new Set(this.employees.map((emp) => emp.department))).filter(Boolean);
  }

  // Destroy charts
  private destroyCharts() {
    this.genderChart?.destroy();
    this.departmentChart?.destroy();
    this.salaryChart?.destroy();
    this.genderChart = null;
    this.departmentChart = null;
    this.salaryChart = null;
  }
}
