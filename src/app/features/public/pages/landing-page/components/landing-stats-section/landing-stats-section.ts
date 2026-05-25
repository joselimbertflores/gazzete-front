import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { LandingStatistic } from '../landing-section.types';

@Component({
  selector: 'app-landing-stats-section',
  standalone: true,
  template: `
    <section class="bg-surface-0" aria-labelledby="stats-title">
      <div class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div class="max-w-2xl">
          <h2 id="stats-title" class="text-2xl font-semibold text-surface-950 sm:text-3xl">
            Información disponible en la gaceta
          </h2>
          <p class="mt-2 text-sm leading-6 text-surface-600">
            Alcance general del archivo normativo publicado para la ciudadanía.
          </p>
        </div>

        <dl class="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          @for (statistic of statistics(); track statistic.label) {
            <div
              class="rounded-lg border border-surface-200 bg-surface-50 p-4 shadow-sm transition hover:border-primary-200 hover:bg-primary-50/45 hover:shadow-md sm:p-5"
            >
              <dt class="flex items-center gap-2 text-sm font-medium text-surface-600">
                <span class="h-2 w-2 rounded-full bg-primary-500" aria-hidden="true"></span>
                {{ statistic.label }}
              </dt>
              <dd class="mt-3 text-2xl font-semibold tracking-tight text-surface-950 sm:text-3xl">
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
  readonly statistics = input.required<LandingStatistic[]>();
}
