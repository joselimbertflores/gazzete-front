import { DatePipe, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  input,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { TagModule } from 'primeng/tag';
import { register } from 'swiper/element/bundle';

import { PublicDocumentCard } from '../../../../types';

@Component({
  selector: 'app-featured-documents-section',
  standalone: true,
  imports: [RouterLink, TagModule, DatePipe, NgTemplateOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @let featuredDocuments = documents();

    @if (featuredDocuments.length > 0) {
      <section
        class="border-b border-primary-900 bg-linear-to-br from-primary-950 via-primary-900 to-primary-950"
        aria-labelledby="featured-title"
      >
        <div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-18 lg:px-8">
          <div class="max-w-2xl">
            <h2 id="featured-title" class="text-2xl font-semibold text-surface-0 sm:text-3xl">
              Normativas destacadas
            </h2>
            <p class="mt-2 text-sm leading-6 text-surface-100">
              Normativa relevante seleccionada para consulta rápida.
            </p>
          </div>

          <!-- Con un solo elemento no se necesita carousel. -->
          @if (featuredDocuments.length === 1) {
            <div class="mt-8 max-w-4xl">
              <ng-container
                [ngTemplateOutlet]="featuredDocumentCard"
                [ngTemplateOutletContext]="{ $implicit: featuredDocuments[0] }"
              />
            </div>
          } @else {
            <swiper-container
              class="featured-swiper mt-8 block pb-10"
              slides-per-view="1.05"
              space-between="16"
              loop="true"
              autoplay="true"
              autoplay-delay="6000"
              autoplay-disable-on-interaction="false"
              autoplay-pause-on-mouse-enter="false"
              navigation="true"
              pagination="true"
              pagination-clickable="true"
              keyboard-enabled="true"
              a11y-enabled="true"
              a11y-prev-slide-message="Ver normativa destacada anterior"
              a11y-next-slide-message="Ver siguiente normativa destacada"
              [attr.a11y-pagination-bullet-message]="'Ir a la normativa destacada {{index}}'"
              aria-label="Normativas destacadas"
              [breakpoints]="featuredBreakpoints"
            >
              @for (document of featuredDocuments; track document.id) {
                <swiper-slide style="height: auto">
                  <ng-container
                    [ngTemplateOutlet]="featuredDocumentCard"
                    [ngTemplateOutletContext]="{ $implicit: document }"
                  />
                </swiper-slide>
              }
            </swiper-container>
          }
        </div>
      </section>
    }

    <ng-template #featuredDocumentCard let-document>
      <article
        class="flex h-full min-h-80 flex-col overflow-hidden rounded-lg border border-surface-200 bg-surface-0 shadow-sm transition-shadow hover:border-primary-200 hover:shadow-md sm:min-h-88"
      >
        <div class="h-1.5 bg-primary-500"></div>
        <div class="flex flex-1 flex-col p-6 sm:p-8 lg:p-9">
          <div class="pb-7">
            <div
              class="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-800"
            >
              <i class="pi pi-star text-xs" aria-hidden="true"></i>
              Normativa destacada
            </div>

            <h3
              class="mt-5 text-2xl font-semibold uppercase leading-tight text-surface-950 sm:text-3xl"
            >
              {{ document.typeName }} {{ document.code }}
            </h3>

            <div class="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
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
              <span class="font-medium text-surface-500">Gestión {{ document.year }}</span>
              @if (document.publicationDate) {
                <span class="text-surface-400" aria-hidden="true">·</span>
                <time class="font-medium text-surface-500" [attr.datetime]="document.publicationDate">
                  Publicado el {{ document.publicationDate | date: 'd MMM y' }}
                </time>
              }
            </div>

            <p class="mt-7 line-clamp-3 text-sm leading-6 text-surface-600 sm:text-base">
              {{ document.summary }}
            </p>
          </div>

          <div class="mt-auto flex justify-start border-t border-surface-200 pt-4 sm:justify-end">
            <a
              [routerLink]="['/normativas', document.slug]"
              [state]="{ from: 'landing' }"
              class="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
              [attr.aria-label]="'Ver detalle de ' + document.typeName + ' ' + document.code"
            >
              Ver detalle
              <i class="pi pi-arrow-right text-xs" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </article>
    </ng-template>
  `,
  styles: `
    .featured-swiper {
      --swiper-navigation-sides-offset: 0.5rem;
      --swiper-navigation-size: 1.75rem;
      --swiper-theme-color: var(--p-surface-0);
      --swiper-pagination-bottom: 0;
      --swiper-pagination-color: var(--p-surface-0);
      --swiper-pagination-bullet-inactive-color: var(--p-primary-300);
      --swiper-pagination-bullet-inactive-opacity: 0.7;
    }

    .featured-swiper::part(button-prev),
    .featured-swiper::part(button-next) {
      color: var(--p-surface-0);
      filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.65));
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedDocumentsSection {
  readonly documents = input.required<PublicDocumentCard[]>();

  readonly featuredBreakpoints = {
    640: { slidesPerView: 1.1, spaceBetween: 20 },
    1024: { slidesPerView: 1.25, spaceBetween: 24 },
  };

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      register();
    }
  }
}
