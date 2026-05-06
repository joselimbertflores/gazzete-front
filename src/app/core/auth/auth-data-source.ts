import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';

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

  constructor() {}

  login(login: string, password: string, remember: boolean = false) {
    if (remember) {
      localStorage.setItem('login', login);
    } else {
      localStorage.removeItem('login');
    }
    return this.http.post(`${this.URL}/auth/login`, { login, password }, { withCredentials: true });
  }

  logout() {
    return this.http
      .post(`${this.URL}/api/auth/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this._user.set(null)));
  }

  checkAuthStatus() {
    return this.http.get<{ user: AuthUser }>(`${this.URL}/api/auth/me`, { withCredentials: true }).pipe(
      tap(({ user }) => this._user.set(user)),
      map(() => true),
      catchError(() => {
        return of(false);
      }),
    );
  }
}
