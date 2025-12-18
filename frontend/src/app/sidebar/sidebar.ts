import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faHouse,
  faRightFromBracket,
  faUserTie,
  faList,
  faCircleArrowDown,
  faPersonCirclePlus,
  faBars,
  faChartArea,
  faUsersGear,
} from '@fortawesome/free-solid-svg-icons';

import { LogoutModalComponent } from '../modal/logout-modal/logout-modal';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  imports: [CommonModule, RouterModule, FontAwesomeModule, LogoutModalComponent],
})
export class SidebarComponent {
  private router = inject(Router);

  // ICONS
  faHouse = faHouse;
  faLogout = faRightFromBracket;
  userTie = faUserTie;
  faList = faList;
  faArrowDown = faCircleArrowDown;
  faAddEmp = faPersonCirclePlus;
  faManageEmp = faUsersGear;
  faBars = faBars;
  faChartArea = faChartArea;

  employeesOpen = false;

  // compatibility constructor removed by migration

  // Modal reference
  @ViewChild(LogoutModalComponent) logoutModal!: LogoutModalComponent;

  toggleEmployees() {
    this.employeesOpen = !this.employeesOpen;
  }

  // No sidebar open/close logic anymore
  onNavClick() {
    return; // Removed mobile collapse logic
  }

  openLogoutModal() {
    if (this.logoutModal) {
      this.logoutModal.show();
    }
  }

  logoutNow() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
