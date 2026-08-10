import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { ThemeToggle } from '../../../../../../shared';
import { InstitutionalLogo } from '../institutional-logo/institutional-logo';

interface PublicNavItem {
  readonly label: string;
  readonly href: string;
  readonly exact: boolean;
  readonly icon: string;
}

@Component({
  selector: 'public-navbar',
  standalone: true,
  imports: [RouterModule, InstitutionalLogo, ThemeToggle],
  host: { class: 'block' },
  template: `
    <nav
      class="relative border-b border-primary-800/80 bg-primary-950 text-surface-0 shadow-lg shadow-primary-950/20"
      aria-label="Navegación principal"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between gap-4 py-2.5">
          <a
            routerLink="/"
            class="flex min-w-0 items-center gap-3.5 rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-300 sm:gap-4"
            (click)="closeMenu()"
            aria-label="Ir al inicio de la Gaceta Municipal"
          >
            <institutional-logo tone="inverse" />

            <div class="min-w-0 leading-tight">
              <p class="truncate text-lg font-semibold tracking-tight text-surface-0 sm:text-xl">
                Gaceta Municipal
              </p>

              <p
                class="hidden max-w-64 truncate text-xs font-medium text-primary-100 sm:block lg:max-w-none"
              >
                Gobierno Autónomo Municipal de Sacaba
              </p>
            </div>
          </a>

          <ul class="ml-auto hidden items-center gap-1.5 md:flex">
            @for (item of navItems; track item.label) {
              <li>
                <a
                  [routerLink]="item.href"
                  [attr.aria-current]="isItemActive(item) ? 'page' : null"
                  [class]="
                    isItemActive(item)
                      ? 'inline-flex items-center gap-2 rounded-lg bg-primary-800 px-4 py-2.5 text-[0.95rem] font-semibold text-surface-0 shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300'
                      : 'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[0.95rem] font-semibold text-primary-100 transition hover:bg-surface-0/10 hover:text-surface-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300'
                  "
                >
                  <i [class]="item.icon + ' text-[0.8rem] leading-none'" aria-hidden="true"></i>
                  {{ item.label }}
                </a>
              </li>
            }
          </ul>

          <div class="flex shrink-0 items-center gap-2">
            <app-theme-toggle tone="inverse" />

            <button
              type="button"
              class="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-surface-0/15 bg-surface-0/5 text-surface-0 transition hover:bg-surface-0/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300 md:hidden"
              [attr.aria-expanded]="menuOpen()"
              aria-controls="public-mobile-menu"
              [attr.aria-label]="
                menuOpen() ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
              "
              (click)="toggleMenu()"
            >
              <i [class]="menuOpen() ? 'pi pi-times' : 'pi pi-bars'" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      @if (menuOpen()) {
        <div id="public-mobile-menu" class="absolute inset-x-0 top-full z-40 w-full md:hidden">
          <div
            class="w-full border-t border-primary-800/70 bg-primary-950 px-4 py-2 shadow-lg shadow-primary-950/20 sm:px-6"
          >
            <ul class="grid gap-1">
              @for (item of navItems; track item.label) {
                <li>
                  <a
                    [routerLink]="item.href"
                    [attr.aria-current]="isItemActive(item) ? 'page' : null"
                    [class]="
                      isItemActive(item)
                        ? 'inline-flex w-full items-center gap-3 rounded-lg bg-primary-800 px-3.5 py-2.5 text-sm font-semibold text-surface-0 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent-300'
                        : 'inline-flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-primary-100 transition hover:bg-surface-0/10 hover:text-surface-0 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent-300'
                    "
                    (click)="closeMenu()"
                  >
                    <i [class]="item.icon" aria-hidden="true"></i>
                    <span>{{ item.label }}</span>
                  </a>
                </li>
              }
            </ul>
          </div>
        </div>
      }
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicNavbar {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly menuOpen = signal(false);
  readonly activeUrl = signal(this.router.url);
  readonly navItems: PublicNavItem[] = [
    { label: 'Inicio', href: '/', exact: true, icon: 'pi pi-home' },
    { label: 'Normativas', href: '/normativas', exact: false, icon: 'pi pi-book' },
  ];

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.activeUrl.set(event.urlAfterRedirects);
        this.closeMenu();
      });
  }

  toggleMenu(): void {
    this.menuOpen.update((value) => !value);
  }

  @HostListener('window:resize')
  handleResize(): void {
    if (window.innerWidth >= 768 && this.menuOpen()) {
      this.closeMenu();
    }
  }

  @HostListener('window:keydown.escape')
  handleEscape(): void {
    if (this.menuOpen()) {
      this.closeMenu();
    }
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  isItemActive(item: PublicNavItem): boolean {
    const activeUrl = this.activeUrl();

    if (!item.exact) {
      return activeUrl.startsWith(item.href);
    }

    return activeUrl === item.href;
  }
}
