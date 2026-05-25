import { DatePipe, DecimalPipe, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  ViewChild,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { PublicDocumentsApi } from '../../services/public-documents-api';
import { PublicLandingStats } from '../../types';

interface LandingStatistic {
  readonly label: string;
  readonly value: string;
  readonly description: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    ButtonModule,
    InputGroupModule,
    InputTextModule,
    SkeletonModule,
    TagModule,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: './landing-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LandingPage {
  private readonly publicDocumentApi = inject(PublicDocumentsApi);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly numberFormatter = new Intl.NumberFormat('es-BO');
  private featuredAutoplayId: ReturnType<typeof setInterval> | null = null;

  @ViewChild('featuredCarousel')
  private featuredCarousel?: ElementRef<HTMLElement>;

  readonly searchTerm = signal('');
  readonly skeletonItems = [1, 2, 3, 4];
  readonly activeFeaturedIndex = signal(0);
  readonly isFeaturedAutoplayPaused = signal(false);

  readonly landingResource = rxResource({
    stream: () => this.publicDocumentApi.getLandingData(),
  });

  readonly featuredDocuments = computed(() =>
    this.landingResource.hasValue() ? this.landingResource.value().featuredDocuments : [],
  );

  readonly hasFeaturedCarousel = computed(() => this.featuredDocuments().length > 1);

  readonly statistics = computed<LandingStatistic[]>(() => {
    if (!this.landingResource.hasValue()) return [];

    const stats = this.landingResource.value().stats;

    const availableYearsStatistic = this.getAvailableYearsStatistic(stats);

    return [
      {
        label: 'Documentos publicados',
        value: this.formatNumber(stats.totalPublishedDocuments),
        description: 'Registros normativos disponibles para consulta pública.',
      },
      ...(availableYearsStatistic ? [availableYearsStatistic] : []),
      {
        label: 'Gestión actual',
        value: this.formatNumber(stats.currentYearPublications),
        description: `Publicaciones incorporadas durante la gestión ${stats.currentYear}.`,
      },
      {
        label: 'Tipos de normativa',
        value: this.formatNumber(stats.documentTypesCount),
        description: 'Categorías principales de documentos municipales.',
      },
    ];
  });

  constructor() {
    if (this.isBrowser) {
      afterNextRender(() => this.startFeaturedAutoplay());
    }

    this.destroyRef.onDestroy(() => this.clearFeaturedAutoplay());
  }

  search(): void {
    const term = this.searchTerm().trim();

    this.router.navigate(['/normativas'], {
      queryParams: term ? { term } : undefined,
    });
  }

  pauseFeaturedAutoplay(): void {
    this.isFeaturedAutoplayPaused.set(true);
  }

  resumeFeaturedAutoplay(): void {
    this.isFeaturedAutoplayPaused.set(false);
  }

  previousFeaturedSlide(): void {
    const count = this.featuredDocuments().length;
    if (count <= 1) return;

    this.scrollToFeaturedSlide((this.activeFeaturedIndex() - 1 + count) % count);
  }

  nextFeaturedSlide(): void {
    const count = this.featuredDocuments().length;
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

    const activeIndex = slides.reduce(
      (closestIndex, slide, index) => {
        const currentDistance = Math.abs(slide.offsetLeft - carousel.scrollLeft);
        const closestDistance = Math.abs(slides[closestIndex].offsetLeft - carousel.scrollLeft);

        return currentDistance < closestDistance ? index : closestIndex;
      },
      0,
    );

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

  private formatNumber(value: number): string {
    return this.numberFormatter.format(value);
  }

  private advanceFeaturedAutoplay(): void {
    if (!this.isBrowser) return;

    const count = this.featuredDocuments().length;
    if (count <= 1 || this.isFeaturedAutoplayPaused()) return;

    this.scrollToFeaturedSlide((this.activeFeaturedIndex() + 1) % count, false);
  }

  private scrollToFeaturedSlide(index: number, pauseAutoplay = true): void {
    const count = this.featuredDocuments().length;
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
    if (this.featuredAutoplayId) return;

    this.featuredAutoplayId = setInterval(() => this.advanceFeaturedAutoplay(), 5500);
  }

  private clearFeaturedAutoplay(): void {
    if (!this.featuredAutoplayId) return;

    clearInterval(this.featuredAutoplayId);
    this.featuredAutoplayId = null;
  }

  private getAvailableYearsStatistic(stats: PublicLandingStats): LandingStatistic | null {
    const { min, max } = stats.availableYears;

    if (min === null || max === null || min > max) return null;

    return {
      label: 'Gestiones disponibles',
      value: min === max ? `${min}` : `${min}–${max}`,
      description: 'Archivo normativo organizado por año de publicación.',
    };
  }
}
