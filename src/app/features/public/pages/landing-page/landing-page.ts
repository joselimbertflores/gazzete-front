import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

interface DocumentTypeCard {
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly queryParams: Record<string, string>;
}

interface RecentPublication {
  readonly id: string;
  readonly type: string;
  readonly code: string;
  readonly date: string;
  readonly dateLabel: string;
  readonly summary: string;
}

interface FeaturedDocument {
  readonly id: string;
  readonly type: string;
  readonly title: string;
  readonly managementYear: number;
  readonly actionLabel: 'Ver PDF' | 'Ver detalle';
}

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
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TagModule,
  ],
  templateUrl: './landing-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LandingPage {
  readonly searchTerm = signal('');

  readonly documentTypes: DocumentTypeCard[] = [
    {
      name: 'Ordenanzas',
      description: 'Disposiciones municipales aprobadas por el Concejo Municipal.',
      icon: 'pi pi-building-columns',
      queryParams: { type: 'ordenanza' },
    },
    {
      name: 'Resoluciones',
      description: 'Determinaciones administrativas y legislativas de alcance municipal.',
      icon: 'pi pi-verified',
      queryParams: { type: 'resolucion' },
    },
    {
      name: 'Decretos',
      description: 'Normas emitidas por la autoridad ejecutiva municipal.',
      icon: 'pi pi-book',
      queryParams: { type: 'decreto' },
    },
    {
      name: 'Reglamentos',
      description: 'Instrumentos que desarrollan procedimientos y criterios de aplicación.',
      icon: 'pi pi-list-check',
      queryParams: { type: 'reglamento' },
    },
  ];

  readonly recentPublications: RecentPublication[] = [
    {
      id: 'ord-018-2026',
      type: 'Ordenanza Municipal',
      code: 'OM 018/2026',
      date: '2026-05-14',
      dateLabel: '14 mayo 2026',
      summary:
        'Aprueba ajustes al plan de mantenimiento de vías urbanas y define prioridades de intervención por distrito.',
    },
    {
      id: 'res-076-2026',
      type: 'Resolución Municipal',
      code: 'RM 076/2026',
      date: '2026-05-09',
      dateLabel: '9 mayo 2026',
      summary:
        'Autoriza la publicación del cronograma de regularización documental para unidades vecinales registradas.',
    },
    {
      id: 'dec-011-2026',
      type: 'Decreto Edil',
      code: 'DE 011/2026',
      date: '2026-04-30',
      dateLabel: '30 abril 2026',
      summary:
        'Establece lineamientos operativos para la atención ciudadana durante la gestión administrativa vigente.',
    },
    {
      id: 'reg-004-2026',
      type: 'Reglamento Municipal',
      code: 'RG 004/2026',
      date: '2026-04-22',
      dateLabel: '22 abril 2026',
      summary:
        'Regula la recepción, digitalización y custodia de expedientes normativos del Gobierno Municipal.',
    },
  ];

  readonly featuredDocuments: FeaturedDocument[] = [
    {
      id: 'ord-041-2025',
      type: 'Ordenanza',
      title: 'OM 041/2025 - Presupuesto institucional reformulado',
      managementYear: 2025,
      actionLabel: 'Ver detalle',
    },
    {
      id: 'reg-012-2024',
      type: 'Reglamento',
      title: 'RG 012/2024 - Procedimiento de archivo normativo municipal',
      managementYear: 2024,
      actionLabel: 'Ver PDF',
    },
    {
      id: 'dec-028-2023',
      type: 'Decreto',
      title: 'DE 028/2023 - Organización de servicios municipales esenciales',
      managementYear: 2023,
      actionLabel: 'Ver detalle',
    },
  ];

  readonly statistics: LandingStatistic[] = [
    {
      label: 'Documentos publicados',
      value: '1.284',
      description: 'Registros normativos disponibles para consulta pública.',
    },
    {
      label: 'Años disponibles',
      value: '14',
      description: 'Gestiones con publicaciones organizadas en el portal.',
    },
    {
      label: 'Gestión actual',
      value: '86',
      description: 'Publicaciones incorporadas durante la gestión 2026.',
    },
    {
      label: 'Tipos de normativa',
      value: '4',
      description: 'Categorías principales de documentos municipales.',
    },
  ];

  constructor(private readonly router: Router) {}

  search(): void {
    const term = this.searchTerm().trim();

    this.router.navigate(['/documents'], {
      queryParams: term ? { term } : undefined,
    });
  }
}
