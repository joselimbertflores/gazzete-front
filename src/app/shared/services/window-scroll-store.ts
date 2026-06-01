import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class WindowScrollStore {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly positions = new Map<string, number>();

  private currentUrl: string | null = null;
  private isPopState = false;

  constructor() {
    if (!this.isBrowser) return;
    this.init();
  }

  /**
   * Restaura el scroll SOLO si:
   * - venimos de un back (popstate)
   * - hay una posición guardada
   * - el componente ya decidió que es el momento correcto
   */
  restoreScroll(url: string): boolean {
    if (!this.isBrowser) return false;
    if (!this.isPopState) return false;

    const key = this.toKey(url);
    const scrollY = this.positions.get(key);

    // Remover data para evitar que algun effect de RxResource siga restableciendo scroll cuando paginacion cambia
    this.positions.delete(key);

    if (scrollY == null || scrollY <= 0) return false;

    window.scrollTo({ top: scrollY, behavior: 'auto' });
    return true;
  }

  private init(): void {
    if (!this.isBrowser) return;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isPopState = event.navigationTrigger === 'popstate';

        if (this.currentUrl) {
          const scrollY = window.scrollY;

          if (scrollY > 0) {
            this.positions.set(this.currentUrl, scrollY);
          }
        }
      }

      if (event instanceof NavigationEnd) {
        this.currentUrl = this.toKey(event.urlAfterRedirects);
      }
    });
  }

  private toKey(url: string): string {
    return url.split('#')[0];
  }
}
