import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, of, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthUser } from './auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthDataSource {
  private readonly URL = `${environment.baseUrl}`;

  private http = inject(HttpClient);

  private _user = signal<AuthUser | null>(null);
  user = computed(() => this._user());

  logout() {
    return this.http.post(`${this.URL}/api/auth/logout`, {}).pipe(tap(() => this._user.set(null)));
  }

  checkAuthStatus() {
    return this.http.get<{ user: AuthUser }>(`${this.URL}/api/auth/me`).pipe(
      tap(({ user }) => this._user.set(user)),
      map(() => true),
      catchError((error: unknown) =>
        error instanceof HttpErrorResponse && error.status === 401
          ? of(false)
          : throwError(() => error),
      ),
    );
  }
}
