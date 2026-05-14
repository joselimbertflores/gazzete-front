import {
  ChangeDetectionStrategy,
  linkedSignal,
  Component,
  inject,
  signal,
  computed,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';

import { TableModule, TablePageEvent } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { MenuItem } from 'primeng/api';

import { DocumentDetail, DocumentEditor, DocumentStateSwitcher } from '../../dialogs';
import { SearchInput } from '../../../../../shared';
import { DocumentResponse } from '../../interfaces';
import { DocumentAdminApi } from '../../services';
@Component({
  selector: 'app-documents-admin',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    DatePickerModule,
    TooltipModule,
    PopoverModule,
    SelectModule,
    ButtonModule,
    TableModule,
    MenuModule,
    TagModule,
    SearchInput,

    UpperCasePipe,
    TitleCasePipe,
  ],
  templateUrl: './documents-admin.html',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentsAdmin {
  private dialogService = inject(DialogService);
  private documentApi = inject(DocumentAdminApi);

  resource = rxResource({
    params: () => ({
      limit: this.limit(),
      offset: this.offset(),
      term: this.searchTerm(),
    }),
    stream: ({ params }) =>
      this.documentApi.findAll({
        limit: params.limit,
        offset: params.offset,
        term: params.term,
        ...this.filterForm.value,
      }),
  });

  limit = signal(10);
  offset = signal(0);
  searchTerm = signal('');
  dataSource = linkedSignal(() =>
    this.resource.hasValue() ? this.resource.value().documents : [],
  );
  dataSize = linkedSignal(() => (this.resource.hasValue() ? this.resource.value().total : 0));
  menuItems: MenuItem[] = [];

  readonly documentTypes = this.documentApi.documentTypes;
  readonly documentStatuses = [
    { label: 'VIGENTE', value: 'VALID' },
    { label: 'ABROGADA', value: 'ABROGATED' },
    { label: 'DEROGADA', value: 'DEROGATED' },
    { label: 'MODIFICADA', value: 'MODIFIED' },
  ];

  filterForm: FormGroup = inject(FormBuilder).group({
    typeId: [null],
    year: [null],
    legalStatus: [null],
  });

  readonly filtersValue = toSignal(this.filterForm.valueChanges, {
    initialValue: this.filterForm.getRawValue(),
  });

  readonly activeFiltersCount = computed(() => {
    const value = this.filtersValue();
    return Object.values(value).filter((v) => v !== null && v !== undefined && v !== '').length;
  });

  changePage(event: TablePageEvent) {
    this.limit.set(event.rows);
    this.offset.set(event.first);
  }

  openEditorDialog(item?: DocumentResponse) {
    const diagloRef = this.dialogService.open(DocumentEditor, {
      header: item ? 'Editar Documento' : 'Crear Documento',
      modal: true,
      focusOnShow: false,
      closable: true,
      draggable: false,
      data: item,
      width: '45vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
    diagloRef?.onClose.subscribe((result?: DocumentResponse) => {
      if (!result) return;
      this.upsertItem(result);
    });
  }

  openStateSwicherDialog(item: DocumentResponse) {
    const diagloRef = this.dialogService.open(DocumentStateSwitcher, {
      header: 'Cambiar estado',
      modal: true,
      focusOnShow: false,
      closable: true,
      draggable: false,
      data: item,
      width: '40vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
    diagloRef?.onClose.subscribe((result?: DocumentResponse) => {
      if (!result) return;
    });
  }

  openDetailDialog(item: DocumentResponse) {
    this.dialogService.open(DocumentDetail, {
      header: 'Detalle del documento',
      modal: true,
      closable: true,
      draggable: false,
      data: item.id,
      width: '40vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
  }
  search(term: string) {
    this.searchTerm.set(term);
  }

  setMenuItems(row: DocumentResponse) {
    this.menuItems = [
      {
        label: 'Opciones',
        items: [
          {
            label: 'Editar',
            icon: 'pi pi-fw pi-pencil',
            command: () => this.openEditorDialog(row),
          },
          {
            label: 'Ver detalle',
            icon: 'pi pi-eye',
            command: () => this.openDetailDialog(row),
          },
          {
            label: 'Cambiar estado',
            icon: 'pi pi-arrow-right-arrow-left',
            command: () => this.openStateSwicherDialog(row),
          },
        ],
      },
    ];
  }

  applyFilters() {
    this.reloadFromFirstPage();
  }

  clearFilters() {
    this.filterForm.reset();
    this.reloadFromFirstPage();
  }

  private reloadFromFirstPage() {
    if (this.offset() === 0) {
      this.resource.reload();
    } else {
      this.offset.set(0);
    }
  }

  private upsertItem(newItem: DocumentResponse) {
    const index = this.dataSource().findIndex((item) => item.id === newItem.id);
    if (index !== -1) {
      this.dataSource.update((values) => {
        values[index] = newItem;
        return [...values];
      });
      return;
    }
    this.dataSize.update((value) => value + 1);
    if (this.offset() === 0) {
      this.dataSource.update((values) => [newItem, ...values].slice(0, this.limit()));
    }
  }
}
