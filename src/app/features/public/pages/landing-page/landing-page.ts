import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { PublicDocumentsApi } from '../../services';
import { PublicLandingStats } from '../../types';
import {
  LandingHero,
  LandingStatistic,
  LandingErrorState,
  LandingStatsSection,
  DocumentTypesSection,
  RecentDocumentsSection,
  LandingSectionsSkeleton,
  FeaturedDocumentsSection,
} from './components';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    LandingHero,
    LandingErrorState,
    LandingStatsSection,
    DocumentTypesSection,
    RecentDocumentsSection,
    LandingSectionsSkeleton,
    FeaturedDocumentsSection,
  ],
  templateUrl: './landing-page.html',
})
export default class LandingPage {
  private readonly publicDocumentApi = inject(PublicDocumentsApi);
  private readonly router = inject(Router);

  readonly searchTerm = signal('');

  readonly landingResource = rxResource({ stream: () => this.publicDocumentApi.getLandingData() });

  readonly documentTypes = computed(() =>
    this.landingResource.hasValue() ? this.landingResource.value().documentTypes : [],
  );

  readonly featuredDocuments = computed(() =>
    this.landingResource.hasValue() ? this.landingResource.value().featuredDocuments : [],
  );

  readonly recentDocuments = computed(() =>
    this.landingResource.hasValue() ? this.landingResource.value().recentDocuments : [],
  );

  readonly statistics = computed<LandingStatistic[]>(() => {
    if (!this.landingResource.hasValue()) return [];

    const stats = this.landingResource.value().stats;

    const availableYearsStatistic = this.getAvailableYearsStatistic(stats);

    return [
      {
        label: 'Documentos publicados',
        value: stats.totalPublishedDocuments.toString(),
        description: 'Registros normativos disponibles para consulta pública.',
      },
      ...(availableYearsStatistic ? [availableYearsStatistic] : []),
      {
        label: 'Gestión actual',
        value: stats.currentYearPublications.toString(),
        description: `Publicaciones incorporadas durante la gestión ${stats.currentYear}.`,
      },
      {
        label: 'Tipos de normativa',
        value: stats.documentTypesCount.toString(),
        description: 'Categorías principales de documentos municipales.',
      },
    ];
  });

  search(): void {
    const term = this.searchTerm().trim();
    this.router.navigate(['/normativas'], { queryParams: term ? { term } : undefined });
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
