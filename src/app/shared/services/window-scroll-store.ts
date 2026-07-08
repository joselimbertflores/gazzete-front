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
   * Restaura la posición guardada del window scroll.
   *
   * Este método NO se ejecuta automáticamente en NavigationEnd porque muchos
   * listados cargan data async. Si se restaura demasiado pronto, el DOM todavía
   * no tiene altura suficiente y el scroll queda mal.
   *
   * Por eso el componente llama a este método cuando ya terminó de cargar y
   * renderizar su data.
   *
   * Devuelve true si restauró una posición.
   *
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
    /**
     * Se borra después de leerla para evitar restauraciones repetidas en
     * afterRenderEffect(), cambios de paginación, filtros o renders posteriores.
     */
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

        /**
         * Antes de salir de la ruta actual, guardamos el scroll actual.
         * Ejemplo: listado -> detalle.
         *
         * Luego, si el usuario vuelve con Back, el listado podrá restaurar
         * esta posición cuando su data ya esté lista.
         */
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
