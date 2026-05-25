import { Component, computed, inject, input, PLATFORM_ID } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { DatePipe, isPlatformBrowser, Location } from '@angular/common';

import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { PublicDocumentsApi } from '../../services';
import { FileSizePipe } from '../../../../shared';
import { PublicDocumentDetail } from '../../types';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

interface RelationLabels {
  incoming: string;
  outgoing: string;
}

const LEGAL_STATUS_UI: Record<string, { label: string; severity: TagSeverity }> = {
  VALID: { label: 'Vigente', severity: 'success' },
  MODIFIED: { label: 'Modificada', severity: 'info' },
  DEROGATED: { label: 'Derogada', severity: 'warn' },
  ABROGATED: { label: 'Abrogada', severity: 'danger' },
};

const RELATION_TYPE_UI: Record<string, RelationLabels> = {
  MODIFIES: {
    incoming: 'modificada',
    outgoing: 'modifica',
  },
  DEROGATES: {
    incoming: 'derogada',
    outgoing: 'deroga',
  },
  ABROGATES: {
    incoming: 'abrogada',
    outgoing: 'abroga',
  },
} as const;

@Component({
  selector: 'app-document-detail',
  imports: [TagModule, RouterModule, ButtonModule, FileSizePipe, SkeletonModule, DatePipe],
  templateUrl: './document-detail.html',
})
export default class DocumentDetail {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly documentApi = inject(PublicDocumentsApi);
  private readonly platformId = inject(PLATFORM_ID);

  id = input.required<string>();

  readonly docResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.documentApi.getDocumentDetail(params.id),
  });

  readonly viewState = computed(() => {
    if (this.docResource.isLoading()) {
      return { state: 'loading' };
    }

    if (this.docResource.hasValue()) {
      return {
        state: 'ready',
        document: this.toViewModel(this.docResource.value()),
      };
    }

    const error = this.docResource.error();

    return {
      state: 'error',
      error: this.mapErrorToDetailState(error),
    };
  });

  readonly skeletonItems = Array.from({ length: 3 }, (_, index) => index);
  readonly metadataSkeletonItems = Array.from({ length: 5 }, (_, index) => index);

  goBack(): void {
    if (this.canUseBrowserBack()) {
      this.location.back();
      return;
    }

    this.router.navigate(['/normativas']);
  }

  private canUseBrowserBack(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const state = history.state as {
      from?: string;
    };

    return (
      state.from === 'documents-list' ||
      state.from === 'document-detail' ||
      state.from === 'landing'
    );
  }

  private toViewModel(doc: PublicDocumentDetail) {
    return {
      ...doc,
      legalStatusUi: LEGAL_STATUS_UI[doc.legalStatus] ?? {
        label: doc.legalStatus,
        severity: 'secondary',
      },
      relations: {
        incoming: doc.relations.incoming
          ? {
              ...doc.relations.incoming,
              relationLabel:
                RELATION_TYPE_UI[doc.relations.incoming.relationType]?.incoming ?? 'afectada',
            }
          : null,
        outgoing: doc.relations.outgoing.map((rel) => ({
          ...rel,
          relationLabel: RELATION_TYPE_UI[rel.relationType]?.outgoing ?? 'afecta',
        })),
      },
    };
  }

  private mapErrorToDetailState(error: unknown) {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 404:
          return {
            title: 'Normativa no encontrada',
            description: 'La normativa solicitada no existe o ya no se encuentra disponible.',
          };

        case 0:
          return {
            title: 'No se pudo cargar la normativa',
            description: 'Verifique su conexión a internet e intente nuevamente.',
          };

        default:
          return {
            title: 'No se pudo cargar la normativa',
            description: 'Por favor, intente nuevamente más tarde.',
          };
      }
    }
    return {
      title: 'No pudimos mostrar la normativa',
      description: 'Intente volver al listado de normativas.',
    };
  }
}
