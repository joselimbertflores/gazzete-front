import { RedirectCommand, Router, type CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

import { AuthDataSource } from '../auth-data-source';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authDataSource = inject(AuthDataSource);

  const user = authDataSource.user();

  const requiredRole = route.data['role'];
  if (!requiredRole) return true;

  const hasPermission = user?.roles.some((role) => role === requiredRole);

  if (!hasPermission) return new RedirectCommand(router.parseUrl('/admin'));

  return true;
};
