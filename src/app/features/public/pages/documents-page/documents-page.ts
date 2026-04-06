import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  afterRenderEffect,
  Component,
  effect,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';

import { finalize, map } from 'rxjs';

import { DocumentPublicApi, GetPublicDocumentsParams } from '../../services';
import { WindowScrollStore } from '../../../../shared';

@Component({
  selector: 'app-documents-page',
  imports: [
    FormsModule,
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
    PanelModule,
    TagModule,
  ],
  templateUrl: './documents-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentsPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private documentPublicApi = inject(DocumentPublicApi);
  private scrollStore = inject(WindowScrollStore);

  readonly documentStatuses = [
    { label: 'VIGENTE', value: 'VALID' },
    { label: 'ABROGADA', value: 'ABROGATED' },
    { label: 'DEROGADA', value: 'DEROGATED' },
    { label: 'MODIFICADA', value: 'MODIFIED' },
  ];

  private readonly scrollKey = this.router.url.split('?')[0];

  limit = 10;
  offset = 0;

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
        year: params['year'] ?? null,
        legalStatus: params['legalStatus'] ?? null,
        limit: params['limit'] ? Number(params['limit']) : 10,
        offset: params['offset'] ? Number(params['offset']) : 0,
      })),
    ),
  );

  shouldRestoreScroll = signal(false);

  docTypes = this.documentPublicApi.docTypes;

  dataResource = rxResource({
    params: () => this.queryParams(),
    stream: ({ params }) =>
      this.documentPublicApi
        .findAll(params)
        .pipe(finalize(() => this.shouldRestoreScroll.set(true))),
  });

  constructor() {
   

    afterRenderEffect(() => {
      if (this.shouldRestoreScroll()) {
        // * Resource ya terminó de cargar, cambia el shouldRestoreScroll a true en cada peticion, pero el effect solo detecta 1 cambio
        this.scrollStore.restoreScroll(this.scrollKey);
      }
    });
  }

  ngOnInit(): void {
    this.loadFilterParams();
  }

  applyFilters(): void {
    const { term, type, year, legalStatus } = this.filterForm.value;
    this.setQueryParams({ term, type, year, legalStatus, offset: 0 });
  }

  onPageChange(event: PaginatorState) {
    this.setQueryParams({ offset: event.first, limit: event.rows });
    this.limit = event.rows ?? 10;
    this.offset = event.first ?? 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetFilters(): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
    this.filterForm.reset();
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
    const { limit, offset, ...props }: GetPublicDocumentsParams = this.route.snapshot.queryParams;
    this.filterForm.patchValue(props);
    this.limit = limit ? Number(limit) : 10;
    this.offset = offset ? Number(offset) : 0;
  }
}
