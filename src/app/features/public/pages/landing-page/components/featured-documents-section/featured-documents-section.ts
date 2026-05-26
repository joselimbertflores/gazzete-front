import { DatePipe, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  afterNextRender,
  PLATFORM_ID,
  DestroyRef,
  ElementRef,
  ViewChild,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { AnimateOnScroll } from 'primeng/animateonscroll';
import { TagModule } from 'primeng/tag';

import { PublicDocumentCard } from '../../../../types';

@Component({
  selector: 'app-featured-documents-section',
  standalone: true,
  imports: [RouterLink, TagModule, DatePipe, AnimateOnScroll],
  template: `
    <section
      class="border-b border-primary-900 bg-linear-to-br from-primary-950 via-primary-900 to-primary-950"
      aria-labelledby="featured-title"
    >
      <div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-18 lg:px-8">
        <div
          pAnimateOnScroll
          enterClass="animate-enter fade-in-0 slide-in-from-b-4 animate-duration-500 animate-ease-out animate-fill-both"
          [once]="true"
          [threshold]="0.2"
          class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div class="max-w-2xl">
            <h2 id="featured-title" class="text-2xl font-semibold text-surface-0 sm:text-3xl">
              Documentos destacados
            </h2>
            <p class="mt-2 text-sm leading-6 text-surface-100">
              Normativa relevante seleccionada para consulta rápida.
            </p>
          </div>
        </div>

        <div
          pAnimateOnScroll
          enterClass="animate-enter fade-in-0 slide-in-from-b-8 zoom-in-95 animate-duration-700 animate-ease-out animate-fill-both"
          [once]="true"
          [threshold]="0.12"
          class="relative mt-6 sm:mt-8"
          (mouseenter)="pauseFeaturedAutoplay()"
          (mouseleave)="resumeFeaturedAutoplay()"
          (focusin)="pauseFeaturedAutoplay()"
          (focusout)="resumeFeaturedAutoplay()"
        >
          <div
            #featuredCarousel
            class="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:gap-5 sm:px-6"
            aria-label="Documentos destacados"
            tabindex="0"
            (scroll)="onFeaturedScroll($event)"
            (keydown)="onFeaturedKeydown($event)"
            (pointerdown)="pauseFeaturedAutoplay()"
            (wheel)="pauseFeaturedAutoplay()"
          >
            @for (document of documents(); track document.id; let i = $index) {
              <article
                class="group flex min-h-80 w-[calc(100%-1rem)] flex-none snap-start flex-col justify-between overflow-hidden rounded-lg border border-surface-200 bg-surface-0 shadow-xl shadow-primary-950/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary-300 hover:bg-surface-0 hover:shadow-2xl hover:shadow-primary-950/25 focus-within:border-primary-300 sm:min-h-88 sm:w-[82%] lg:w-[70%]"
                [attr.aria-label]="'Documento destacado ' + (i + 1) + ' de ' + documents().length"
              >
                <div class="h-1.5 bg-primary-500 transition-colors duration-300 group-hover:bg-primary-600"></div>
                <div class="flex flex-1 flex-col justify-between p-6 sm:p-8 lg:p-9">
                  <div>
                    <div
                      class="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-800 transition duration-300 ease-out group-hover:border-primary-200 group-hover:bg-primary-100"
                    >
                      <i
                        class="pi pi-star text-xs transition-transform duration-300 ease-out group-hover:scale-110"
                        aria-hidden="true"
                      ></i>
                      Documento destacado
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
                        <time
                          class="font-medium text-surface-500"
                          [attr.datetime]="document.publicationDate"
                        >
                          Publicado el {{ document.publicationDate | date: 'd MMM y' }}
                        </time>
                      }
                    </div>

                    <p class="mt-7 line-clamp-3 text-sm leading-6 text-surface-600 sm:text-base">
                      {{ document.summary }}
                    </p>
                  </div>

                  <div
                    class="mt-7 flex justify-start border-t border-surface-200 pt-4 sm:justify-end"
                  >
                    <a
                      [routerLink]="['/normativas', document.id]"
                      [state]="{ from: 'landing' }"
                      class="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary-700 transition-colors duration-300 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
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

          @if (hasFeaturedCarousel()) {
            <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary-700 bg-surface-0 text-primary-800 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface-0"
                aria-label="Ver documento destacado anterior"
                (click)="previousFeaturedSlide()"
              >
                <i class="pi pi-arrow-left text-sm" aria-hidden="true"></i>
              </button>

              <div class="flex items-center gap-2 px-1">
                @for (document of documents(); track document.id; let i = $index) {
                  <button
                    type="button"
                    class="h-2.5 rounded-full transition-all duration-300 ease-out hover:bg-surface-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-surface-0"
                    [class.w-8]="activeFeaturedIndex() === i"
                    [class.w-2.5]="activeFeaturedIndex() !== i"
                    [class.bg-surface-0]="activeFeaturedIndex() === i"
                    [class.bg-primary-700]="activeFeaturedIndex() !== i"
                    [attr.aria-label]="'Ir al documento destacado ' + (i + 1)"
                    [attr.aria-current]="activeFeaturedIndex() === i ? 'true' : null"
                    (click)="goToFeaturedSlide(i)"
                  ></button>
                }
              </div>

              <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary-700 bg-surface-0 text-primary-800 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface-0"
                aria-label="Ver siguiente documento destacado"
                (click)="nextFeaturedSlide()"
              >
                <i class="pi pi-arrow-right text-sm" aria-hidden="true"></i>
              </button>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedDocumentsSection {
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private featuredAutoplayId: ReturnType<typeof setInterval> | null = null;

  @ViewChild('featuredCarousel')
  private featuredCarousel?: ElementRef<HTMLElement>;

  readonly documents = input.required<PublicDocumentCard[]>();

  readonly activeFeaturedIndex = signal(0);
  readonly isFeaturedAutoplayPaused = signal(false);
  readonly hasFeaturedCarousel = computed(() => this.documents().length > 1);

  constructor() {
    if (this.isBrowser) {
      afterNextRender(() => this.startFeaturedAutoplay());
    }

    this.destroyRef.onDestroy(() => this.clearFeaturedAutoplay());
  }

  pauseFeaturedAutoplay(): void {
    this.isFeaturedAutoplayPaused.set(true);
  }

  resumeFeaturedAutoplay(): void {
    this.isFeaturedAutoplayPaused.set(false);
  }

  previousFeaturedSlide(): void {
    const count = this.documents().length;
    if (count <= 1) return;

    this.scrollToFeaturedSlide((this.activeFeaturedIndex() - 1 + count) % count);
  }

  nextFeaturedSlide(): void {
    const count = this.documents().length;
    if (count <= 1) return;

    this.scrollToFeaturedSlide((this.activeFeaturedIndex() + 1) % count);
  }

  goToFeaturedSlide(index: number): void {
    this.scrollToFeaturedSlide(index);
  }

  onFeaturedScroll(event: Event): void {
    const carousel = event.currentTarget as HTMLElement;
    const slides = Array.from(carousel.children) as HTMLElement[];
    if (slides.length === 0) return;

    const activeIndex = slides.reduce((closestIndex, slide, index) => {
      const currentDistance = Math.abs(slide.offsetLeft - carousel.scrollLeft);
      const closestDistance = Math.abs(slides[closestIndex].offsetLeft - carousel.scrollLeft);

      return currentDistance < closestDistance ? index : closestIndex;
    }, 0);

    this.activeFeaturedIndex.set(activeIndex);
  }

  onFeaturedKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previousFeaturedSlide();
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.nextFeaturedSlide();
    }
  }

  private advanceFeaturedAutoplay(): void {
    if (!this.isBrowser) return;

    const count = this.documents().length;
    if (count <= 1 || this.isFeaturedAutoplayPaused()) return;

    this.scrollToFeaturedSlide((this.activeFeaturedIndex() + 1) % count, false);
  }

  private scrollToFeaturedSlide(index: number, pauseAutoplay = true): void {
    const count = this.documents().length;
    if (count === 0) return;

    if (pauseAutoplay) {
      this.pauseFeaturedAutoplay();
    }

    const nextIndex = Math.max(0, Math.min(index, count - 1));
    this.activeFeaturedIndex.set(nextIndex);

    if (!this.isBrowser) return;

    const carousel = this.featuredCarousel?.nativeElement;
    const slide = carousel?.children.item(nextIndex) as HTMLElement | null | undefined;
    if (!carousel || !slide) return;

    carousel.scrollTo({
      left: slide.offsetLeft,
      behavior: 'smooth',
    });
  }

  private startFeaturedAutoplay(): void {
    if (this.featuredAutoplayId || this.prefersReducedMotion()) return;

    this.featuredAutoplayId = setInterval(() => this.advanceFeaturedAutoplay(), 5500);
  }

  private clearFeaturedAutoplay(): void {
    if (!this.featuredAutoplayId) return;

    clearInterval(this.featuredAutoplayId);
    this.featuredAutoplayId = null;
  }

  private prefersReducedMotion(): boolean {
    return this.isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
