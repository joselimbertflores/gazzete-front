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
      class="border-b border-surface-200 bg-linear-to-b from-surface-0 to-primary-50/40"
      aria-labelledby="document-types-title"
    >
      <div class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div
          class="max-w-2xl motion-safe:animate-enter motion-safe:fade-in-0 motion-safe:slide-in-from-b-3 motion-safe:animate-duration-500 motion-safe:animate-ease-out motion-safe:animate-fill-both"
        >
          <h2 id="document-types-title" class="text-2xl font-semibold text-surface-950 sm:text-3xl">
            Tipos de documento
          </h2>
        </div>

        <div class="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          @for (type of documentTypes(); track type.id) {
            <a
              routerLink="/normativas"
              [queryParams]="{ type: type.id }"
              class="group flex min-h-44 flex-col rounded-lg border border-surface-200 bg-surface-0 p-4 shadow-sm shadow-surface-950/5 transition-all duration-300 ease-out motion-safe:animate-enter motion-safe:fade-in-0 motion-safe:slide-in-from-b-3 motion-safe:animate-duration-500 motion-safe:animate-ease-out motion-safe:animate-fill-both hover:-translate-y-1 hover:border-primary-300 hover:bg-primary-50/65 hover:shadow-xl hover:shadow-primary-900/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 sm:min-h-52 sm:p-5"
              [attr.aria-label]="'Consultar ' + type.name"
            >
              <span
                class="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-primary-200 bg-primary-50 text-primary-700 shadow-sm transition-all duration-300 ease-out group-hover:scale-105 group-hover:border-primary-300 group-hover:bg-primary-100 group-hover:text-primary-800 sm:h-14 sm:w-14"
              >
                <i class="pi pi-file" style="font-size: 1.2rem;" aria-hidden="true"></i>
              </span>
              <h3 class="mt-4 text-base font-semibold text-surface-950 sm:mt-5 sm:text-lg">
                {{ type.name }}
              </h3>
              <p class="mt-2 flex-1 text-sm leading-6 text-surface-600">
                {{ type.description || 'Consulte documentos publicados de este tipo.' }}
              </p>
              <p class="mt-4 text-sm font-medium text-surface-700">
                {{ type.documentsCount | i18nPlural: documentPluralMap }}
              </p>
              <span
                class="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary-700"
              >
                Consultar
                <i
                  class="pi pi-arrow-up-right text-xs transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                ></i>
              </span>
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
    '=0': 'No hay documentos disponibles',
    '=1': '1 documento disponible',
    other: '# documentos disponibles',
  } as const;
}
