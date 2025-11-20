import { Routes } from '@angular/router';
import { Login } from './login/login';
import { SignUpComponent } from './sign-up/sign-up';
import { DashboardComponent } from './dashboard/dashboard';
import { Pagenotfound } from './pagenotfound/pagenotfound';
import { All } from './employee/all/all';
import { Add } from './employee/add/add';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path:'employees/all',
    component : All
  },
  {
    path:'employees/add',
    component : Add
  },
  {
    path: '**',
    component: Pagenotfound
  }
];

