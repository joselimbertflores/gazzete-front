import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';

import { PublicDocumentDetailResp, PublicDocumentRelation } from '../../types';
import { environment } from '../../../../../environments/environment';
import { PublicDocumentsApi } from '../../services';
import { FileSizePipe } from '../../../../shared';

type LegalStatusSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';

@Component({
  selector: 'app-document-detail',
  imports: [CommonModule, RouterModule, SkeletonModule, ButtonModule, TagModule, FileSizePipe],
  templateUrl: './document-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentDetail {
  private documentApi = inject(PublicDocumentsApi);
  private location = inject(Location);
  private router = inject(Router);
  private readonly dateFormatter = new Intl.DateTimeFormat('es-BO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  id = input.required<string>();

  readonly skeletonItems = Array.from({ length: 3 }, (_, index) => index);

  docResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.documentApi.getPublicDocumentDetail(params.id),
  });

  document = computed(() => this.docResource.value());
  outgoingRelations = computed(() => this.document()?.relations?.outgoing ?? []);
  incomingRelations = computed(() => this.normalizeIncoming(this.document()?.relations?.incoming));
  hasRelations = computed(
    () => this.outgoingRelations().length > 0 || this.incomingRelations().length > 0,
  );

  goBack(): void {
    if (window.history.length > 2) {
      this.location.back();
    } else {
      this.router.navigate(['/normativas']);
    }
  }

  documentIdentity(document: PublicDocumentDetailResp): string {
    return `${document.typeName} ${document.code}`.trim();
  }

  legalStatusLabel(status: string | null | undefined): string {
    switch (status) {
      case 'VALID':
        return 'Vigente';
      case 'ABROGATED':
        return 'Abrogada';
      case 'DEROGATED':
        return 'Derogada';
      case 'MODIFIED':
        return 'Modificada';
      default:
        return 'No registrado';
    }
  }

  legalStatusSeverity(status: string | null | undefined): LegalStatusSeverity {
    switch (status) {
      case 'VALID':
        return 'success';
      case 'ABROGATED':
        return 'danger';
      case 'DEROGATED':
        return 'warn';
      case 'MODIFIED':
        return 'info';
      default:
        return 'secondary';
    }
  }

  formatDate(value: string | null | undefined): string {
    if (!value) return 'No registrada';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'No registrada';

    return this.dateFormatter.format(date);
  }

  documentYear(document: PublicDocumentDetailResp): string {
    if (document.year) return String(document.year);
    if (!document.publicationDate) return 'No registrada';

    const year = new Date(document.publicationDate).getFullYear();
    return Number.isFinite(year) ? String(year) : 'No registrada';
  }

  fileViewUrl(document: PublicDocumentDetailResp): string | null {
    return this.absoluteBackendUrl(document.file?.url);
  }

  fileDownloadUrl(document: PublicDocumentDetailResp): string | null {
    const downloadUrl = this.absoluteBackendUrl(document.file?.downloadUrl);
    if (downloadUrl) return downloadUrl;

    const viewUrl = this.fileViewUrl(document);
    if (!viewUrl) return null;

    return `${viewUrl}${viewUrl.includes('?') ? '&' : '?'}download=true`;
  }

  downloadCountLabel(count: number | null | undefined): string {
    const value = count ?? 0;
    return `${value} ${value === 1 ? 'descarga' : 'descargas'}`;
  }

  mimeTypeLabel(mimeType: string | null | undefined): string | null {
    if (!mimeType || mimeType === 'application/pdf') return null;
    return mimeType;
  }

  relationTargetIdentity(relation: PublicDocumentRelation): string {
    return `${relation.document.typeName} ${relation.document.code}`.trim();
  }

  outgoingRelationVerb(relationType: string | null | undefined): string {
    switch (this.normalizeRelationType(relationType)) {
      case 'MODIFIES':
      case 'MODIFICA':
        return 'MODIFICA';
      case 'DEROGATES':
      case 'DEROGA':
      case 'REPEALS':
        return 'DEROGA';
      case 'ABROGATES':
      case 'ABROGA':
        return 'ABROGA';
      case 'REPLACES':
      case 'REEMPLAZA':
        return 'REEMPLAZA';
      case 'COMPLEMENTS':
      case 'COMPLEMENTA':
        return 'COMPLEMENTA';
      case 'REGULATES':
      case 'REGLAMENTA':
        return 'REGLAMENTA';
      default:
        return 'AFECTA';
    }
  }

  incomingRelationVerb(relationType: string | null | undefined): string {
    switch (this.normalizeRelationType(relationType)) {
      case 'MODIFIES':
      case 'MODIFICA':
        return 'MODIFICADA';
      case 'DEROGATES':
      case 'DEROGA':
      case 'REPEALS':
        return 'DEROGADA';
      case 'ABROGATES':
      case 'ABROGA':
        return 'ABROGADA';
      case 'REPLACES':
      case 'REEMPLAZA':
        return 'REEMPLAZADA';
      case 'COMPLEMENTS':
      case 'COMPLEMENTA':
        return 'COMPLEMENTADA';
      case 'REGULATES':
      case 'REGLAMENTA':
        return 'REGLAMENTADA';
      default:
        return 'AFECTADA';
    }
  }

  trackRelation(_index: number, relation: PublicDocumentRelation): string {
    return `${relation.relationType}-${relation.document.id}`;
  }

  trackSkeleton(index: number): number {
    return index;
  }

  notFoundTitle(): string {
    return this.docResource.error()
      ? 'No se pudo encontrar la normativa.'
      : 'Normativa no disponible.';
  }

  notFoundDescription(): string {
    return this.docResource.error()
      ? 'El documento solicitado no existe, fue retirado o no está disponible para consulta pública.'
      : 'Vuelve al listado para consultar otras normativas publicadas.';
  }

  private normalizeIncoming(
    incoming: PublicDocumentRelation | PublicDocumentRelation[] | null | undefined,
  ): PublicDocumentRelation[] {
    if (!incoming) return [];
    return Array.isArray(incoming) ? incoming : [incoming];
  }

  private normalizeRelationType(relationType: string | null | undefined): string {
    return (relationType ?? '')
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, '_');
  }

  private absoluteBackendUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    if (/^(https?:)?\/\//.test(url) || url.startsWith('blob:') || url.startsWith('data:')) {
      return url;
    }

    const baseUrl = environment.baseUrl.replace(/\/$/, '');
    const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${normalizedUrl}`;
  }
}
