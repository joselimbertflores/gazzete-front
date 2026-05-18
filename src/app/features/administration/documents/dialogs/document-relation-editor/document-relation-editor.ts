import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { UpperCasePipe } from '@angular/common';

import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs';

import { FormUtils } from '../../../../../helpers';
import {
  DocumentResponse,
  DocumentRelationType,
  DocumentRelationResponse,
  DocumentSearchOptionResponse,
} from '../../interfaces';
import { DocumentRelationApi } from '../../services';

interface DocumentRelationOption extends DocumentSearchOptionResponse {
  displayName: string;
}

@Component({
  selector: 'app-document-relation-editor',
  imports: [
    ReactiveFormsModule,
    AutoCompleteModule,
    FloatLabelModule,
    MessageModule,
    SkeletonModule,
    TextareaModule,
    ButtonModule,
    SelectModule,
    UpperCasePipe,
  ],
  templateUrl: './document-relation-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentRelationEditor implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly relationApi = inject(DocumentRelationApi);
  private readonly dialogRef = inject(DynamicDialogRef);

  readonly targetDocument: DocumentResponse = inject(DynamicDialogConfig).data;
  readonly formUtils = FormUtils;

  readonly form: FormGroup = this.formBuilder.group({
    type: [null, Validators.required],
    sourceDocument: [null, Validators.required],
    note: [null],
  });

  readonly isLoadingRelation = signal(true);
  readonly currentRelation = signal<DocumentRelationResponse | null>(null);
  readonly isMarkedForDelete = signal(false);
  readonly isSaving = signal(false);
  readonly candidates = signal<DocumentRelationOption[]>([]);

  private readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  readonly canSave = computed(() => {
    this.formStatus();

    if (this.isSaving() || this.isLoadingRelation()) return false;
    if (this.isMarkedForDelete()) return true;
    return this.form.valid;
  });

  readonly relationTypeOptions = [
    { label: 'Modificada', value: DocumentRelationType.MODIFIES },
    { label: 'Abrogada', value: DocumentRelationType.ABROGATES },
    { label: 'Derogada', value: DocumentRelationType.DEROGATES },
  ];

  ngOnInit(): void {
    this.loadRelation();
  }

  markForDelete(): void {
    this.isMarkedForDelete.set(true);
  }

  cancelDelete(): void {
    this.isMarkedForDelete.set(false);
  }

  searchDocuments(event: AutoCompleteCompleteEvent): void {
    const term = event.query?.trim();

    if (!term) {
      this.candidates.set([]);
      return;
    }

    this.relationApi.findCandidates(term, this.targetDocument.id).subscribe((documents) => {
      this.candidates.set(documents.map((document) => this.toDocumentOption(document)));
    });
  }

  save(): void {
    if (this.isMarkedForDelete()) {
      this.deleteRelation();
      return;
    }

    if (!this.canSave()) {
      this.form.markAllAsTouched();
      return;
    }

    const { sourceDocument, type, note } = this.form.getRawValue() as {
      sourceDocument: DocumentRelationOption;
      type: DocumentRelationType;
      note?: string | null;
    };

    this.isSaving.set(true);
    this.relationApi
      .save(this.targetDocument.id, {
        sourceDocumentId: sourceDocument.id,
        type,
        note: note?.trim() || null,
      })
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe(({ targetLegalStatus }) => {
        this.dialogRef.close(targetLegalStatus);
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  relationTypeLabel(type: DocumentRelationType | string | null | undefined): string {
    const labels: Record<DocumentRelationType, string> = {
      [DocumentRelationType.MODIFIES]: 'Modificada',
      [DocumentRelationType.ABROGATES]: 'Abrogada',
      [DocumentRelationType.DEROGATES]: 'Derogada',
    };
    return labels[type as DocumentRelationType] ?? 'Sin relacion';
  }

  private loadRelation(): void {
    this.isLoadingRelation.set(true);
    this.relationApi
      .findByTarget(this.targetDocument.id)
      .pipe(finalize(() => this.isLoadingRelation.set(false)))
      .subscribe((relation) => {
        this.currentRelation.set(relation);
        this.patchFormFromCurrentRelation();
      });
  }

  private patchFormFromCurrentRelation(): void {
    const relation = this.currentRelation();
    this.form.reset({
      type: relation?.type ?? null,
      sourceDocument: relation ? this.toDocumentOption(relation.sourceDocument) : null,
      note: relation?.note ?? null,
    });
  }

  private deleteRelation(): void {
    this.isSaving.set(true);
    this.relationApi
      .remove(this.targetDocument.id)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe(({ targetLegalStatus }) => {
        this.dialogRef.close(targetLegalStatus);
      });
  }

  private toDocumentOption(document: DocumentSearchOptionResponse): DocumentRelationOption {
    return {
      ...document,
      displayName: `${document.typeName} ${document.code}`,
    };
  }
}
