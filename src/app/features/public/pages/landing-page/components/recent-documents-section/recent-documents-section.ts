import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TagModule } from 'primeng/tag';

import { PublicDocumentCard } from '../../../../types';

@Component({
  selector: 'app-recent-documents-section',
  standalone: true,
  imports: [RouterLink, TagModule, DatePipe],
  template: `
<section class="border-b border-surface-200 bg-surface-0" aria-labelledby="recent-title">
  <div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 id="recent-title" class="text-3xl font-bold tracking-tight text-surface-950 sm:text-4xl">
          Normativas recientes
        </h2>
        <p class="mt-2 text-sm leading-6 text-surface-600">
          Últimas normativas incorporadas a la Gaceta Municipal.
        </p>
      </div>
      <a
        routerLink="/normativas"
        class="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary-700 transition-colors duration-300 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
      >
        Revisar normativas
        <i
          class="pi pi-arrow-right text-xs transition-transform duration-300 ease-out group-hover:translate-x-0.5"
          aria-hidden="true"
        ></i>
      </a>
    </div>

    <div class="mt-6 grid gap-4 sm:mt-8 md:grid-cols-2">
      @for (document of documents(); track document.id) {
        <article
          class="group h-full rounded-xl border border-surface-200 bg-surface-50 p-4 shadow-sm shadow-surface-950/5 transition duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-950/8 sm:p-5"
        >
          <div class="flex h-full items-start gap-3.5 sm:gap-4">
            <span
              class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 text-primary-700 shadow-sm sm:h-12 sm:w-12"
            >
              <i class="pi pi-file-check" style="font-size: 1.15rem" aria-hidden="true"></i>
            </span>
            <div class="flex min-w-0 flex-1 flex-col self-stretch">
              <h3 class="text-lg font-bold leading-7 text-surface-950 sm:text-xl">
                {{ document.typeName }} {{ document.code }}
              </h3>

                <div
                  class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 border-y border-surface-200 py-2.5 text-sm"
                >
                  @switch (document.legalStatus) {
                    @case ('VALID') {
                      <p-tag severity="success" value="Vigente" [rounded]="true" />
                    }
                    @case ('ABROGATED') {
                      <p-tag severity="danger" value="Abrogada" [rounded]="true" />
                    }
                    @case ('DEROGATED') {
                      <p-tag severity="warn" value="Derogada" [rounded]="true" />
                    }
                    @case ('MODIFIED') {
                      <p-tag severity="info" value="Modificada" [rounded]="true" />
                    }
                    @default {
                      <p-tag severity="secondary" value="Desconocido" [rounded]="true" />
                    }
                  }
                  <span class="text-surface-400" aria-hidden="true">·</span>
                  <time
                    class="block text-sm font-medium text-surface-500"
                    [attr.datetime]="document.publicationDate"
                  >
                    Publicado el {{ document.publicationDate | date: 'd MMM y' }}
                  </time>
                </div>

                <p class="mt-4 line-clamp-2 text-sm leading-6 text-surface-600">
                  {{ document.summary }}
                </p>
                <div class="mt-auto border-t border-surface-200 pt-4 sm:pt-5">
                  <a
                    [routerLink]="['/normativas', document.slug]"
                    [state]="{ from: 'landing' }"
                    class="inline-flex items-center gap-2.5 text-sm font-bold text-primary-700 transition-colors duration-300 group-hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                  >
                    Ver detalle
                    <i
                      class="pi pi-arrow-right transition-transform duration-200 group-hover:translate-x-0.5"
                      style="font-size: 0.75rem"
                      aria-hidden="true"
                    ></i>
                  </a>
                </div>
              </div>
            </div>
        </article>
      }
    </div>
  </div>
</section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentDocumentsSection {
  readonly documents = input.required<PublicDocumentCard[]>();
}
