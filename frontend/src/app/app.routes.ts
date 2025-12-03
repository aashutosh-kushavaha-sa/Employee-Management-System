import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },

  {
    path: 'signup',
    loadComponent: () => import('./sign-up/sign-up').then((m) => m.SignUpComponent),
    canActivate: [AuthGuard],
  },

  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.DashboardComponent),
    canActivate: [AuthGuard],
  },

  {
    path: 'employees/all',
    loadComponent: () => import('./employee/all/all').then((m) => m.All),
    canActivate: [AuthGuard],
  },

  {
    path: 'employees/add',
    loadComponent: () => import('./employee/add/add').then((m) => m.Add),
    canActivate: [AuthGuard],
  },

  {
    path: 'chart',
    loadComponent: () =>
      import('./simple-charts/simple-charts').then((m) => m.AnalyticsChartsComponent),
    canActivate: [AuthGuard],
  },

  {
    path: '**',
    loadComponent: () => import('./pagenotfound/pagenotfound').then((m) => m.Pagenotfound),
  },
];
