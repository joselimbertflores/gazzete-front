import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';

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

import { map } from 'rxjs';

import { DocumentPublicApi, GetPublicDocumentsParams } from '../../services';

@Component({
  selector: 'app-documents-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PanelModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    RouterModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    DatePickerModule,
    SkeletonModule,
    TagModule,
  ],
  templateUrl: './documents-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentsPage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private documentPublicApi = inject(DocumentPublicApi);

  readonly documentStatuses = [
    { label: 'VIGENTE', value: 'VALID' },
    { label: 'ABROGADA', value: 'ABROGATED' },
    { label: 'DEROGADA', value: 'DEROGATED' },
    { label: 'MODIFICADA', value: 'MODIFIED' },
  ];

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

  dataResource = rxResource({
    params: () => this.queryParams(),
    stream: ({ params }) => this.documentPublicApi.findAll(params),
  });

  constructor() {
    effect(() => {
      const params = this.queryParams();
      this.filterForm.patchValue(params ?? {}, { emitEvent: false });
    });
  }

  onSubmit(): void {
    const { term, type, year, legalStatus } = this.filterForm.value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        term: term || null,
        type: type || null,
        year: year || null,
        legalStatus: legalStatus || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  resetFilters(): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
  }
}
