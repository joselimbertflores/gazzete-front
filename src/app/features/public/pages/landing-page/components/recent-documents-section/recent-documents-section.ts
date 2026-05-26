import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AnimateOnScroll } from 'primeng/animateonscroll';
import { TagModule } from 'primeng/tag';

import { PublicDocumentCard } from '../../../../types';

@Component({
  selector: 'app-recent-documents-section',
  standalone: true,
  imports: [RouterLink, TagModule, DatePipe, AnimateOnScroll],
  template: `
<section class="border-b border-surface-200 bg-surface-100/80" aria-labelledby="recent-title">
  <div class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
    <div
      pAnimateOnScroll
      enterClass="animate-enter fade-in-0 slide-in-from-b-4 animate-duration-500 animate-ease-out animate-fill-both"
      [once]="true"
      [threshold]="0.2"
      class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h2 id="recent-title" class="text-2xl font-semibold text-surface-950 sm:text-3xl">
          Documentos recientes
        </h2>
        <p class="mt-2 text-sm leading-6 text-surface-600">
          Últimas publicaciones incorporadas a la Gaceta Municipal.
        </p>
      </div>
      <a
        routerLink="/normativas"
        class="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary-700 transition-colors duration-300 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
      >
        Revisar documentos
        <i
          class="pi pi-arrow-right text-xs transition-transform duration-300 ease-out group-hover:translate-x-0.5"
          aria-hidden="true"
        ></i>
      </a>
    </div>

    <div class="mt-6 grid gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-2">
      @for (document of documents(); track document.id) {
        <article
          pAnimateOnScroll
          enterClass="animate-enter fade-in-0 slide-in-from-b-6 animate-duration-500 animate-ease-out animate-fill-both"
          [once]="true"
          [threshold]="0.16"
          class="group rounded-lg border border-surface-200 bg-surface-0 p-4 shadow-sm shadow-surface-950/5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary-300 hover:bg-primary-50/40 hover:shadow-xl hover:shadow-surface-950/10 sm:p-5"
        >
          <div class="flex items-start gap-4">
            <span
              class="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-primary-200 bg-primary-50 text-primary-700 transition-all duration-300 ease-out group-hover:scale-105 group-hover:border-primary-300 group-hover:bg-primary-100 sm:inline-flex"
            >
              <i class="pi pi-file-check text-lg" aria-hidden="true"></i>
            </span>
            <div class="min-w-0 flex-1">
              <h3 class="mt-2 text-lg font-semibold leading-7 text-surface-950 sm:text-xl">
                {{ document.typeName }} {{ document.code }}
              </h3>

                <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
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
                    class="block text-sm text-surface-500"
                    [attr.datetime]="document.publicationDate"
                  >
                    Publicado el {{ document.publicationDate | date: 'd MMM y' }}
                  </time>
                </div>

                <p class="mt-2 line-clamp-2 text-sm leading-6 text-surface-600">
                  {{ document.summary }}
                </p>
                <a
                  [routerLink]="['/normativas', document.id]"
                  [state]="{ from: 'landing' }"
                  class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors duration-300 group-hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 sm:mt-5"
                >
                  Ver detalle
                  <i
                    class="pi pi-arrow-right text-xs transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                    aria-hidden="true"
                  ></i>
                </a>
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
