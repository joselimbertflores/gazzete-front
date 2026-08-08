import { inject } from '@angular/core';
import { type CanActivateFn } from '@angular/router';

import { AuthDataSource } from '../auth-data-source';

export const isAuthenticatedGuard: CanActivateFn = () => {
  const authDataSource = inject(AuthDataSource);
  return authDataSource.checkAuthStatus();
};
