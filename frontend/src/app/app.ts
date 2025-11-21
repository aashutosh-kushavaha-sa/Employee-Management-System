import { Component, signal } from '@angular/core';
import { SignUpComponent } from './sign-up/sign-up';
import { Login } from "./login/login";
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./sidebar/sidebar";
import { DashboardComponent } from "./dashboard/dashboard";
import { ModalComponent } from "./modal/alertModel/modal.component";
import { ConfirmModalComponent } from "./modal/confirm-model/confirm-modal";

@Component({
  selector: 'app-root',
  imports: [Login, SignUpComponent, RouterOutlet, RouterLink, SidebarComponent, DashboardComponent, ModalComponent, ConfirmModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
