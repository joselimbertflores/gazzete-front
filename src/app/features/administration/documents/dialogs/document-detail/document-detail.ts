import { toSignal } from '@angular/core/rxjs-interop';
import { Component, inject } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';

import { DocumentRelationType } from '../../interfaces';
import { FileSizePipe } from '../../../../../shared';
import { DocumentAdminApi } from '../../services';

@Component({
  selector: 'app-document-detail',
  imports: [SkeletonModule, ButtonModule, TabsModule, TitleCasePipe, FileSizePipe, DatePipe],
  templateUrl: './document-detail.html',
})
export class DocumentDetail {
  private dialogRef = inject(DynamicDialogRef);
  readonly documentId: string = inject(DynamicDialogConfig).data;
  private documentApi = inject(DocumentAdminApi);

  detail = toSignal(this.documentApi.getDocumentDetail(this.documentId));

  incomingRelationLabel(type: DocumentRelationType | string): string {
    const labels: Record<DocumentRelationType, string> = {
      [DocumentRelationType.MODIFIES]: 'Modificada por',
      [DocumentRelationType.ABROGATES]: 'Abrogada por',
      [DocumentRelationType.DEROGATES]: 'Derogada por',
    };

    return labels[type as DocumentRelationType] ?? 'Relación recibida';
  }

  outgoingRelationLabel(type: DocumentRelationType | string): string {
    const labels: Record<DocumentRelationType, string> = {
      [DocumentRelationType.MODIFIES]: 'Modifica a',
      [DocumentRelationType.ABROGATES]: 'Abroga a',
      [DocumentRelationType.DEROGATES]: 'Deroga a',
    };

    return labels[type as DocumentRelationType] ?? 'Relación producida';
  }

  close() {
    this.dialogRef.close();
  }
}
