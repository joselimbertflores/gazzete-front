import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-landing-sections-skeleton',
  standalone: true,
  imports: [SkeletonModule],
  template: `
<section
  id="normativas"
  class="public-motion-safe border-b border-surface-200 bg-linear-to-b from-surface-0 to-primary-50/40 motion-safe:animate-enter motion-safe:fade-in-0 motion-safe:slide-in-from-b-4 motion-safe:animate-duration-500 motion-safe:animate-ease-out motion-safe:animate-fill-both"
  aria-labelledby="document-types-skeleton-title"
>
  <div class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
    <div class="max-w-2xl">
      <h2
        id="document-types-skeleton-title"
        class="text-2xl font-semibold text-surface-950 sm:text-3xl"
      >
        Consulte por tipo de documento
      </h2>
      <p class="mt-2 text-sm leading-6 text-surface-600">
        Ingrese directamente a las categorías principales de la normativa municipal.
      </p>
    </div>

    <div class="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      @for (item of documentTypeSkeletonItems; track item) {
        <div
          class="min-h-44 rounded-lg border border-surface-200 bg-surface-0 p-4 sm:min-h-52 sm:p-5"
        >
          <p-skeleton width="56px" height="56px" borderRadius="8px" />
          <p-skeleton width="65%" height="22px" styleClass="mt-5" />
          <p-skeleton width="100%" height="14px" styleClass="mt-4" />
          <p-skeleton width="80%" height="14px" styleClass="mt-2" />
          <p-skeleton width="140px" height="18px" styleClass="mt-5" />
          <p-skeleton width="96px" height="16px" styleClass="mt-5" />
        </div>
      }
    </div>
  </div>
</section>

<section
  class="public-motion-safe border-b border-primary-900 bg-linear-to-br from-primary-950 via-primary-900 to-primary-950 motion-safe:animate-enter motion-safe:fade-in-0 motion-safe:slide-in-from-b-4 motion-safe:animate-delay-100 motion-safe:animate-duration-500 motion-safe:animate-ease-out motion-safe:animate-fill-both"
  aria-labelledby="featured-skeleton-title"
>
  <div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-18 lg:px-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="max-w-2xl">
        <h2 id="featured-skeleton-title" class="text-2xl font-semibold text-surface-0 sm:text-3xl">
          Documentos destacados
        </h2>
        <p class="mt-2 text-sm leading-6 text-surface-100">
          Normativa relevante seleccionada para consulta rápida.
        </p>
      </div>
    </div>

    <div class="-mx-4 mt-6 flex gap-4 overflow-hidden px-4 py-6 sm:-mx-6 sm:mt-8 sm:px-6">
      @for (item of featuredSkeletonItems; track item) {
        <article
          class="min-h-[20rem] w-[calc(100%-1rem)] flex-none overflow-hidden rounded-lg border border-surface-200 bg-surface-0 shadow-xl shadow-primary-950/20 sm:min-h-[22rem] sm:w-[82%] lg:w-[70%]"
        >
          <div class="h-1.5 bg-primary-500"></div>
          <div class="p-6 sm:p-8 lg:p-9">
            <div class="flex items-start justify-between gap-4">
              <p-skeleton width="70%" height="34px" />
              <p-skeleton width="84px" height="22px" borderRadius="999px" />
            </div>
            <div class="mt-5 flex gap-2">
              <p-skeleton width="92px" height="22px" borderRadius="999px" />
              <p-skeleton width="112px" height="18px" />
            </div>
            <p-skeleton width="100%" height="16px" styleClass="mt-7" />
            <p-skeleton width="92%" height="16px" styleClass="mt-2" />
            <p-skeleton width="72%" height="16px" styleClass="mt-2" />
            <div class="mt-8 flex items-center justify-between border-t border-surface-200 pt-5">
              <p-skeleton width="132px" height="16px" />
              <p-skeleton width="104px" height="18px" />
            </div>
          </div>
        </article>
      }
    </div>
  </div>
</section>

<section
  class="public-motion-safe border-b border-surface-200 bg-surface-100/80 motion-safe:animate-enter motion-safe:fade-in-0 motion-safe:slide-in-from-b-4 motion-safe:animate-delay-150 motion-safe:animate-duration-500 motion-safe:animate-ease-out motion-safe:animate-fill-both"
  aria-labelledby="recent-skeleton-title"
>
  <div class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 id="recent-skeleton-title" class="text-2xl font-semibold text-surface-950 sm:text-3xl">
          Documentos recientes
        </h2>
        <p class="mt-2 text-sm leading-6 text-surface-600">
          Últimas publicaciones incorporadas a la Gaceta Municipal.
        </p>
      </div>
      <p-skeleton width="132px" height="18px" />
    </div>

    <div class="mt-6 grid gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-2">
      @for (item of recentSkeletonItems; track item) {
        <article class="rounded-lg border border-surface-200 bg-surface-0 p-4 sm:p-5">
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
  class="public-motion-safe bg-surface-0 motion-safe:animate-enter motion-safe:fade-in-0 motion-safe:slide-in-from-b-4 motion-safe:animate-delay-200 motion-safe:animate-duration-500 motion-safe:animate-ease-out motion-safe:animate-fill-both"
  aria-labelledby="stats-skeleton-title"
>
  <div class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
    <div class="max-w-2xl">
      <h2 id="stats-skeleton-title" class="text-2xl font-semibold text-surface-950 sm:text-3xl">
        Información disponible en la gaceta
      </h2>
      <p class="mt-2 text-sm leading-6 text-surface-600">
        Alcance general del archivo normativo publicado para la ciudadanía.
      </p>
    </div>

    <dl class="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      @for (item of statsSkeletonItems; track item) {
        <div class="rounded-lg border border-surface-200 bg-surface-50 p-4 sm:p-5">
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
