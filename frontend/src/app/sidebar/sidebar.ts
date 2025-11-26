import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faHouse,
  faUsers,
  faGear,
  faRightFromBracket,
  faUserTie,
  faList,
  faPlus,
  faCircleArrowDown,
  faPersonCirclePlus,
  faPersonCircleMinus,
  faUserPen,
  faUsersGear
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  imports: [CommonModule, RouterModule, FontAwesomeModule],
})
export class SidebarComponent {
  // Icons
  faHouse = faHouse;
  faUsers = faUsers;
  faGear = faGear;
  faLogout = faRightFromBracket;
  userTie = faUserTie;
  faList = faList;
  faPlus = faPlus;
  faArrowDown = faCircleArrowDown;
  faAddEmp = faPersonCirclePlus;
  faDeleteEmp = faPersonCircleMinus;
  faUpdate = faUserPen;
  faManageEmp = faUsersGear;

  // Accordion state
  employeesOpen = false;

  constructor(private router: Router) {}

  toggleEmployees() {
    this.employeesOpen = !this.employeesOpen;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
