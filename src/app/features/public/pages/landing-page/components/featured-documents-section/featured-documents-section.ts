import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { TagModule } from 'primeng/tag';
import { PublicDocumentCard } from '../../../../types';

interface FeaturedSwiperElement extends HTMLElement {
  swiper?: {
    slideNext(): void;
    slidePrev(): void;
  };
}

@Component({
  selector: 'app-featured-documents-section',
  standalone: true,
  imports: [RouterLink, TagModule, DatePipe, NgTemplateOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @let featuredDocuments = documents();

    @if (featuredDocuments.length > 0) {
      <section
        class="border-b border-surface-200 bg-surface-0"
        aria-labelledby="featured-title"
      >
        <div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
          <div class="flex items-end justify-between gap-5">
            <div class="max-w-2xl">
              <h2
                id="featured-title"
                class="text-3xl font-bold tracking-tight text-surface-950 sm:text-4xl"
              >
                Normativas destacadas
              </h2>
              <p class="mt-3 text-sm leading-6 text-primary-900/80 sm:text-base">
                Normativa relevante seleccionada para consulta rápida.
              </p>
            </div>

            @if (featuredDocuments.length > 1) {
              <div
                class="flex shrink-0 items-center gap-2"
                role="group"
                aria-label="Controles del carousel"
              >
                <button
                  type="button"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-surface-200 bg-surface-0 text-primary-800 shadow-sm transition-colors hover:border-primary-200 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-600 sm:h-11 sm:w-11"
                  aria-label="Ver normativa destacada anterior"
                  (click)="showPreviousDocument()"
                >
                  <i class="pi pi-chevron-left text-sm" aria-hidden="true"></i>
                </button>
                <button
                  type="button"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-surface-200 bg-surface-0 text-primary-800 shadow-sm transition-colors hover:border-primary-200 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-600 sm:h-11 sm:w-11"
                  aria-label="Ver siguiente normativa destacada"
                  (click)="showNextDocument()"
                >
                  <i class="pi pi-chevron-right text-sm" aria-hidden="true"></i>
                </button>
              </div>
            }
          </div>

          <!-- Con un solo elemento no se necesita carousel. -->
          @if (featuredDocuments.length === 1) {
            <div class="mt-8 max-w-5xl sm:mt-10">
              <ng-container
                [ngTemplateOutlet]="featuredDocumentCard"
                [ngTemplateOutletContext]="{ $implicit: featuredDocuments[0] }"
              />
            </div>
          } @else {
            <swiper-container
              #featuredCarousel
              class="featured-swiper mt-8 block pb-12 sm:mt-10"
              slides-per-view="1"
              space-between="18"
              rewind="true"
              autoplay="true"
              autoplay-delay="6000"
              autoplay-disable-on-interaction="false"
              autoplay-pause-on-mouse-enter="false"
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
        class="featured-card relative isolate flex h-full min-h-86 flex-col overflow-hidden rounded-xl border border-primary-700/70 text-surface-0 shadow-xl shadow-primary-950/20 sm:min-h-96"
      >
        <span
          class="pointer-events-none absolute -right-3 top-5 -z-10 text-[6.5rem] font-bold leading-none tracking-[-0.08em] text-surface-0/5 sm:right-5 sm:text-[9rem] lg:text-[11rem]"
          aria-hidden="true"
        >
          {{ document.year }}
        </span>
        <i
          class="pi pi-building-columns pointer-events-none absolute -bottom-7 right-7 -z-10 text-[8rem] text-accent-200/10 sm:right-12 sm:text-[11rem]"
          aria-hidden="true"
        ></i>

        <div class="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-accent-300 via-accent-500 to-transparent"></div>

        <div class="flex flex-1 flex-col p-6 sm:p-8 lg:p-10">
          <div class="max-w-3xl pb-7 sm:pb-9">
            <div
              class="inline-flex items-center gap-2 rounded-full border border-accent-200/70 bg-accent-300 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-950 shadow-sm"
            >
              <i class="pi pi-star text-xs" aria-hidden="true"></i>
              Normativa destacada
            </div>

            <h3
              class="mt-6 max-w-2xl text-2xl font-bold uppercase leading-tight tracking-tight text-balance text-surface-0 sm:text-3xl lg:text-4xl"
            >
              {{ document.typeName }} {{ document.code }}
            </h3>

            <div
              class="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-primary-100"
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
              <span class="text-primary-300" aria-hidden="true">·</span>
              <span class="font-medium">Gestión {{ document.year }}</span>
              @if (document.publicationDate) {
                <span class="text-primary-300" aria-hidden="true">·</span>
                <time class="font-medium" [attr.datetime]="document.publicationDate">
                  Publicado el {{ document.publicationDate | date: 'd MMM y' }}
                </time>
              }
            </div>

            <p
              class="mt-7 max-w-3xl line-clamp-3 text-sm leading-6 text-primary-50/90 sm:text-base sm:leading-7"
            >
              {{ document.summary }}
            </p>
          </div>

          <div class="mt-auto flex justify-start border-t border-surface-0/15 pt-5">
            <a
              [routerLink]="['/normativas', document.slug]"
              [state]="{ from: 'landing' }"
              class="inline-flex w-fit items-center gap-3 text-sm font-bold text-accent-300 transition-colors hover:text-accent-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-300"
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
    .featured-card {
      background:
        radial-gradient(circle at 88% 16%, color-mix(in srgb, var(--p-secondary-500), transparent 72%), transparent 24rem),
        linear-gradient(135deg, var(--p-primary-950), var(--p-primary-900) 58%, var(--p-secondary-900));
    }

    .featured-card::after {
      position: absolute;
      right: -6rem;
      bottom: -9rem;
      z-index: -1;
      width: 22rem;
      height: 22rem;
      border: 1px solid color-mix(in srgb, var(--p-accent-300), transparent 40%);
      border-radius: 50%;
      content: '';
    }

    .featured-swiper {
      --swiper-navigation-sides-offset: 0.75rem;
      --swiper-navigation-size: 1.1rem;
      --swiper-theme-color: var(--p-primary-800);
      --swiper-pagination-bottom: 0;
      --swiper-pagination-color: var(--p-accent-500);
      --swiper-pagination-bullet-inactive-color: var(--p-surface-300);
      --swiper-pagination-bullet-inactive-opacity: 1;
    }

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedDocumentsSection {
  readonly documents = input.required<PublicDocumentCard[]>();
  private readonly carousel = viewChild<ElementRef<FeaturedSwiperElement>>('featuredCarousel');

  readonly featuredBreakpoints = {
    640: { slidesPerView: 1.06, spaceBetween: 20 },
    1024: { slidesPerView: 1.32, spaceBetween: 24 },
  };

  constructor() {
    afterNextRender(() => {
      void import('swiper/element/bundle').then(({ register }) => register());
    });
  }

  showPreviousDocument(): void {
    this.carousel()?.nativeElement.swiper?.slidePrev();
  }

  showNextDocument(): void {
    this.carousel()?.nativeElement.swiper?.slideNext();
  }
}
