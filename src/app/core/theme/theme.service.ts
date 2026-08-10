import { DOCUMENT } from '@angular/common';
import { afterNextRender, computed, inject, Injectable, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

const DARK_THEME_CLASS = 'app-dark';
const THEME_STORAGE_KEY = 'gaceta-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly currentTheme = signal<AppTheme>('light');

  readonly theme = this.currentTheme.asReadonly();
  readonly isDark = computed(() => this.currentTheme() === 'dark');

  constructor() {
    // Angular no ejecuta afterNextRender durante SSR. El script mínimo del <head>
    // ya aplicó la clase antes del primer paint; aquí sólo sincronizamos el signal.
    afterNextRender(() => {
      const theme = this.document.documentElement.classList.contains(DARK_THEME_CLASS)
        ? 'dark'
        : 'light';

      this.currentTheme.set(theme);
    });
  }

  toggle(): void {
    const theme: AppTheme = this.isDark() ? 'light' : 'dark';

    this.currentTheme.set(theme);
    this.document.documentElement.classList.toggle(DARK_THEME_CLASS, theme === 'dark');
    this.persist(theme);
  }

  private persist(theme: AppTheme): void {
    try {
      this.document.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // El theme sigue funcionando aunque el navegador bloquee el almacenamiento.
    }
  }
}
