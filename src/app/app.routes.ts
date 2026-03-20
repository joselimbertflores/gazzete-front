import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './core/auth/guards';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [isAuthenticatedGuard],
    title: 'Administracion',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component'),
    children: [
      {
        path: 'documents',
        loadComponent: () =>
          import('./features/administration/documents/pages/documents-admin/documents-admin'),
      },
    ],
  },
  {
    path: 'auth/error',
    loadComponent: () => import('./features/auth/pages/auth-error-page/auth-error-page'),
  },
  {
    path: '',
    loadComponent: () => import('./features/public/layout/public-layout/public-layout'),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/pages/landing-page/landing-page'),
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/public/pages/documents-page/documents-page'),
      },
    ],
  },
];
