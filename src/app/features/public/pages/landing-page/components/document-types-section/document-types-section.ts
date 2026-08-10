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
      class="border-b border-accent-100 bg-accent-50/60"
      aria-labelledby="document-types-title"
    >
      <div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
        <div class="max-w-2xl">
          <h2
            id="document-types-title"
            class="text-3xl font-bold tracking-tight text-surface-950 sm:text-4xl"
          >
            Tipos de normativas
          </h2>
        </div>

        <div class="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          @for (type of documentTypes(); track type.slug) {
            <a
              routerLink="/normativas"
              [queryParams]="{ tipo: type.slug }"
              class="group flex min-h-44 flex-col rounded-xl border border-surface-200 bg-surface-0 p-5 shadow-sm shadow-surface-950/5 transition duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-950/12 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 sm:min-h-48 sm:p-6"
              [attr.aria-label]="'Consultar ' + type.name"
            >
              <div class="flex items-start justify-between gap-4">
                <span
                  class="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary-100 group-hover:text-primary-800"
                >
                  <i class="pi pi-file" style="font-size: 1.25rem" aria-hidden="true"></i>
                </span>
                <span
                  class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-surface-200 bg-surface-50 text-surface-500 transition group-hover:border-primary-700 group-hover:bg-primary-700 group-hover:text-surface-0"
                >
                  <i
                    class="pi pi-arrow-up-right"
                    style="font-size: 0.8rem"
                    aria-hidden="true"
                  ></i>
                </span>
              </div>
              <h3 class="mt-5 text-lg font-bold leading-6 text-surface-950">
                {{ type.name }}
              </h3>
              <p class="mt-2 flex-1 text-sm leading-6 text-surface-600">
                {{ type.description || 'Consulte normativas publicadas de este tipo.' }}
              </p>
              <p class="mt-5 border-t border-surface-100 pt-4 text-sm font-semibold text-primary-700">
                {{ type.documentsCount | i18nPlural: documentPluralMap }}
              </p>
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
