import {
  Component,
  computed,
  effect,
  inject,
  input,
  PLATFORM_ID,
  RESPONSE_INIT,
} from '@angular/core';
import { DatePipe, isPlatformBrowser, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';

import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { PublicDocumentsApi } from '../../services';
import { PublicDocumentDetail } from '../../types';
import { FileSizePipe } from '../../../../shared';
import { SeoService } from '../../../../core/seo/seo.service';

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

const DOCUMENT_DETAIL_BACK_SOURCES = ['documents-list', 'document-detail', 'landing'] as const;
type DocumentDetailBackSource = (typeof DOCUMENT_DETAIL_BACK_SOURCES)[number];

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
  private readonly responseInit = inject(RESPONSE_INIT);
  private readonly seo = inject(SeoService);

  slug = input.required<string>();

  readonly docResource = rxResource({
    params: () => ({ slug: this.slug() }),
    stream: ({ params }) => this.documentApi.getDocumentDetail(params.slug),
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

  private readonly metadataEffect = effect(() => {
    const state = this.viewState();

    if (state.state === 'ready' && state.document) {
      const document = state.document;
      const documentName = `${document.typeName} ${document.code}`;
      const description =
        document.summary?.trim() ||
        `Consulta ${documentName} y otras normativas municipales oficiales de Sacaba.`;

      this.seo.setPage({
        title: `${documentName} | Gaceta Municipal de Sacaba`,
        description,
        path: `/normativas/${encodeURIComponent(document.slug)}`,
        type: 'article',
      });
      return;
    }

    if (state.state === 'error') {
      const resourceError = this.docResource.error();
      const isNotFound = resourceError instanceof HttpErrorResponse && resourceError.status === 404;

      if (isNotFound && this.responseInit) {
        this.responseInit.status = 404;
      }

      this.seo.setPage({
        title: isNotFound
          ? 'Normativa no encontrada | Gaceta Municipal de Sacaba'
          : 'No se pudo cargar la normativa | Gaceta Municipal de Sacaba',
        description:
          state.error?.description || 'Consulta la normativa municipal oficial de Sacaba.',
        path: null,
        type: 'website',
      });
      return;
    }

    this.seo.setPage({
      title: 'Normativa | Gaceta Municipal de Sacaba',
      description:
        'Consulta normativa municipal oficial publicada por el Gobierno Autónomo Municipal de Sacaba.',
      path: null,
      type: 'article',
    });
  });

  readonly skeletonItems = Array.from({ length: 3 }, (_, index) => index);
  readonly metadataSkeletonItems = Array.from({ length: 5 }, (_, index) => index);

  goBack(): void {
    if (this.hasKnownInternalReferrer()) {
      this.location.back();
      return;
    }

    this.router.navigate(['/normativas']);
  }

  private hasKnownInternalReferrer(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    const state = history.state as { from?: string };

    return DOCUMENT_DETAIL_BACK_SOURCES.includes(state.from as DocumentDetailBackSource);
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
