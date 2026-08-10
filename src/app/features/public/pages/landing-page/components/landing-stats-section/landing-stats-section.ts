import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { LandingStatistic } from '../../../../types/landing-section.types';
import { LandingStats } from '../../../../types';

@Component({
  selector: 'app-landing-stats-section',
  standalone: true,
  imports: [],
  template: `
    <section
      class="stats-section relative isolate overflow-hidden border-t border-primary-700 text-surface-0"
      aria-labelledby="stats-title"
    >
      <div
        class="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-accent-400 to-transparent"
        aria-hidden="true"
      ></div>

      <div class="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
        <div class="max-w-2xl">
          <h2 id="stats-title" class="text-3xl font-bold tracking-tight text-surface-0 sm:text-4xl">
            Información disponible en la Gaceta
          </h2>
          <p class="mt-3 text-sm leading-6 text-primary-50/90 sm:text-base">
            Alcance general del archivo normativo publicado para la ciudadanía.
          </p>
        </div>

        <dl class="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          @for (statistic of statistics(); track statistic.label) {
            <div
              class="rounded-xl border border-surface-0/25 bg-surface-0/95 p-4 shadow-lg shadow-primary-950/20 backdrop-blur-sm dark:border-accent-300/20 dark:bg-primary-950/80 sm:p-5"
            >
              <dt class="flex items-center gap-2 text-sm font-medium text-surface-600 dark:text-primary-100">
                <span
                  class="h-2 w-2 rounded-full bg-accent-500"
                  aria-hidden="true"
                ></span>
                {{ statistic.label }}
              </dt>
              <dd class="mt-3 text-2xl font-bold tracking-tight text-surface-950 dark:text-surface-0 sm:text-3xl">
                {{ statistic.value }}
              </dd>
              <p class="mt-2 text-sm leading-6 text-surface-600 dark:text-primary-100/80">
                {{ statistic.description }}
              </p>
            </div>
          }
        </dl>
      </div>
    </section>
  `,
  styles: `
    .stats-section {
      background:
        radial-gradient(circle at 85% 18%, color-mix(in srgb, var(--p-secondary-400), transparent 66%), transparent 28rem),
        linear-gradient(118deg, var(--p-primary-900), var(--p-primary-800) 54%, var(--p-secondary-800));
    }

    .stats-section::before,
    .stats-section::after {
      position: absolute;
      z-index: -1;
      width: 19rem;
      height: 19rem;
      border: 1px solid color-mix(in srgb, var(--p-accent-300), transparent 68%);
      border-radius: 50%;
      content: '';
    }

    .stats-section::before {
      top: -11rem;
      right: 8%;
    }

    .stats-section::after {
      bottom: -15rem;
      left: 4%;
      width: 24rem;
      height: 24rem;
    }
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
