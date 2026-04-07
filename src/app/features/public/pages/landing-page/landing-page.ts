import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { DocumentPublicApi } from '../../services';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-landing-page',
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputGroupModule,
    FloatLabelModule,
    TagModule,
  ],
  templateUrl: './landing-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LandingPage {
  private router = inject(Router);
  readonly currentYear = new Date().getFullYear();
  readonly searchTerm = signal('');

  private docPublicApi = inject(DocumentPublicApi);

  typeChips = computed(() =>
    this.docPublicApi.docTypes().map((type) => ({
      label: type.label,
      queryParams: { type: type.value },
    })),
  );

  recentDocuments = this.docPublicApi.recentDocuments;

  readonly quickChips = [
    { label: 'Todos los documentos', queryParams: {} },
    { label: 'Vigentes', queryParams: { legalStatus: 'VALID' } },
    { label: `Gestión ${this.currentYear}`, queryParams: { year: this.currentYear } },
    { label: `Gestión ${this.currentYear - 1}`, queryParams: { year: this.currentYear - 1 } },
    { label: 'Abrogadas', queryParams: { legalStatus: 'ABROGATED' } },
  ];

  search(): void {
    if (!this.searchTerm().trim()) return;
    this.router.navigate(['/documents'], { queryParams: { term: this.searchTerm() } });
  }

  
}
