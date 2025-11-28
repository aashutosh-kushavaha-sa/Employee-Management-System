import { Routes } from '@angular/router';
import { Login } from './login/login';
import { SignUpComponent } from './sign-up/sign-up';
import { DashboardComponent } from './dashboard/dashboard';
import { Pagenotfound } from './pagenotfound/pagenotfound';
import { All } from './employee/all/all';
import { Add } from './employee/add/add';
import { AuthGuard } from './guard/auth-guard';
import { Chart } from 'chart.js';
import { AnalyticsChartsComponent } from './simple-charts/simple-charts';

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
    component: SignUpComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'employees/all',
    component : All,
    canActivate: [AuthGuard]
  },
  {
    path:'employees/add',
    component : Add,
    canActivate: [AuthGuard]
  },
  {
    path:'chart',
    component : AnalyticsChartsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: Pagenotfound
  }
];

