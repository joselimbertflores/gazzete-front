import { Component, inject } from '@angular/core';

import {
  LandingHeroSection,
  LandingDocTypesSection,
  LandingQuickAccessSection,
  LandingRecentDocsSection,
} from './components';
import { DocumentPublicApi } from '../../services';

@Component({
  selector: 'app-landing-page',
  imports: [
    LandingHeroSection,
    LandingDocTypesSection,
    LandingQuickAccessSection,
    LandingRecentDocsSection,
  ],
  templateUrl: './landing-page.html',
})
export default class LandingPage {
  private docPublicApi = inject(DocumentPublicApi);

  recentDocsResource = this.docPublicApi.recentDocsResource;
  docTypesResource = this.docPublicApi.docTypesResource;
}
