import { Routes } from '@angular/router';
import { isAuthenticatedGuard, roleGuard } from './core/auth/guards';
import { UserRole } from './core/auth/auth.types';

export const routes: Routes = [
  {
    path: 'admin',
    canActivateChild: [isAuthenticatedGuard],
    title: 'Administracion',
    loadComponent: () =>
      import('./features/administration/layout/admin-layout/admin-layout.component'),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/administration/workspace/pages/admin-home-page/admin-home-page'),
      },
      {
        data: { role: UserRole.USER },
        canActivate: [roleGuard],
        path: 'documents',
        loadComponent: () =>
          import('./features/administration/documents/pages/documents-admin/documents-admin'),
      },
      {
        data: { role: UserRole.ADMIN },
        canActivate: [roleGuard],
        path: 'document-types',
        loadComponent: () =>
          import('./features/administration/documents/pages/document-types-admin/document-types-admin'),
      },
      {
        path: 'users',
        data: { role: UserRole.ADMIN },
        canActivate: [roleGuard],
        loadComponent: () => import('./features/administration/users/pages/user-admin/user-admin'),
      },
      {
        path: '**',
        redirectTo: '',
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
        title: 'Inicio',
        loadComponent: () => import('./features/public/pages/landing-page/landing-page'),
      },
      {
        title: 'Normativa',
        path: 'documents',
        loadComponent: () => import('./features/public/pages/documents-page/documents-page'),
      },
      {
        title: 'Detalle',
        path: 'documents/:id',
        loadComponent: () => import('./features/public/pages/document-detail/document-detail'),
      },
    ],
  },
];
