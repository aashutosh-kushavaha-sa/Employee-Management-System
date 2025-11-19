import { Routes } from '@angular/router';
import { Login } from './login/login';
import { SignUpComponent } from './sign-up/sign-up';
import { DashboardComponent } from './dashboard/dashboard';

export const routes: Routes = [
  {
    path : 'login',
    component : Login
  },
  {
    path : 'signup',
    component : SignUpComponent
  },
  {
    path : 'dashboard',
    component : DashboardComponent
  },
  {
    path : '**',
    component : Login
  }
];
