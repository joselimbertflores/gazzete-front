import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { PublicDocumentRelation, PublicDocumentResponse } from '../../../types';
import { FileSizePipe } from '../../../../../shared';

type LegalStatusSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger';

type LegalStatusUi = {
  label: string;
  severity: LegalStatusSeverity;
};

const LEGAL_STATUS_UI = {
  VALID: { label: 'Vigente', severity: 'success' },
  ABROGATED: { label: 'Abrogada', severity: 'danger' },
  DEROGATED: { label: 'Derogada', severity: 'warn' },
  MODIFIED: { label: 'Modificada', severity: 'info' },
} as const satisfies Record<string, LegalStatusUi>;

const UNKNOWN_LEGAL_STATUS_UI: LegalStatusUi = {
  label: 'No registrado',
  severity: 'secondary',
};

const INCOMING_RELATION_DESCRIPTIONS: Record<string, string> = {
  MODIFIES: 'Esta normativa fue modificada por',
  DEROGATES: 'Esta normativa fue derogada por',
  ABROGATES: 'Esta normativa fue abrogada por',
};

@Component({
  selector: 'public-document-card',
  standalone: true,
  imports: [RouterLink, DatePipe, ButtonModule, TagModule, FileSizePipe],
  template: `
    @let item = document();

    <article
      class="flex flex-col overflow-hidden rounded-xl border border-surface-200 bg-surface-0 shadow-sm hover:border-primary-200 hover:shadow-md"
    >
      <div class="flex flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-start md:gap-6">
        <div class="flex shrink-0 items-center gap-3 md:w-20 md:flex-col md:justify-center">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-lg border border-surface-100 bg-surface-50 text-surface-500 sm:h-14 sm:w-14 md:h-16 md:w-16"
          >
            <i class="pi pi-file-pdf" style="font-size: 1.65rem" aria-hidden="true"></i>
          </div>

          <span class="text-xs font-medium text-surface-500">
            {{ item.file.sizeBytes | fileSize }}
          </span>
        </div>

        <div class="flex min-w-0 flex-1 flex-col gap-2">
          <div
            class="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3"
          >
            <h2 class="text-pretty text-lg font-bold leading-tight text-surface-900 md:text-xl">
              {{ item.typeName }} {{ item.code }}
            </h2>

            @let statusUi = legalStatusUi(item.legalStatus);
            <p-tag [severity]="statusUi.severity" [value]="statusUi.label" [rounded]="true" />
          </div>

          <p class="line-clamp-3 text-sm leading-relaxed text-surface-600 sm:line-clamp-2">
            {{ item.summary || 'Sin resumen registrado.' }}
          </p>

          <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-surface-500">
            <span class="inline-flex items-center gap-1.5">
              <i class="pi pi-calendar text-xs" aria-hidden="true"></i>
              <span>
                <span class="font-medium text-surface-600">Publicado:</span>
                {{ item.publicationDate | date: 'dd/MM/yyyy' }}
              </span>
            </span>

            <span class="inline-flex items-center gap-1.5">
              <i class="pi pi-calendar-clock text-xs" aria-hidden="true"></i>
              Gestión {{ item.year }}
            </span>

            @if (showsDownloadCount(item)) {
              <span class="inline-flex items-center gap-1.5">
                <i class="pi pi-download text-xs" aria-hidden="true"></i>
                {{ item.downloadCount }} descargas
              </span>
            }
          </div>
        </div>

        <div
          class="flex shrink-0 flex-col gap-2 border-t border-surface-100 pt-4 md:w-40 md:border-l md:border-t-0 md:pl-6 md:pt-0"
        >
          <a
            pButton
            [outlined]="true"
            severity="secondary"
            size="small"
            class="w-full justify-center"
            [routerLink]="['/normativas', item.id]"
            [state]="{ from: 'documents-list' }"
            icon="pi pi-arrow-right"
            label="Ver detalle"
          ></a>

          <a
            pButton
            size="small"
            class="w-full justify-center"
            icon="pi pi-download"
            label="Descargar"
            [href]="item.file.url + '?download=true'"
            rel="noopener noreferrer"
          ></a>
        </div>
      </div>

      @if (item.validUntil || item.incomingRelation) {
        <div class="border-t border-surface-100 p-2 pt-0 sm:p-4 sm:pt-0">
          <div class="space-y-2 pt-4">
            @if (item.incomingRelation; as relation) {
              <div
                class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm leading-6 text-amber-950"
              >
                <p>
                  {{ relationDescription(relation) }}
                  <a
                    [routerLink]="['/normativas', relation.document.id]"
                    [state]="{ from: 'documents-list' }"
                    class="font-semibold text-primary-700 hover:text-primary-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    {{ relation.document.typeName }} {{ relation.document.code }} </a
                  >.
                </p>

                @if (relation.note) {
                  <p class="mt-1 text-sm leading-5 text-amber-900/80">
                    <span class="font-medium">Nota:</span>
                    {{ relation.note }}
                  </p>
                }
              </div>
            }

            @if (item.validUntil) {
              <div
                class="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2.5 text-sm leading-6 text-surface-700"
              >
                <p>
                  <span class="font-semibold text-surface-800">Vigente hasta:</span>
                  {{ item.validUntil | date: 'dd/MM/yyyy' }}
                </p>
              </div>
            }
          </div>
        </div>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicDocumentCard {
  readonly document = input.required<PublicDocumentResponse>();

  legalStatusUi(status: string | null | undefined): LegalStatusUi {
    return LEGAL_STATUS_UI[status as keyof typeof LEGAL_STATUS_UI] ?? UNKNOWN_LEGAL_STATUS_UI;
  }

  showsDownloadCount(document: PublicDocumentResponse): boolean {
    return (document.downloadCount ?? 0) >= 10;
  }

  relationDescription(relation: PublicDocumentRelation): string {
    const customDescription = relation.description?.trim();
    if (customDescription) return customDescription;

    return (
      INCOMING_RELATION_DESCRIPTIONS[relation.relationType.trim().toUpperCase()] ??
      'Esta normativa fue afectada por'
    );
  }
}
