import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'public-navbar',
  imports: [RouterModule],
  template: `
    <nav class="border-b border-surface-200 bg-surface-0">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-14 items-center justify-between gap-4 sm:h-16">
          <a
            routerLink="/"
            class="flex min-w-0 items-center gap-3 rounded-md outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-sky-700"
          >
            <img
              src="/images/branding/escudo-municipal-48.png"
              alt="Escudo del Gobierno Autónomo Municipal de Sacaba"
              class="h-10 w-10 shrink-0 object-contain sm:h-10 sm:w-10"
            />

            <div class="min-w-0">
              <p
                class="hidden text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500 md:block"
              >
                Gobierno Autónomo Municipal de Sacaba
              </p>

              <p class="text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
                Gaceta Municipal
              </p>
            </div>
          </a>

          <div class="hidden items-center gap-1 md:flex">
            <a
              routerLink="/"
              routerLinkActive="bg-slate-100 text-slate-950"
              [routerLinkActiveOptions]="{ exact: true }"
              class="rounded-md px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
            >
              Inicio
            </a>

            <a
              routerLink="/documents"
              routerLinkActive="bg-slate-100 text-slate-950"
              class="rounded-md px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
            >
              Documentos
            </a>
          </div>

          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
            [attr.aria-expanded]="menuOpen()"
            aria-controls="public-mobile-menu"
            aria-label="Abrir menú de navegación"
            (click)="toggleMenu()"
          >
            <i [class]="menuOpen() ? 'pi pi-times' : 'pi pi-bars'" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      @if (menuOpen()) {
        <div id="public-mobile-menu" class="border-t border-slate-200 bg-white md:hidden">
          <div class="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <div class="flex flex-col gap-1">
              <a
                routerLink="/"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLinkActive="bg-slate-100 text-slate-950"
                class="rounded-md px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                (click)="closeMenu()"
              >
                Inicio
              </a>

              <a
                routerLink="/documents"
                routerLinkActive="bg-slate-100 text-slate-950"
                class="rounded-md px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                (click)="closeMenu()"
              >
                Documentos
              </a>
            </div>
          </div>
        </div>
      }
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicNavbar {
  readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
