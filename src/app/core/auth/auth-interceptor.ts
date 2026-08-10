import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  const isPublicRequest = req.url.includes('/api/public-documents');
  const request = isPublicRequest ? req : req.clone({ withCredentials: true });

  return next(request).pipe(
    catchError((error: unknown) => {
      if (
        isBrowser &&
        !isPublicRequest &&
        error instanceof HttpErrorResponse &&
        error.status === 401
      ) {
        window.location.href = `${environment.baseUrl}/auth/login`;
      }

      return throwError(() => error);
    }),
  );
};
