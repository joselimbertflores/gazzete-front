import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

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

  readonly landingResource = rxResource({ stream: () => this.publicDocumentApi.getLandingData() });

  search(term: string): void {
    this.router.navigate(['/normativas'], { queryParams: term ? { term } : undefined });
  }
}
