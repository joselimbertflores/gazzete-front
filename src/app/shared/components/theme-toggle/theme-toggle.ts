import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ThemeService } from '../../../core/theme/theme.service';

type ThemeToggleTone = 'surface' | 'inverse';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [attr.aria-label]="theme.isDark() ? 'Activar modo claro' : 'Activar modo oscuro'"
      [attr.title]="theme.isDark() ? 'Activar modo claro' : 'Activar modo oscuro'"
      (click)="theme.toggle()"
    >
      <i [class]="theme.isDark() ? 'pi pi-sun' : 'pi pi-moon'" aria-hidden="true"></i>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  readonly tone = input<ThemeToggleTone>('surface');
  readonly theme = inject(ThemeService);

  readonly buttonClasses = computed(() =>
    this.tone() === 'inverse'
      ? 'inline-flex h-10 w-10 items-center justify-center rounded-lg border border-surface-0/15 bg-surface-0/5 text-surface-0 transition-[background-color,border-color,color] duration-200 ease-out hover:border-accent-300/60 hover:bg-surface-0/10 hover:text-accent-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300'
      : 'text-color inline-flex h-10 w-10 items-center justify-center rounded-lg border border-surface bg-[var(--p-content-background)] shadow-sm transition-[background-color,border-color,color,box-shadow] duration-200 ease-out hover:bg-emphasis hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-primary-color)]',
  );
}
