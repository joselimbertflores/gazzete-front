import { I18nPluralPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PublicDocumentTypeItem } from '../../../../types';

@Component({
  selector: 'app-document-types-section',
  standalone: true,
  imports: [RouterLink, I18nPluralPipe],
  template: `
    <section
      id="normativas"
      class="border-b border-accent-200/70 bg-accent-50 dark:border-accent-900/80 dark:bg-accent-950"
      aria-labelledby="document-types-title"
    >
      <div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
        <div class="max-w-2xl">
          <h2
            id="document-types-title"
            class="text-3xl font-bold tracking-tight text-surface-950 dark:text-accent-50 sm:text-4xl"
          >
            Tipos de normativas
          </h2>
        </div>

        <div class="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          @for (type of documentTypes(); track type.slug) {
            <a
              routerLink="/normativas"
              [queryParams]="{ tipo: type.slug }"
              class="group flex min-h-44 flex-col rounded-xl border border-accent-100 bg-surface-0 p-5 shadow-md shadow-accent-950/6 transition duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-950/12 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 dark:border-accent-800/70 dark:bg-surface-900 dark:shadow-black/20 dark:hover:border-primary-600 dark:hover:shadow-black/30 dark:focus-visible:outline-primary-400 sm:min-h-48 sm:p-6"
              [attr.aria-label]="'Consultar ' + type.name"
            >
              <div class="flex items-start justify-between gap-4">
                <span
                  class="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary-100 group-hover:text-primary-800 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300 dark:group-hover:bg-primary-900 dark:group-hover:text-primary-200"
                >
                  <i class="pi pi-file" style="font-size: 1.25rem" aria-hidden="true"></i>
                </span>
                <span
                  class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-surface-200 bg-surface-50 text-surface-500 transition group-hover:border-primary-700 group-hover:bg-primary-700 group-hover:text-surface-0 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-400 dark:group-hover:border-primary-400 dark:group-hover:bg-primary-400 dark:group-hover:text-primary-950"
                >
                  <i
                    class="pi pi-arrow-up-right"
                    style="font-size: 0.8rem"
                    aria-hidden="true"
                  ></i>
                </span>
              </div>
              <h3 class="mt-5 text-lg font-bold leading-6 text-surface-950 dark:text-surface-0">
                {{ type.name }}
              </h3>
              <p class="mt-2 flex-1 text-sm leading-6 text-surface-600 dark:text-surface-300">
                {{ type.description || 'Consulte normativas publicadas de este tipo.' }}
              </p>
              <div
                class="mt-5 flex items-center gap-2.5 rounded-lg border border-accent-100 bg-accent-50/80 px-3 py-2.5 text-sm font-semibold text-primary-800 transition-colors group-hover:border-primary-100 group-hover:bg-primary-50 dark:border-accent-800/80 dark:bg-accent-950/70 dark:text-accent-100 dark:group-hover:border-primary-800 dark:group-hover:bg-primary-950"
              >
                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true"></span>
                <span>{{ type.documentsCount | i18nPlural: documentPluralMap }}</span>
              </div>
            </a>
          }
        </div>
      </div>
    </section>
  `,
})
export class DocumentTypesSection {
  readonly documentTypes = input.required<PublicDocumentTypeItem[]>();

  readonly documentPluralMap = {
    '=0': 'No hay normativas disponibles',
    '=1': '1 normativa disponible',
    other: '# normativas disponibles',
  } as const;
}
