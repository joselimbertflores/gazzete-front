import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DialogService } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { DocumentTypeEditor } from '../../dialogs';
import { DocumentTypeAdminApi } from '../../services';
import { DocumentTypeResponse } from '../../interfaces';

@Component({
  selector: 'app-document-types-admin',
  imports: [
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    TagModule,
  ],
  templateUrl: './document-types-admin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export default class DocumentTypesAdmin {
  private documentApi = inject(DocumentTypeAdminApi);
  private dialogService = inject(DialogService);

  dataSource = this.documentApi.dataSource;

  openDocumentTypeDialog(item?: DocumentTypeResponse) {
    this.dialogService.open(DocumentTypeEditor, {
      header: item ? 'Editar tipo documento' : 'Crear tipo documento',
      closeOnEscape: true,
      draggable: false,
      closable: true,
      width: '30vw',
      data: item,
      breakpoints: {
        '960px': '70vw',
        '640px': '80vw',
      },
    });
  }
}
