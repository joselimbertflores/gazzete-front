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
      class="group flex flex-col overflow-hidden rounded-xl border border-surface-200 bg-surface-0 shadow-sm shadow-surface-950/5 transition duration-200 ease-out focus-within:border-primary-300 focus-within:shadow-lg hover:border-primary-300 hover:bg-primary-50/15 hover:shadow-lg hover:shadow-primary-950/10 motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none"
    >
      <div class="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-start md:gap-6">
        <div class="flex shrink-0 items-center gap-3 md:w-20 md:flex-col md:justify-center">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 text-primary-700 shadow-sm transition-colors duration-200 group-hover:border-primary-200 group-hover:bg-primary-100 group-hover:text-primary-800 md:h-16 md:w-16"
          >
            <i class="pi pi-file-pdf" style="font-size: 1.85rem" aria-hidden="true"></i>
          </div>

          <span class="text-xs font-semibold text-surface-500">
            {{ item.file.sizeBytes | fileSize }}
          </span>
        </div>

        <div class="flex min-w-0 flex-1 flex-col gap-2.5">
          <div
            class="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3"
          >
            <h2 class="text-pretty text-lg font-bold leading-tight tracking-tight text-surface-950 md:text-xl">
              {{ item.typeName }} {{ item.code }}
            </h2>

            @let statusUi = legalStatusUi(item.legalStatus);
            <p-tag [severity]="statusUi.severity" [value]="statusUi.label" [rounded]="true" />
          </div>

          <p class="line-clamp-3 text-sm leading-6 text-surface-600 sm:line-clamp-2">
            {{ item.summary || 'Sin resumen registrado.' }}
          </p>

          <div class="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-surface-500">
            <span class="inline-flex items-center gap-1.5">
              <i
                class="pi pi-calendar text-primary-600"
                style="font-size: 0.75rem"
                aria-hidden="true"
              ></i>
              <span>
                <span class="font-semibold text-surface-600">Publicado:</span>
                {{ item.publicationDate | date: 'dd/MM/yyyy' }}
              </span>
            </span>

            <span class="inline-flex items-center gap-1.5">
              <i
                class="pi pi-calendar-clock text-primary-600"
                style="font-size: 0.75rem"
                aria-hidden="true"
              ></i>
              Gestión {{ item.year }}
            </span>

            @if (showsDownloadCount(item)) {
              <span class="inline-flex items-center gap-1.5">
                <i
                  class="pi pi-download text-primary-600"
                  style="font-size: 0.75rem"
                  aria-hidden="true"
                ></i>
                {{ item.downloadCount }} descargas
              </span>
            }
          </div>
        </div>

        <div
          class="flex shrink-0 flex-col gap-2.5 border-t border-surface-100 pt-5 md:w-40 md:border-l md:border-t-0 md:pl-6 md:pt-0"
        >
          <a
            pButton
            [outlined]="true"
            severity="secondary"
            size="small"
            class="w-full justify-center"
            [routerLink]="['/normativas', item.slug]"
            [state]="{ from: 'documents-list' }"
          >
            <i pButtonIcon class="pi pi-arrow-right" aria-hidden="true"></i>
            <span pButtonLabel>Ver detalle</span>
          </a>

          <a
            pButton
            size="small"
            class="w-full justify-center"
            [href]="item.file.url + '?download=true'"
            rel="noopener noreferrer"
          >
            <i pButtonIcon class="pi pi-download" aria-hidden="true"></i>
            <span pButtonLabel>Descargar</span>
          </a>
        </div>
      </div>

      @if (item.validUntil || item.incomingRelation) {
        <div class="border-t border-surface-100 px-5 pb-5 sm:px-6 sm:pb-6">
          <div class="space-y-2 pt-4">
            @if (item.incomingRelation; as relation) {
              <div
                class="rounded-lg border border-accent-200 bg-accent-50 px-3 py-2.5 text-sm leading-6 text-accent-950"
              >
                <p>
                  {{ relationDescription(relation) }}
                  <a
                    [routerLink]="['/normativas', relation.document.slug]"
                    [state]="{ from: 'documents-list' }"
                    class="font-semibold text-primary-700 hover:text-primary-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    {{ relation.document.typeName }} {{ relation.document.code }} </a
                  >.
                </p>

                @if (relation.note) {
                  <p class="mt-1 text-sm leading-5 text-accent-900/80">
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
