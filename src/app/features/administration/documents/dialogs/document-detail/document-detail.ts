import { toSignal } from '@angular/core/rxjs-interop';
import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { FileSizePipe } from '../../../../../shared';
import { DocumentAdminApi } from '../../services';

@Component({
  selector: 'app-document-detail',
  imports: [SkeletonModule, TagModule, ButtonModule, DatePipe, FileSizePipe],
  templateUrl: './document-detail.html',
})
export class DocumentDetail {
  private dialogRef = inject(DynamicDialogRef);
  readonly documentId: string = inject(DynamicDialogConfig).data;
  private documentApi = inject(DocumentAdminApi);

  detail = toSignal(this.documentApi.getDocumentDetail(this.documentId));

  close() {
    this.dialogRef.close();
  }
}
