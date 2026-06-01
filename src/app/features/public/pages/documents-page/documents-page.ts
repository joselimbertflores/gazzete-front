import {
  afterRenderEffect,
  DestroyRef,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { rxResource, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

import { debounceTime, map } from 'rxjs';

import { PublicDocumentsApi, GetPublicDocumentsParams } from '../../services';
import { WindowScrollStore } from '../../../../shared';
import { PublicDocumentResponse } from '../../types';
import { PublicDocumentCard } from './components';

type PublicDocumentsData = {
  documents: PublicDocumentResponse[];
  total: number;
};

@Component({
  selector: 'app-documents-page',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    PaginatorModule,
    SkeletonModule,
    ButtonModule,
    SelectModule,
    PublicDocumentCard,
  ],
  templateUrl: './documents-page.html',
  styles: `
    :host ::ng-deep .compact-paginator {
      font-size: 14px;
      --p-paginator-background: transparent;
      --p-paginator-padding: 0px;
      --p-select-padding-y: 0.1rem;
      --p-select-padding-x: 0.2rem;
    }
  `,
})
export default class DocumentsPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private scrollStore = inject(WindowScrollStore);
  private documentPublicApi = inject(PublicDocumentsApi);

  readonly rowsPerPageOptions = [10, 20, 30, 50];
  readonly yearOptions = this.buildYearOptions();

  readonly documentStatuses = [
    { label: 'Vigente', value: 'VALID' },
    { label: 'Abrogada', value: 'ABROGATED' },
    { label: 'Derogada', value: 'DEROGATED' },
    { label: 'Modificada', value: 'MODIFIED' },
  ];

  readonly documentTypes = toSignal(
    this.documentPublicApi
      .getTypeOptions()
      .pipe(map((options) => options.map(({ id, name }) => ({ label: name, value: String(id) })))),
    { initialValue: [] },
  );

  showAdvancedFilters = signal(false);

  filterForm = inject(FormBuilder).group({
    term: new FormControl<string | null>(null),
    type: new FormControl<string | null>(null),
    year: new FormControl<string | null>(null),
    legalStatus: new FormControl<string | null>(null),
  });

  queryParams = toSignal(
    this.route.queryParams.pipe(map((params) => this.mapQueryParams(params))),
    { initialValue: this.mapQueryParams(this.route.snapshot.queryParams) },
  );

  hasActiveFilters = computed(() => {
    const { term, type, year, legalStatus } = this.queryParams();
    return [term, type, year, legalStatus].some(Boolean);
  });

  activeAdvancedFiltersCount = computed(() => {
    const { type, year, legalStatus } = this.queryParams();
    return [type, year, legalStatus].filter(Boolean).length;
  });

  limit = computed(() => this.queryParams().limit);
  offset = computed(() => this.queryParams().offset);

  dataResource = rxResource<PublicDocumentsData, GetPublicDocumentsParams>({
    params: () => this.queryParams(),
    stream: ({ params }) => this.documentPublicApi.findAll(params),
  });

  readonly resultSkeletonItems = Array.from({ length: 5 }, (_, index) => index);

  private scrollRestored = false;

  constructor() {
    afterRenderEffect(() => {
      this.restoreScroll();
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

    this.setQueryParams({ offset, limit });
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters.update((value) => !value);
  }

  resetFilters(): void {
    this.filterForm.reset({}, { emitEvent: false });
    this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
  }

  private listenToFilterChanges(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(350), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.applyFilters());
  }

  private applyFilters(): void {
    const { term, type, year, legalStatus } = this.filterForm.value;

    const filters = {
      term: this.normalizeFilterValue(term),
      type: this.normalizeFilterValue(type),
      year: this.normalizeFilterValue(year),
      legalStatus: this.normalizeFilterValue(legalStatus),
    };

    const current = this.queryParams();

    const hasChanged =
      filters.term !== current.term ||
      filters.type !== current.type ||
      filters.year !== current.year ||
      filters.legalStatus !== current.legalStatus;

    if (!hasChanged) return;

    this.setQueryParams({ ...filters, offset: 0 });
  }

  private setQueryParams(params: object): void {
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

  private buildYearOptions() {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 15 }, (_, index) => {
      const year = currentYear - index;
      return { label: String(year), value: String(year) };
    });
  }

  private mapQueryParams(params: Record<string, string | undefined>) {
    return {
      term: params['term'] || null,
      type: params['type'] || null,
      year: params['year'] || null,
      legalStatus: params['legalStatus'] || null,
      limit: this.parseLimit(params['limit']),
      offset: this.parseOffset(params['offset']),
    };
  }

  private parseLimit(value: string | undefined): number {
    const parsed = Number(value);
    return this.rowsPerPageOptions.includes(parsed) ? parsed : 10;
  }

  private parseOffset(value: string | undefined): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
  }

  private restoreScroll(): void {
    if (this.scrollRestored) return;
    if (this.dataResource.isLoading()) return;
    this.scrollRestored = this.scrollStore.restoreScroll(this.router.url);
  }
}
