import { CommonModule } from '@angular/common';
import {
  afterRenderEffect,
  linkedSignal,
  DestroyRef,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { rxResource, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
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
import { FileSizePipe, WindowScrollStore } from '../../../../shared';
import { PublicDocumentRelation, PublicDocumentResponse } from '../../types';

type PublicDocumentsData = {
  documents: PublicDocumentResponse[];
  total: number;
};

type LegalStatusSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';

const INCOMING_RELATION_DESCRIPTIONS: Record<string, string> = {
  MODIFIES: 'Esta normativa fue modificada por',
  DEROGATES: 'Esta normativa fue derogada por',
  ABROGATES: 'Esta normativa fue abrogada por',
};

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
  styles: `
    p-paginator {
      --p-paginator-background: transparent;
      --p-paginator-padding: 0.2rem 0.4rem;
    }
  `,
})
export default class DocumentsPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private scrollStore = inject(WindowScrollStore);
  private documentPublicApi = inject(PublicDocumentsApi);

  readonly documentStatuses = [
    { label: 'Vigente', value: 'VALID' },
    { label: 'Abrogada', value: 'ABROGATED' },
    { label: 'Derogada', value: 'DEROGATED' },
    { label: 'Modificada', value: 'MODIFIED' },
  ];

  private readonly scrollKey = this.router.url.split('?')[0];
  readonly rowsPerPageOptions = [10, 20, 30, 50];
  readonly yearOptions = this.buildYearOptions();

  filterForm = inject(FormBuilder).group({
    term: new FormControl<string | null>(null),
    type: new FormControl<number | null>(null),
    year: new FormControl<number | null>(null),
    legalStatus: new FormControl<string | null>(null),
  });

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
  showAdvancedFilters = signal(false);

  readonly documentTypes = toSignal(this.documentPublicApi.getTypeOptions(), { initialValue: [] });

  queryParams = toSignal(
    this.route.queryParams.pipe(map((params) => this.mapQueryParams(params))),
    { initialValue: this.mapQueryParams(this.route.snapshot.queryParams) },
  );

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
    this.listenToFilterChanges();
  }

  onPageChange(event: PaginatorState) {
    if (this.dataResource.isLoading()) return;

    const offset = event.first ?? 0;
    const limit = event.rows ?? this.limit();
    if (offset === this.offset() && limit === this.limit()) return;

    this.setQueryParams({ offset, limit });
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters.update((value) => !value);
  }

  resetFilters(): void {
    this.filterForm.reset({}, { emitEvent: false });
    this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
  }

  documentYear(document: PublicDocumentResponse): string {
    if (document.year) return String(document.year);
    if (!document.publicationDate) return 'No registrada';

    const year = new Date(document.publicationDate).getFullYear();
    return Number.isFinite(year) ? String(year) : 'No registrada';
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

  relationDescription(relation: PublicDocumentRelation): string {
    const customDescription = relation.description?.trim();
    if (customDescription) return customDescription;

    return (
      INCOMING_RELATION_DESCRIPTIONS[relation.relationType.trim().toUpperCase()] ??
      'Esta normativa fue afectada por'
    );
  }

  private mapQueryParams(params: Record<string, string | undefined>) {
    return {
      term: params['term'] || null,
      type: params['type'] || null,
      year: params['year'] || null,
      legalStatus: params['legalStatus'] || null,
      limit: params['limit'] ? Number(params['limit']) : 10,
      offset: params['offset'] ? Number(params['offset']) : 0,
    };
  }

  private buildYearOptions() {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 15 }, (_, index) => {
      const year = currentYear - index;
      return { label: String(year), value: String(year) };
    });
  }


  private listenToFilterChanges(): void {
    this.filterForm.controls.term.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.applyFilters());

    const controls: AbstractControl[] = [
      this.filterForm.controls.type,
      this.filterForm.controls.year,
      this.filterForm.controls.legalStatus,
    ];

    controls.forEach((control) => {
      control.valueChanges
        .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.applyFilters());
    });
  }

  private applyFilters(): void {
    const { term, type, year, legalStatus } = this.filterForm.controls;

    this.setQueryParams({
      term: this.normalizeFilterValue(term.value),
      type: this.normalizeFilterValue(type.value),
      year: this.normalizeFilterValue(year.value),
      legalStatus: this.normalizeFilterValue(legalStatus.value),
      offset: 0,
    });
  }

  private setQueryParams(params: GetPublicDocumentsParams): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private normalizeFilterValue(value: unknown): string | null {
    if (value == null) return null;
    const normalized = String(value).trim();
    return normalized.length ? normalized : null;
  }

  private loadFilterParams(): void {
    this.filterForm.patchValue(this.route.snapshot.queryParams, { emitEvent: false });
  }
}
