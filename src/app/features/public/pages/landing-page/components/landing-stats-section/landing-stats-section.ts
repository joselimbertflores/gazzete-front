import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { LandingStatistic } from '../../../../types/landing-section.types';
import { LandingStats } from '../../../../types';

@Component({
  selector: 'app-landing-stats-section',
  standalone: true,
  imports: [],
  template: `
    <section class="bg-primary-50/35" aria-labelledby="stats-title">
      <div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
        <div class="max-w-2xl">
          <h2 id="stats-title" class="text-3xl font-bold tracking-tight text-surface-950 sm:text-4xl">
            Información disponible en la Gaceta
          </h2>
          <p class="mt-2 text-sm leading-6 text-surface-600">
            Alcance general del archivo normativo publicado para la ciudadanía.
          </p>
        </div>

        <dl class="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          @for (statistic of statistics(); track statistic.label) {
            <div
              class="rounded-xl border border-surface-200 bg-surface-0 p-4 shadow-sm shadow-surface-950/5 sm:p-5"
            >
              <dt class="flex items-center gap-2 text-sm font-medium text-surface-600">
                <span
                  class="h-2 w-2 rounded-full bg-primary-500"
                  aria-hidden="true"
                ></span>
                {{ statistic.label }}
              </dt>
              <dd class="mt-3 text-2xl font-bold tracking-tight text-surface-950 sm:text-3xl">
                {{ statistic.value }}
              </dd>
              <p class="mt-2 text-sm leading-6 text-surface-600">{{ statistic.description }}</p>
            </div>
          }
        </dl>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingStatsSection {
  readonly stats = input.required<LandingStats>();

  readonly statistics = computed(() => {
    const availableYearsStatistic = this.getAvailableYearsStatistic(this.stats());
    return [
      {
        label: 'Normativas publicadas',
        value: this.stats().totalPublishedDocuments.toString(),
        description: 'Registros normativos disponibles para consulta pública.',
      },
      ...(availableYearsStatistic ? [availableYearsStatistic] : []),
      {
        label: 'Gestión actual',
        value: this.stats().currentYearPublications.toString(),
        description: `Normativas incorporadas durante la gestión ${this.stats().currentYear}.`,
      },
      {
        label: 'Tipos de normativas',
        value: this.stats().documentTypesCount.toString(),
        description: 'Categorías principales de normativas municipales.',
      },
    ];
  });

  private getAvailableYearsStatistic(stats: LandingStats): LandingStatistic | null {
    const { min, max } = stats.availableYears;

    if (min === null || max === null || min > max) return null;

    return {
      label: 'Gestiones disponibles',
      value: min === max ? `${min}` : `${min}–${max}`,
      description: 'Archivo normativo organizado por gestión.',
    };
  }
}
