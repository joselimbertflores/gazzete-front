import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthUser } from './auth.types';

const AUTH_CHANNEL_NAME = 'gazette-auth';

interface AuthChannelMessage {
  type: 'logout';
}

@Injectable({
  providedIn: 'root',
})
export class AuthDataSource {
  private readonly URL = `${environment.baseUrl}`;

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authChannel = new BroadcastChannel(AUTH_CHANNEL_NAME);

  private _user = signal<AuthUser | null>(null);
  user = computed(() => this._user());

  constructor() {
    this.authChannel.addEventListener('message', this.handleAuthMessage);
    this.destroyRef.onDestroy(() => {
      this.authChannel.removeEventListener('message', this.handleAuthMessage);
      this.authChannel.close();
    });
  }

  logout() {
    return this.http.post(`${this.URL}/api/auth/logout`, {}).pipe(
      tap(() => {
        this.clearUser();
        this.authChannel.postMessage({ type: 'logout' } satisfies AuthChannelMessage);
      }),
    );
  }

  checkAuthStatus() {
    return this.http.get<{ user: AuthUser }>(`${this.URL}/api/auth/me`).pipe(
      tap(({ user }) => this._user.set(user)),
      map(() => true),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.clearUser();
          return of(false);
        }

        return throwError(() => error);
      }),
    );
  }

  private clearUser(): void {
    this._user.set(null);
  }

  private readonly handleAuthMessage = (event: MessageEvent<unknown>): void => {
    const message = event.data as Partial<AuthChannelMessage> | null;
    if (message?.type !== 'logout') return;

    this.clearUser();
    void this.router.navigate(['/'], { replaceUrl: true });
  };
}
