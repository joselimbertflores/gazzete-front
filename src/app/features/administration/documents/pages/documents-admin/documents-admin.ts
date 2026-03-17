import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { TableModule, TablePageEvent } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DocumentEditor } from '../../dialogs';
@Component({
  selector: 'app-documents-admin',
  imports: [TableModule, TagModule, ButtonModule],
  templateUrl: './documents-admin.html',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentsAdmin {
  private dialogService = inject(DialogService);

  limit = signal(10);
  offset = signal(0);
  searchTerm = signal('');
  dataSource = signal<any[]>([]);
  dataSize = signal<number>(0);

  chagePage(event: TablePageEvent) {
    this.limit.set(event.rows);
    this.offset.set(event.first);
    // this.getData();
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
}
