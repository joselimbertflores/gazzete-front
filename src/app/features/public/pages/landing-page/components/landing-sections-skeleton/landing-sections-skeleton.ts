import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-landing-sections-skeleton',
  standalone: true,
  imports: [SkeletonModule],
  template: `
    <section
      id="normativas"
      class="border-b border-accent-200/70 bg-accent-50"
      aria-labelledby="document-types-skeleton-title"
    >
      <div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
        <h2
          id="document-types-skeleton-title"
          class="text-3xl font-bold tracking-tight text-surface-950 sm:text-4xl"
        >
          Tipos de normativas
        </h2>

        <div class="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          @for (item of documentTypeSkeletonItems; track item) {
            <div class="min-h-44 rounded-xl border border-accent-100 bg-surface-0 p-5 shadow-md shadow-accent-950/6 sm:min-h-48 sm:p-6">
              <p-skeleton width="48px" height="48px" borderRadius="12px" />
              <p-skeleton width="65%" height="22px" styleClass="mt-5" />
              <p-skeleton width="100%" height="14px" styleClass="mt-4" />
              <p-skeleton width="80%" height="14px" styleClass="mt-2" />
              <p-skeleton width="140px" height="18px" styleClass="mt-6" />
            </div>
          }
        </div>
      </div>
    </section>

    <section class="border-b border-surface-200 bg-surface-0" aria-labelledby="featured-skeleton-title">
      <div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
        <div class="max-w-2xl">
          <h2 id="featured-skeleton-title" class="text-3xl font-bold tracking-tight text-surface-950 sm:text-4xl">
            Normativas destacadas
          </h2>
          <p class="mt-3 text-sm leading-6 text-primary-900/80 sm:text-base">
            Normativa relevante seleccionada para consulta rápida.
          </p>
        </div>

        <div class="-mx-4 mt-8 flex gap-5 overflow-hidden px-4 pb-4 sm:-mx-6 sm:mt-10 sm:px-6">
          @for (item of featuredSkeletonItems; track item) {
            <article class="min-h-86 w-full flex-none overflow-hidden rounded-xl border border-primary-800 bg-primary-950 p-6 shadow-xl shadow-primary-950/20 sm:min-h-96 sm:w-[82%] sm:p-8 lg:w-[75%] lg:p-10">
              <p-skeleton width="170px" height="26px" borderRadius="999px" />
              <p-skeleton width="70%" height="40px" styleClass="mt-6" />
              <div class="mt-5 flex gap-2">
                <p-skeleton width="92px" height="22px" borderRadius="999px" />
                <p-skeleton width="112px" height="18px" />
              </div>
              <p-skeleton width="100%" height="16px" styleClass="mt-7" />
              <p-skeleton width="82%" height="16px" styleClass="mt-2" />
              <p-skeleton width="104px" height="18px" styleClass="mt-10" />
            </article>
          }
        </div>
      </div>
    </section>

    <section
      class="border-b border-surface-200 bg-surface-50"
      aria-labelledby="recent-skeleton-title"
    >
      <div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="recent-skeleton-title"
              class="text-3xl font-bold tracking-tight text-surface-950 sm:text-4xl"
            >
              Normativas recientes
            </h2>
            <p class="mt-2 text-sm leading-6 text-surface-600">
              Últimas normativas incorporadas a la Gaceta Municipal.
            </p>
          </div>
          <p-skeleton width="132px" height="18px" />
        </div>

        <div class="mt-6 grid gap-4 sm:mt-8 md:grid-cols-2">
          @for (item of recentSkeletonItems; track item) {
            <article class="rounded-xl border border-surface-200 bg-surface-0 p-4 shadow-sm shadow-surface-950/5 sm:p-5">
              <div class="flex items-start gap-4">
                <p-skeleton
                  width="48px"
                  height="48px"
                  borderRadius="8px"
                  styleClass="hidden sm:block"
                />
                <div class="min-w-0 flex-1">
                  <div class="flex gap-2">
                    <p-skeleton width="120px" height="22px" borderRadius="999px" />
                    <p-skeleton width="96px" height="16px" />
                  </div>
                  <p-skeleton width="45%" height="22px" styleClass="mt-4" />
                  <p-skeleton width="100%" height="14px" styleClass="mt-3" />
                  <p-skeleton width="75%" height="14px" styleClass="mt-2" />
                  <p-skeleton width="88px" height="16px" styleClass="mt-5" />
                </div>
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <section
      class="border-t border-primary-700 bg-linear-to-br from-primary-900 via-primary-800 to-secondary-800"
      aria-labelledby="stats-skeleton-title"
    >
      <div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
        <div class="max-w-2xl">
          <h2 id="stats-skeleton-title" class="text-3xl font-bold tracking-tight text-surface-0 sm:text-4xl">
            Información disponible en la Gaceta
          </h2>
          <p class="mt-3 text-sm leading-6 text-primary-50/90 sm:text-base">
            Alcance general del archivo normativo publicado para la ciudadanía.
          </p>
        </div>

        <dl class="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          @for (item of statsSkeletonItems; track item) {
            <div class="rounded-xl border border-surface-0/25 bg-surface-0/95 p-4 shadow-lg shadow-primary-950/20 sm:p-5">
              <p-skeleton width="60%" height="16px" />
              <p-skeleton width="48%" height="34px" styleClass="mt-4" />
              <p-skeleton width="100%" height="14px" styleClass="mt-3" />
              <p-skeleton width="80%" height="14px" styleClass="mt-2" />
            </div>
          }
        </dl>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingSectionsSkeleton {
  readonly documentTypeSkeletonItems = [1, 2, 3, 4, 5, 6];
  readonly featuredSkeletonItems = [1, 2];
  readonly recentSkeletonItems = [1, 2, 3, 4];
  readonly statsSkeletonItems = [1, 2, 3, 4];
}
