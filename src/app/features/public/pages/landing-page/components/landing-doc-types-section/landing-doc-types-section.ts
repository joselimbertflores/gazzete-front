import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocTypeResponse } from '../../../../types';

@Component({
  selector: 'landing-doc-types-section',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="bg-surface-50">
      <div class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <header class="mx-auto max-w-3xl text-center">
          <h2 class="text-2xl font-semibold tracking-tight text-surface-950">Tipos de normativa</h2>
          <p class="mt-2 text-sm leading-6 text-surface-600 sm:text-base">
            Ingrese por categoría normativa para encontrar publicaciones oficiales de forma más
            directa.
          </p>
        </header>

        <div
          class="mx-auto mt-7 grid max-w-6xl grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3"
          [class.fade-in]="!isLoading()"
        >
          @if (isLoading()) {
            @for (i of [1, 2, 3, 4, 5, 6]; track i) {
              <div class="min-h-28 rounded-2xl border border-surface-200 bg-surface-0 p-4 sm:p-5">
                <div class="flex items-center justify-between">
                  <div class="h-10 w-10 rounded-xl bg-surface-200 animate-pulse"></div>
                  <div class="h-8 w-8 rounded-full bg-surface-200 animate-pulse"></div>
                </div>
                <div class="mt-4 h-4 w-2/3 rounded bg-surface-200 animate-pulse"></div>
              </div>
            }
          } @else if (!isLoading() && items()?.length === 0) {
            <div
              class="text-center text-sm text-surface-600 col-span-1 sm:col-span-2 lg:col-span-3"
            >
              No hay tipos de documentos disponibles.
            </div>
          } @else {
            @for (item of items(); track item.id) {
              <a
                routerLink="/normativas"
                [queryParams]="{ type: item.id }"
                class="group relative min-h-28 rounded-2xl border border-surface-200 bg-surface-0 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:bg-primary-50/80 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:p-5"
              >
                <div class="flex items-center justify-between gap-3">
                  <span
                    class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary-200 bg-primary-100/80 text-primary-700 transition group-hover:border-primary-300 group-hover:bg-primary-100"
                  >
                    <i class="pi pi-file text-sm" aria-hidden="true"></i>
                  </span>

                  <span
                    class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-surface-300 bg-surface-0 text-surface-500 transition group-hover:border-primary-300 group-hover:bg-primary-100/70 group-hover:text-primary-700"
                  >
                    <i class="pi pi-arrow-up-right text-xs" aria-hidden="true"></i>
                  </span>
                </div>

                <h3
                  class="mt-4 text-lg font-semibold tracking-tight text-surface-900 transition group-hover:text-primary-900"
                >
                  {{ item.name }}
                </h3>
              </a>
            }
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingDocTypesSection {
  isLoading = input(false);
  items = input.required<DocTypeResponse[] | undefined>();
}
