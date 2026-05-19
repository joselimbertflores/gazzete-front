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

interface PublicNavItem {
  readonly label: string;
  readonly href: string;
  readonly exact: boolean;
  readonly icon: string;
  readonly fragment?: string;
}

@Component({
  selector: 'public-navbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav
      class="relative border-b border-surface-200/90 bg-surface-0/95 supports-backdrop-filter:bg-surface-0/80 backdrop-blur-sm"
      aria-label="Navegación principal"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between gap-4">
          <a
            routerLink="/"
            class="flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary-600 sm:gap-3"
            (click)="closeMenu()"
            aria-label="Ir al inicio de la Gaceta Municipal"
          >
            <img
              src="/images/branding/escudo-municipal-48.png"
              alt="Escudo del Gobierno Autónomo Municipal de Sacaba"
              class="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
            />

            <div class="min-w-0 leading-tight">
              <p
                class="hidden truncate text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-surface-500 lg:block"
              >
                Gobierno Autónomo Municipal de Sacaba
              </p>

              <p class="text-sm font-semibold tracking-tight text-surface-950 sm:hidden">Gaceta</p>

              <p
                class="hidden text-sm font-semibold tracking-tight text-surface-950 sm:block sm:text-base"
              >
                Gaceta Municipal de Sacaba
              </p>
            </div>
          </a>

          <ul class="hidden items-center gap-1 md:flex">
            @for (item of navItems; track item.label) {
              <li>
                <a
                  [routerLink]="item.href"
                  [fragment]="item.fragment"
                  [attr.aria-current]="isItemActive(item) ? 'page' : null"
                  [class]="
                    isItemActive(item)
                      ? 'inline-flex items-center rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition'
                      : 'inline-flex items-center rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-surface-700 transition hover:border-surface-200 hover:bg-surface-100 hover:text-surface-950'
                  "
                >
                  {{ item.label }}
                </a>
              </li>
            }
          </ul>

          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-surface-300 bg-surface-0 text-surface-700 transition hover:bg-surface-100 md:hidden"
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

      @if (menuOpen()) {
        <button
          type="button"
          class="fixed inset-0 top-16 z-40 bg-surface-950/25 md:hidden"
          aria-label="Cerrar menú de navegación"
          (click)="closeMenu()"
        ></button>

        <div
          id="public-mobile-menu"
          class="absolute inset-x-0 top-full z-50 border-t border-surface-200 bg-surface-0 shadow-lg md:hidden"
        >
          <div class="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <ul class="flex flex-col gap-1.5">
              @for (item of navItems; track item.label) {
                <li>
                  <a
                    [routerLink]="item.href"
                    [fragment]="item.fragment"
                    [attr.aria-current]="isItemActive(item) ? 'page' : null"
                    [class]="
                      isItemActive(item)
                        ? 'inline-flex w-full items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-700'
                        : 'inline-flex w-full items-center gap-2 rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-surface-700 transition hover:border-surface-200 hover:bg-surface-100 hover:text-surface-950'
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
    { label: 'Documentos', href: '/documents', exact: false, icon: 'pi pi-file' },
    {
      label: 'Normativas',
      href: '/',
      exact: true,
      icon: 'pi pi-book',
      fragment: 'normativas',
    },
    { label: 'Ayuda', href: '/', exact: true, icon: 'pi pi-question-circle', fragment: 'ayuda' },
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
    const expectedUrl = item.fragment ? `${item.href}#${item.fragment}` : item.href;

    if (!item.exact) {
      return activeUrl.startsWith(expectedUrl);
    }

    return activeUrl === expectedUrl;
  }
}
