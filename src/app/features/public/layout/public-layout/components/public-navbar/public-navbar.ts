import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'public-navbar',
  imports: [RouterModule],
  template: `
    <nav
      class="border-b border-surface-200/90 bg-surface-0/95 supports-[backdrop-filter]:bg-surface-0/80 backdrop-blur-sm"
      aria-label="Navegación principal"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between gap-4">
          <a
            routerLink="/"
            class="flex min-w-0 items-center gap-3 rounded-lg px-1 py-1 outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary-600"
            (click)="closeMenu()"
            aria-label="Ir al inicio de la Gaceta Municipal"
          >
            <img
              src="/images/branding/escudo-municipal-48.png"
              alt="Escudo del Gobierno Autónomo Municipal de Sacaba"
              class="h-10 w-10 shrink-0 object-contain"
            />

            <div class="min-w-0">
              <p
                class="hidden text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-surface-500 lg:block"
              >
                Gobierno Autónomo Municipal de Sacaba
              </p>

              <p class="text-sm font-semibold tracking-tight text-surface-950 sm:text-base">
                Gaceta Municipal Digital
              </p>
            </div>
          </a>

          <ul class="hidden items-center gap-1 md:flex">
            @for (item of navItems; track item.href) {
              <li>
                <a
                  [routerLink]="item.href"
                  routerLinkActive
                  #desktopRla="routerLinkActive"
                  [routerLinkActiveOptions]="{ exact: item.exact }"
                  [attr.aria-current]="desktopRla.isActive ? 'page' : null"
                  [class]="
                    desktopRla.isActive
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
            [attr.aria-label]="menuOpen() ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'"
            (click)="toggleMenu()"
          >
            <i [class]="menuOpen() ? 'pi pi-times' : 'pi pi-bars'" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      @if (menuOpen()) {
        <div
          id="public-mobile-menu"
          class="border-t border-surface-200 bg-surface-0 md:hidden"
        >
          <div class="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <ul class="flex flex-col gap-1.5">
              @for (item of navItems; track item.href) {
                <li>
                  <a
                    [routerLink]="item.href"
                    routerLinkActive
                    #mobileRla="routerLinkActive"
                    [routerLinkActiveOptions]="{ exact: item.exact }"
                    [attr.aria-current]="mobileRla.isActive ? 'page' : null"
                    [class]="
                      mobileRla.isActive
                        ? 'block rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-700'
                        : 'block rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-surface-700 transition hover:border-surface-200 hover:bg-surface-100 hover:text-surface-950'
                    "
                    (click)="closeMenu()"
                  >
                    {{ item.label }}
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
  readonly navItems = [
    { label: 'Inicio', href: '/', exact: true },
    { label: 'Documentos', href: '/documents', exact: false },
  ] as const;

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.closeMenu());
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

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
