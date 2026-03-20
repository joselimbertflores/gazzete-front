import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

interface DocumentItem {
  slug: string;
  code: string;
  title: string;
  type: string;
  publicationDate: string;
  status: 'Vigente' | 'Modificado' | 'Abrogado' | 'Derogado';
}

@Component({
  selector: 'app-documents-page',
  imports: [InputTextModule, ButtonModule, SelectModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './documents-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentsPage {
  searchDraft = signal('');
  searchTerm = signal('');

  selectedType = signal<string | null>(null);
  selectedStatus = signal<string | null>(null);
  selectedYear = signal<number | null>(null);

  typeOptions = [
    { label: 'Todos los tipos', value: null },
    { label: 'Ordenanza Municipal', value: 'ordenanza' },
    { label: 'Decreto Municipal', value: 'decreto' },
    { label: 'Resolución Municipal', value: 'resolucion' },
    { label: 'Reglamento', value: 'reglamento' },
  ];

  statusOptions = [
    { label: 'Todos los estados', value: null },
    { label: 'Vigente', value: 'vigente' },
    { label: 'Modificado', value: 'modificado' },
    { label: 'Abrogado', value: 'abrogado' },
    { label: 'Derogado', value: 'derogado' },
  ];

  yearOptions = [
    { label: 'Todas las gestiones', value: null },
    { label: '2026', value: 2026 },
    { label: '2025', value: 2025 },
    { label: '2024', value: 2024 },
  ];

  documents = signal<DocumentItem[]>([
    {
      slug: 'ordenanza-014-2026',
      code: '014/2026',
      title: 'Ordenanza Municipal que regula las tasas de aseo urbano',
      type: 'Ordenanza Municipal',
      publicationDate: '2026-03-14',
      status: 'Vigente',
    },
    {
      slug: 'decreto-118-2025',
      code: '118/2025',
      title: 'Decreto Municipal sobre restricciones de circulación',
      type: 'Decreto Municipal',
      publicationDate: '2025-11-03',
      status: 'Abrogado',
    },
    {
      slug: 'resolucion-087-2026',
      code: '087/2026',
      title: 'Resolución Municipal sobre obras de infraestructura',
      type: 'Resolución Municipal',
      publicationDate: '2026-03-05',
      status: 'Modificado',
    },
    {
      slug: 'reglamento-003-2026',
      code: '003/2026',
      title: 'Reglamento para la gestión y custodia de archivos municipales',
      type: 'Reglamento',
      publicationDate: '2026-02-18',
      status: 'Vigente',
    },
  ]);

  onSearch(event: Event): void {
    event.preventDefault();
    this.searchTerm.set(this.searchDraft().trim());
  }

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchDraft.set(input.value);
  }

  clearFilters(): void {
    this.searchDraft.set('');
    this.searchTerm.set('');
    this.selectedType.set(null);
    this.selectedStatus.set(null);
    this.selectedYear.set(null);
  }

  loadMore(): void {
    // En datos de prueba no hay paginación real.
  }

  resultsLabel(): string {
    return `${this.documents().length} documento${this.documents().length === 1 ? '' : 's'}`;
  }

  selectedTypeLabel(): string {
    const match = this.typeOptions.find((o) => o.value === this.selectedType());
    return match ? match.label : '';
  }

  selectedStatusLabel(): string {
    const match = this.statusOptions.find((o) => o.value === this.selectedStatus());
    return match ? match.label : '';
  }

  statusClass(status: DocumentItem['status']): string {
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

  hasActiveFilters(): boolean {
    return !!(
      this.searchTerm() ||
      this.selectedType() ||
      this.selectedStatus() ||
      this.selectedYear()
    );
  }

  hasMore(): boolean {
    return false;
  }
}
