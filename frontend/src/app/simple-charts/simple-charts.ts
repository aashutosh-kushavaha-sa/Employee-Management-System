import { Component, OnInit, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { SidebarComponent } from "../sidebar/sidebar";
import { Employee } from '../../app/interfaces/employee.interface';

@Component({
  selector: 'app-analytics-charts',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './simple-charts.html',
  styleUrls: ['./simple-charts.css']
})
export class AnalyticsChartsComponent implements OnInit, AfterViewInit, OnDestroy {

  employees: Employee[] = [];
  isLoading = false;
  hasError = false;

  genderChart: Chart | null = null;
  departmentChart: Chart | null = null;
  salaryChart: Chart | null = null;

  private http = inject(HttpClient);

  ngOnInit() {
    this.loadEmployeeData();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.destroyCharts();
  }

  // ========================
  // Load employee data
  // ========================
  loadEmployeeData() {
    this.isLoading = true;
    this.hasError = false;

    const token = localStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      Authorization: token
    });

    this.http.get<Employee[]>('http://localhost:3000/api/employee/getall', { headers })
      .subscribe({
        next: (res: Employee[]) => {
          this.employees = res;
          this.isLoading = false;

          // build charts after view ready
          setTimeout(() => this.buildCharts(), 100);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching employee data:', error);
          this.isLoading = false;
          this.hasError = true;
          this.employees = [];
        }
      });
  }

  // ========================
  // Chart Builders
  // ========================
  buildCharts() {
    if (this.employees.length === 0) return;

    this.destroyCharts();

    this.buildGenderChart();
    this.buildDepartmentChart();
    this.buildSalaryChart();
  }

  // GENDER PIE CHART
  private buildGenderChart() {
    const male = this.getGenderCount('male');
    const female = this.getGenderCount('female');
    const other = this.getGenderCount('other');

    this.genderChart = new Chart("genderChartCanvas", {
      type: 'pie',
      data: {
        labels: ['Male', 'Female', 'Other'],
        datasets: [{
          data: [male, female, other],
          backgroundColor: ['#3B82F6', '#EC4899', '#8B5CF6'],
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 2,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#E2E8F0',
              font: { size: 12 },
              padding: 20
            }
          }
        }
      }
    });
  }

  // DEPARTMENT BAR CHART
  private buildDepartmentChart() {
    const deptMap: Record<string, number> = {};

    this.employees.forEach(emp => {
      const dept = emp.department || 'Unknown';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    const departments = Object.keys(deptMap);
    const counts = Object.values(deptMap);

    this.departmentChart = new Chart("departmentChartCanvas", {
      type: 'bar',
      data: {
        labels: departments,
        datasets: [{
          label: 'Employees',
          data: counts,
          backgroundColor: 'rgba(34, 197, 94, 0.7)',
          borderColor: '#22C55E',
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: {
              color: '#E2E8F0',
              font: { size: 11 }
            },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#E2E8F0', stepSize: 1 },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          }
        }
      }
    });
  }

  // SALARY DISTRIBUTION CHART (salary = number)
  private buildSalaryChart() {
    const salaries = this.employees
      .map(e => Number(e.salary) || 0)
      .filter(salary => salary > 0);

    const ranges = ['0-20k', '20k-40k', '40k-60k', '60k-80k', '80k-100k', '100k+'];
    const rangeCounts = [0, 0, 0, 0, 0, 0];

    salaries.forEach(salary => {
      if (salary <= 20000) rangeCounts[0]++;
      else if (salary <= 40000) rangeCounts[1]++;
      else if (salary <= 60000) rangeCounts[2]++;
      else if (salary <= 80000) rangeCounts[3]++;
      else if (salary <= 100000) rangeCounts[4]++;
      else rangeCounts[5]++;
    });

    this.salaryChart = new Chart("salaryChartCanvas", {
      type: 'line',
      data: {
        labels: ranges,
        datasets: [{
          label: 'Number of Employees',
          data: rangeCounts,
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#F59E0B',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: { color: '#E2E8F0' }
          }
        },
        scales: {
          x: {
            ticks: { color: '#E2E8F0' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#E2E8F0', stepSize: 1 },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          }
        }
      }
    });
  }

  // ========================
  // Helpers
  // ========================
  getGenderCount(gender: string): number {
    return this.employees.filter(e =>
      e.gender?.toLowerCase() === gender.toLowerCase()
    ).length;
  }

  getUniqueDepartments(): string[] {
    return Array.from(new Set(this.employees.map(emp => emp.department))).filter(Boolean);
  }

  private destroyCharts() {
    if (this.genderChart) { this.genderChart.destroy(); this.genderChart = null; }
    if (this.departmentChart) { this.departmentChart.destroy(); this.departmentChart = null; }
    if (this.salaryChart) { this.salaryChart.destroy(); this.salaryChart = null; }
  }
}
