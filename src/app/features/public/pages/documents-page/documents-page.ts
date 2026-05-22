import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  afterRenderEffect,
  DestroyRef,
  Component,
  computed,
  inject,
  linkedSignal,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { rxResource, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import { PublicDocumentsApi, GetPublicDocumentsParams } from '../../services';
import { PublicDocumentResponse } from '../../types';
import { FileSizePipe, WindowScrollStore } from '../../../../shared';

type PublicDocumentsData = {
  documents: PublicDocumentResponse[];
  total: number;
};

type LegalStatusSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';

const EMPTY_DOCUMENTS_DATA: PublicDocumentsData = {
  documents: [],
  total: 0,
};

@Component({
  selector: 'app-documents-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    PaginatorModule,
    SkeletonModule,
    ButtonModule,
    SelectModule,
    TagModule,
    RouterModule,
    FileSizePipe,
  ],
  templateUrl: './documents-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentsPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private documentPublicApi = inject(PublicDocumentsApi);
  private scrollStore = inject(WindowScrollStore);
  private readonly publicationDateFormatter = new Intl.DateTimeFormat('es-BO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  readonly documentStatuses = [
    { label: 'Vigente', value: 'VALID' },
    { label: 'Abrogada', value: 'ABROGATED' },
    { label: 'Derogada', value: 'DEROGATED' },
    { label: 'Modificada', value: 'MODIFIED' },
  ];

  private readonly scrollKey = this.router.url.split('?')[0];
  readonly rowsPerPageOptions = [10, 20, 30, 50];
  readonly yearOptions = this.buildYearOptions();

  filterForm: FormGroup = inject(FormBuilder).group({
    term: [null],
    type: [null],
    year: [null],
    legalStatus: [null],
  });

  queryParams = toSignal(
    this.route.queryParams.pipe(map((params) => this.mapQueryParams(params))),
    { initialValue: this.mapQueryParams(this.route.snapshot.queryParams) },
  );

  limit = computed(() => this.queryParams()?.limit ?? 10);
  offset = computed(() => this.queryParams()?.offset ?? 0);
  hasActiveFilters = computed(() => {
    const params = this.queryParams();
    return Boolean(params?.term || params?.type || params?.year || params?.legalStatus);
  });
  activeAdvancedFiltersCount = computed(() => {
    const params = this.queryParams();
    return [params?.type, params?.year, params?.legalStatus].filter(Boolean).length;
  });
  showMobileAdvancedFilters = signal(false);

  docTypes = this.documentPublicApi.docTypes;

  dataResource = rxResource<PublicDocumentsData, GetPublicDocumentsParams>({
    params: () => this.queryParams(),
    stream: ({ params }) => this.documentPublicApi.findAll(params),
  });

  visibleData = linkedSignal<PublicDocumentsData | undefined, PublicDocumentsData>({
    source: () => this.dataResource.value(),
    computation: (data, previous) => data ?? previous?.value ?? EMPTY_DOCUMENTS_DATA,
  });

  resultSkeletonItems = computed(() => {
    const documentCount = this.visibleData().documents.length;
    const count = documentCount || this.limit();
    return Array.from({ length: Math.max(1, count) }, (_, index) => index);
  });

  constructor() {
    afterRenderEffect(() => {
      if (!this.dataResource.isLoading()) {
        this.scrollStore.restoreScroll(this.scrollKey);
      }
    });
  }

  ngOnInit(): void {
    this.loadFilterParams();

    this.filterForm
      .get('term')
      ?.valueChanges.pipe(
        debounceTime(350),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.applyFilters());

    for (const controlName of ['type', 'year', 'legalStatus']) {
      this.filterForm
        .get(controlName)
        ?.valueChanges.pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.applyFilters());
    }
  }

  applyFilters(): void {
    const { term, type, year, legalStatus } = this.filterForm.value;
    this.setQueryParams({
      term: this.normalizeFilterValue(term),
      type: this.normalizeFilterValue(type),
      year: this.normalizeFilterValue(year),
      legalStatus: this.normalizeFilterValue(legalStatus),
      offset: 0,
    });
  }

  onPageChange(event: PaginatorState) {
    if (this.dataResource.isLoading()) return;

    const offset = event.first ?? 0;
    const limit = event.rows ?? this.limit();
    if (offset === this.offset() && limit === this.limit()) return;

    this.setQueryParams({ offset, limit });
  }

  toggleMobileAdvancedFilters(): void {
    this.showMobileAdvancedFilters.update((value) => !value);
  }

  resetFilters(): void {
    this.filterForm.reset({}, { emitEvent: false });
    this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
  }

  documentIdentity(document: PublicDocumentResponse): string {
    return `${document.type} ${document.code}`.trim();
  }

  documentYear(document: PublicDocumentResponse): string {
    if (document.year) return String(document.year);
    if (!document.publicationDate) return 'No registrada';

    const year = new Date(document.publicationDate).getFullYear();
    return Number.isFinite(year) ? String(year) : 'No registrada';
  }

  fileSize(document: PublicDocumentResponse): string | number | null {
    return document.file.sizeBytes ?? document.file.size ?? null;
  }

  publicationDateLabel(document: PublicDocumentResponse): string {
    if (!document.publicationDate) return 'No registrada';

    const date = new Date(document.publicationDate);
    if (Number.isNaN(date.getTime())) return 'No registrada';

    return this.publicationDateFormatter.format(date).replace(/\./g, '');
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

  private setQueryParams(params: GetPublicDocumentsParams) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private loadFilterParams() {
    this.filterForm.patchValue(this.route.snapshot.queryParams, { emitEvent: false });
  }

  private mapQueryParams(params: Record<string, string | undefined>): GetPublicDocumentsParams {
    return {
      term: params['term'] || null,
      type: params['type'] || null,
      year: params['year'] || null,
      legalStatus: params['legalStatus'] || null,
      limit: params['limit'] ? Number(params['limit']) : 10,
      offset: params['offset'] ? Number(params['offset']) : 0,
    };
  }

  private normalizeFilterValue(value: unknown): string | null {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed.length ? trimmed : null;
    }

    if (typeof value === 'number') return String(value);
    return value === undefined ? null : (value as string | null);
  }

  private buildYearOptions() {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 80 }, (_, index) => {
      const year = currentYear - index;
      return { label: String(year), value: String(year) };
    });
  }
}
