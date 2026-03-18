import { ChangeDetectionStrategy, linkedSignal, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { TableModule, TablePageEvent } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { DocumentAdminApi } from '../../services';
import { DocumentEditor } from '../../dialogs';
@Component({
  selector: 'app-documents-admin',
  imports: [TableModule, TagModule, ButtonModule, TooltipModule],
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
    stream: ({ params }) => this.documentApi.findAll(params.limit, params.offset, params.term),
  });

  limit = signal(10);
  offset = signal(0);
  searchTerm = signal('');
  dataSource = linkedSignal(() =>
    this.resource.hasValue() ? this.resource.value().documents : [],
  );
  dataSize = linkedSignal(() => (this.resource.hasValue() ? this.resource.value().total : 0));

  chagePage(event: TablePageEvent) {
    this.limit.set(event.rows);
    this.offset.set(event.first);
    // this.getData();
  }

  getData() {
    this.documentApi.findAll(this.limit(), this.offset(), this.searchTerm()).subscribe((result) => {
      this.dataSource.set(result.documents);
      this.dataSize.set(result.total);
    });
  }

  openEditorDialog(item?: any) {
    const diagloRef = this.dialogService.open(DocumentEditor, {
      header: 'Editar Documentación',
      modal: true,
      focusOnShow: false,
      closable: true,
      draggable: false,
      data: item,
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
    // diagloRef?.onClose.subscribe((result?: DocumentManageResponse) => {
    //   if (!result) return;
    //   this.upsertItem(result);
    // });
  }

  openFile(item: any) {
    window.open(item.file.url, '_blank');
  }
}
