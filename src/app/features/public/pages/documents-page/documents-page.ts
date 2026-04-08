import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  afterRenderEffect,
  DestroyRef,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { rxResource, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import { DocumentPublicApi, GetPublicDocumentsParams } from '../../services';
import { WindowScrollStore } from '../../../../shared';

@Component({
  selector: 'app-documents-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    DatePickerModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    PaginatorModule,
    SkeletonModule,
    ButtonModule,
    SelectModule,
    RouterModule,
    TagModule,
  ],
  templateUrl: './documents-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentsPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private documentPublicApi = inject(DocumentPublicApi);
  private scrollStore = inject(WindowScrollStore);

  readonly documentStatuses = [
    { label: 'VIGENTE', value: 'VALID' },
    { label: 'ABROGADA', value: 'ABROGATED' },
    { label: 'DEROGADA', value: 'DEROGATED' },
    { label: 'MODIFICADA', value: 'MODIFIED' },
  ];

  private readonly scrollKey = this.router.url.split('?')[0];

  filterForm: FormGroup = inject(FormBuilder).group({
    term: [null],
    type: [null],
    year: [null],
    legalStatus: [null],
  });

  queryParams = toSignal<GetPublicDocumentsParams>(
    this.route.queryParams.pipe(
      map((params) => ({
        term: params['term'] || null,
        type: params['type'] || null,
        year: params['year'] || null,
        legalStatus: params['legalStatus'] || null,
        limit: params['limit'] ? Number(params['limit']) : 10,
        offset: params['offset'] ? Number(params['offset']) : 0,
      })),
    ),
  );

  limit = computed(() => this.queryParams()?.limit ?? 10);
  offset = computed(() => this.queryParams()?.offset ?? 0);

  docTypes = this.documentPublicApi.docTypes;

  dataResource = rxResource({
    params: () => this.queryParams(),
    stream: ({ params }) => this.documentPublicApi.findAll(params),
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

    this.filterForm.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    const { term, type, year, legalStatus } = this.filterForm.value;
    this.setQueryParams({ term, type, year, legalStatus, offset: 0 });
  }

  onPageChange(event: PaginatorState) {
    this.setQueryParams({ offset: event.first, limit: event.rows });
  }

  resetFilters(): void {
    if (this.route.snapshot.queryParamMap.keys.length === 0) return;
    this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
    this.filterForm.reset({}, { emitEvent: false });
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
}
