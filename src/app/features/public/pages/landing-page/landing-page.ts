import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { SeoService } from '../../../../core/seo/seo.service';
import { PublicDocumentsApi } from '../../services';
import {
  LandingHero,
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
  private readonly seo = inject(SeoService);

  readonly landingResource = rxResource({ stream: () => this.publicDocumentApi.getLandingData() });

  constructor() {
    this.seo.setPage({
      title: 'Gaceta Municipal de Sacaba',
      description:
        'Consulta la normativa municipal oficial publicada por el Gobierno Autónomo Municipal de Sacaba.',
      path: '/',
      type: 'website',
    });
  }

  search(term: string): void {
    this.router.navigate(['/normativas'], { queryParams: term ? { term } : undefined });
  }
}
