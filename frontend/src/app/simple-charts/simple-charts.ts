import { Component, OnInit, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { SidebarComponent } from "../sidebar/sidebar";
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-analytics-charts',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './simple-charts.html',
  styleUrls: ['./simple-charts.css']
})
export class AnalyticsChartsComponent implements OnInit, AfterViewInit, OnDestroy {

  employees: any[] = [];
  isLoading: boolean = false;
  hasError: boolean = false;

  // Chart instances
  genderChart: any;
  departmentChart: any;
  salaryChart: any;

  private http = inject(HttpClient);

  ngOnInit() {
    this.loadEmployeeData();
  }

  ngAfterViewInit() {
    // Charts will be built when data loads
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  // Load employee data from API
  loadEmployeeData() {
    this.isLoading = true;
    this.hasError = false;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token || ''
    });

    this.http.get(`${environment.apiUrl}/api/employee/getall`, { headers })
      .subscribe({
        next: (res: any) => {
          this.employees = res;
          this.isLoading = false;
          setTimeout(() => this.buildCharts(), 100); // Small delay to ensure DOM is ready
        },
        error: (error) => {
          console.error('Error fetching employee data:', error);
          this.isLoading = false;
          this.hasError = true;
          this.employees = [];
        }
      });
  }

  // Build all charts
  buildCharts() {
    if (this.employees.length === 0) return;

    // Destroy old charts
    this.destroyCharts();

    this.buildGenderChart();
    this.buildDepartmentChart();
    this.buildSalaryChart();
  }

  // Gender Pie Chart
  private buildGenderChart() {
    const male = this.employees.filter(e => e.gender?.toLowerCase() === 'male').length;
    const female = this.employees.filter(e => e.gender?.toLowerCase() === 'female').length;
    const other = this.employees.filter(e => e.gender?.toLowerCase() === 'other').length;

    this.genderChart = new Chart("genderChartCanvas", {
      type: 'pie',
      data: {
        labels: ['Male', 'Female', 'Other'],
        datasets: [{
          data: [male, female, other],
          backgroundColor: [
            '#3B82F6', // Blue
            '#EC4899', // Pink
            '#8B5CF6'  // Purple
          ],
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
              font: {
                size: 12,
                // weight: '500'
              },
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#F1F5F9',
            bodyColor: '#E2E8F9',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1
          }
        }
      }
    });
  }

  // Department Bar Chart
  private buildDepartmentChart() {
    const deptMap: { [key: string]: number } = {};
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
          borderRadius: 8,
          hoverBackgroundColor: 'rgba(34, 197, 94, 0.9)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#F1F5F9',
            bodyColor: '#E2E8F9'
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#E2E8F0',
              font: {
                size: 11
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#E2E8F0',
              stepSize: 1
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });
  }

  // Salary Distribution Line Chart
  private buildSalaryChart() {
    const salaries = this.employees.map(e => {
      if (typeof e.salary === 'string') {
        return parseInt(e.salary.replace('₹', '').replace(/,/g, '')) || 0;
      }
      return e.salary || 0;
    }).filter(salary => salary > 0);

    // Create salary ranges
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
            labels: {
              color: '#E2E8F0'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#F1F5F9',
            bodyColor: '#E2E8F9'
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#E2E8F0'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#E2E8F0',
              stepSize: 1
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });
  }

  // Helper methods
  getGenderCount(gender: string): number {
    return this.employees.filter(e => e.gender?.toLowerCase() === gender.toLowerCase()).length;
  }

  getUniqueDepartments(): string[] {
    const departments = new Set(this.employees.map(emp => emp.department));
    return Array.from(departments).filter(dept => dept);
  }

  // Destroy charts to prevent memory leaks
  private destroyCharts() {
    if (this.genderChart) {
      this.genderChart.destroy();
      this.genderChart = null;
    }
    if (this.departmentChart) {
      this.departmentChart.destroy();
      this.departmentChart = null;
    }
    if (this.salaryChart) {
      this.salaryChart.destroy();
      this.salaryChart = null;
    }
  }
}