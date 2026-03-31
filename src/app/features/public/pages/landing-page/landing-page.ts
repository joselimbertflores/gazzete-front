import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';

interface LatestPublication {
  slug: string;
  code: string;
  title: string;
  type: string;
  publicationDate: string;
  status: 'Vigente' | 'Modificado' | 'Abrogado' | 'Derogado';
}

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
  ],
  templateUrl: './landing-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LandingPage {
  private router = inject(Router);
  readonly currentYear = new Date().getFullYear();
  readonly searchTerm = signal('');

  search(): void {
    if (!this.searchTerm().trim()) return;
    this.router.navigate(['/documents'], { queryParams: { term: this.searchTerm() } });
  }

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  onSearch(event: Event): void {
    event.preventDefault();

    const query = this.searchTerm().trim();
    if (!query) return;

    // luego aquí puedes navegar a /documents?q=...
    console.log(query);
  }

  readonly documents: LatestPublication[] = [
    {
      slug: 'ordenanza-municipal-014-2026',
      code: '014/2026',
      title: 'Ordenanza Municipal que regula las tasas de aseo urbano.',
      type: 'Ordenanza Municipal',
      publicationDate: '2026-03-14',
      status: 'Vigente',
    },
    {
      slug: 'resolucion-municipal-087-2026',
      code: '087/2026',
      title: 'Resolución Municipal sobre obras de infraestructura vecinal.',
      type: 'Resolución Municipal',
      publicationDate: '2026-03-05',
      status: 'Modificado',
    },
    {
      slug: 'decreto-municipal-118-2025',
      code: '118/2025',
      title: 'Decreto Municipal sobre restricciones temporales de circulación.',
      type: 'Decreto Municipal',
      publicationDate: '2025-11-03',
      status: 'Abrogado',
    },
    {
      slug: 'reglamento-municipal-003-2026',
      code: '003/2026',
      title: 'Reglamento para la gestión y custodia de archivos municipales.',
      type: 'Reglamento',
      publicationDate: '2026-02-18',
      status: 'Vigente',
    },
  ];

  statusClass(status: LatestPublication['status']): string {
    switch (status) {
      case 'Vigente':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200';
      case 'Modificado':
        return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200';
      case 'Abrogado':
        return 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200';
      case 'Derogado':
        return 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200';
    }
  }
}
