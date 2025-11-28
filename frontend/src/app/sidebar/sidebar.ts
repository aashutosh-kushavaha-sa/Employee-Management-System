import { Component, ViewChild } from '@angular/core';
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
  faUsersGear
} from '@fortawesome/free-solid-svg-icons';

import { LogoutModalComponent } from "../modal/logout-modal/logout-modal";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  imports: [CommonModule, RouterModule, FontAwesomeModule, LogoutModalComponent],
})
export class SidebarComponent {

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
  sidebarOpen = true;

  constructor(private router: Router) {}

  // Get reference to logout modal
  @ViewChild(LogoutModalComponent) logoutModal!: LogoutModalComponent;

  toggleEmployees() {
    this.employeesOpen = !this.employeesOpen;
  }

  onNavClick() {
    if (window.innerWidth < 1024) {
      this.sidebarOpen = false;
    }
  }

  // Open logout confirmation modal
  openLogoutModal() {
    if (this.logoutModal) {
      this.logoutModal.show();
      // Close sidebar on mobile when opening modal
      if (window.innerWidth < 1024) {
        this.sidebarOpen = false;
      }
    }
  }

  // Final logout logic called from modal
  logoutNow() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}