import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'landing-quick-access-section',
  imports: [RouterLink],
  template: `
    <section class="border-y border-surface-200/70 bg-surface-0">
      <div class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div class="rounded-2xl border border-surface-200 bg-surface-50 p-5 sm:p-6">
          <div>
            <h2 class="text-xl font-semibold tracking-tight text-surface-950">
              Filtros frecuentes
            </h2>
            <p class="mt-1.5 text-sm text-surface-600">
              Atajos para consultas recurrentes por estado legal y periodo de gestión.
            </p>
          </div>

          <div class="mt-4 flex flex-wrap gap-2.5">
            @for (chip of quickChips; track chip.label; let i = $index) {
              <a
                routerLink="/normativas"
                [queryParams]="chip.queryParams"
                [class]="
                  i === 0
                    ? 'inline-flex min-h-10 items-center justify-center rounded-full border border-primary-600 bg-primary-600 px-3.5 py-2 text-sm font-semibold text-primary-50 transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                    : i === 1
                      ? 'inline-flex min-h-10 items-center justify-center rounded-full border border-primary-300 bg-primary-50 px-3.5 py-2 text-sm font-medium text-primary-800 transition hover:border-primary-400 hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                      : 'inline-flex min-h-10 items-center justify-center rounded-full border border-surface-300 bg-surface-0 px-3.5 py-2 text-sm font-medium text-surface-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                "
              >
                {{ chip.label }}
              </a>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingQuickAccessSection {
  readonly currentYear = new Date().getFullYear();

  readonly quickChips = [
    { label: 'Todos los documentos', queryParams: {} },
    { label: 'Vigentes', queryParams: { legalStatus: 'VALID' } },
    { label: `Gestión ${this.currentYear}`, queryParams: { year: this.currentYear } },
    { label: `Gestión ${this.currentYear - 1}`, queryParams: { year: this.currentYear - 1 } },
    { label: 'Abrogadas', queryParams: { legalStatus: 'ABROGATED' } },
  ];
}
