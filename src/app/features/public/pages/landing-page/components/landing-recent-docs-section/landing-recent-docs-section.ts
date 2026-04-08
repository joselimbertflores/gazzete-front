import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { TagModule } from 'primeng/tag';

import { PublicDocumentResponse } from '../../../../types';

@Component({
  selector: 'landing-recent-docs-section',
  imports: [TagModule, RouterLink, DatePipe],
  template: `
    <section class="bg-surface-50">
      <div class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="text-2xl font-semibold tracking-tight text-surface-950">
              Documentos recientes
            </h2>
            <p class="mt-1.5 text-sm text-surface-600">
              Publicaciones más recientes de la Gaceta Municipal.
            </p>
          </div>

          <a
            routerLink="/documents"
            class="inline-flex items-center gap-2 text-sm font-medium text-surface-700 transition hover:text-primary-700"
          >
            Ver todos los documentos
            <i class="pi pi-arrow-right text-xs" aria-hidden="true"></i>
          </a>
        </div>

        <div class="mt-7 overflow-hidden rounded-2xl border border-surface-200 bg-surface-0">
          @if (isLoading()) {
            @for (i of [1, 2, 3, 4, 5]; track i) {
              <div class="border-b border-surface-200 px-5 py-5 sm:px-6">
                <div class="flex flex-col gap-4 lg:flex-row lg:justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <div class="h-5 w-20 rounded bg-surface-200 animate-pulse"></div>
                      <div class="h-4 w-32 rounded bg-surface-200 animate-pulse"></div>
                    </div>

                    <div class="mt-3 h-4 w-3/4 rounded bg-surface-200 animate-pulse"></div>
                    <div class="mt-2 h-3 w-2/3 rounded bg-surface-200 animate-pulse"></div>
                  </div>

                  <div class="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                    <div class="h-10 w-full rounded bg-surface-200 animate-pulse sm:w-28"></div>
                    <div class="h-10 w-full rounded bg-surface-200 animate-pulse sm:w-28"></div>
                  </div>
                </div>
              </div>
            }
          } @else if (documents()?.length === 0) {
            <div class="px-6 py-10 text-center">
              <p class="text-sm text-surface-500">No hay publicaciones recientes disponibles.</p>
            </div>
          } @else {
            @for (document of documents(); track document.id) {
              <article class="border-b border-surface-200 last:border-b-0">
                <div
                  class="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6"
                >
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2.5 text-sm">
                      @switch (document.legalStatus) {
                        @case ('VALID') {
                          <p-tag severity="success" value="Vigente" [rounded]="true" />
                        }
                        @case ('ABROGATED') {
                          <p-tag severity="danger" value="Abrogada" [rounded]="true" />
                        }
                        @case ('DEROGATED') {
                          <p-tag severity="warn" value="Derogada" [rounded]="true" />
                        }
                        @case ('MODIFIED') {
                          <p-tag severity="info" value="Modificada" [rounded]="true" />
                        }
                        @default {
                          <p-tag severity="secondary" value="Desconocido" [rounded]="true" />
                        }
                      }

                      <span class="text-surface-500">
                        Publicado el {{ document.publicationDate | date: 'd MMM y' }}
                      </span>
                    </div>

                    <h3 class="mt-3 text-base font-semibold leading-7 text-surface-950 sm:text-lg">
                      {{ document.type }}
                      <span class="text-surface-700">Nº {{ document.code }}</span>
                    </h3>

                    <p class="mt-2 line-clamp-2 text-sm leading-6 text-surface-600">
                      {{ document.summary }}
                    </p>
                  </div>

                  <div class="flex w-full shrink-0 flex-col gap-2 sm:flex-row lg:w-auto">
                    <a
                      [href]="document.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-primary-50 transition hover:bg-primary-700"
                    >
                      Abrir PDF
                    </a>

                    <a
                      [routerLink]="['/documents', document.id]"
                      class="inline-flex items-center justify-center rounded-lg border border-surface-300 bg-surface-0 px-4 py-2.5 text-sm font-medium text-surface-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                    >
                      Ver detalle
                    </a>
                  </div>
                </div>
              </article>
            }
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingRecentDocsSection {
  documents = input.required<PublicDocumentResponse[] | undefined>();
  isLoading = input(false);
}
