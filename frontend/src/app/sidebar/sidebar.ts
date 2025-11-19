import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHouse,
  faUsers,
  faGear,
  faRightFromBracket,
  faUserTie,
  faList,
  faPlus,
  faArrowDown,
  faPersonCirclePlus,
  faPersonCircleMinus,
  faUserPen,
  faUsersGear
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class SidebarComponent {
  faHouse = faHouse;
  faUsers = faUsers;
  faGear = faGear;
  faLogout = faRightFromBracket;
  userTie = faUserTie;
  faList = faList;
  faPlus = faPlus;
  faArrowDown = faArrowDown;
  faAddEmp = faPersonCirclePlus;
  faDeleteEmp = faPersonCircleMinus;
  faUpdate = faUserPen;
  faManageEmp = faUsersGear;

  // Accordion state
  employeesOpen = false;

  toggleEmployees() {
    this.employeesOpen = !this.employeesOpen;
  }
}
