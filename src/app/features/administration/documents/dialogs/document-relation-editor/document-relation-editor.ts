import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, OnInit, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';

import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

import {
  DocumentSearchOptionResponse,
  DocumentRelationType,
  DocumentResponse,
} from '../../interfaces';

import { DocumentAdminApi, DocumentRelationApi } from '../../services';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-document-relation-editor',
  imports: [
    ReactiveFormsModule,
    AutoCompleteModule,
    AutoCompleteModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    SelectModule,
    JsonPipe,
    SkeletonModule,
  ],
  templateUrl: './document-relation-editor.html',
})
export class DocumentRelationEditor implements OnInit {
  targetDocument: DocumentResponse = inject(DynamicDialogConfig).data;
  private formBuilder = inject(FormBuilder);
  private docRelationApi = inject(DocumentRelationApi);
  private diagloRef = inject(DynamicDialogRef);

  readonly relationTypeOptions = [
    {
      label: 'Modificada por',
      value: DocumentRelationType.MODIFIES,
    },
    {
      label: 'Abrogada por',
      value: DocumentRelationType.ABROGATES,
    },
    {
      label: 'Derogada por',
      value: DocumentRelationType.DEROGATES,
    },
  ];

  documentSuggestions = signal<DocumentSearchOptionResponse[]>([]);

  form: FormGroup = this.formBuilder.group({
    type: [null, Validators.required],
    sourceDocumentId: [null, Validators.required],
    note: [null],
  });

  isLoading = signal(false);

  currentRelation = signal<any>(null);

  ngOnInit(): void {
    this.docRelationApi.findByTarget(this.targetDocument.id).subscribe({
      next: (relation) => {
        this.currentRelation.set(relation);

        if (relation) {
          this.form.patchValue(relation);
          return;
        }
      },
      error: (err) => {
        console.log(err);
        // this.ref.close(false);
      },
    });
  }

  searchDocuments(event: AutoCompleteCompleteEvent) {
    const term = event.query?.trim();
    if (!term) {
      this.documentSuggestions.set([]);
      return;
    }

    this.docRelationApi.findCandidates(term, this.targetDocument.id).subscribe({
      next: (documents) => {
        this.documentSuggestions.set(
          documents.map((doc) => ({
            ...doc,
            displayName: `${doc.typeName} ${doc.code}`,
          })),
        );
      },
    });
  }

  save() {
    if (!this.targetDocument.id || this.form.invalid) return;
    console.log('calll');
    this.docRelationApi
      .create({
        targetDocumentId: this.targetDocument.id,
        ...this.form.value,
      })
      .subscribe({
        next: () => {
          // this.messageService.add({
          //   severity: 'success',
          //   summary: 'Relación legal guardada',
          // });
        },
        error: (errr) => {
          console.log(errr);
        },
        complete: () => {},
      });
  }

  confirmRemove() {
    // this.confirmationService.confirm({
    //   header: 'Quitar relación legal',
    //   message: 'El documento volverá al estado Vigente. ¿Desea continuar?',
    //   icon: 'pi pi-exclamation-triangle',
    //   acceptLabel: 'Sí, quitar',
    //   rejectLabel: 'Cancelar',
    //   acceptButtonStyleClass: 'p-button-danger',
    //   accept: () => this.remove(),
    // });
  }

  private remove() {
    // if (!this.targetDocument) return;
    // this.removing = true;
    // this.documentRelationsService.removeForTarget(this.targetDocument.id).subscribe({
    //   next: () => {
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Relación legal eliminada',
    //     });
    //     this.visible = false;
    //     this.saved.emit();
    //   },
    //   error: () => {
    //     this.removing = false;
    //   },
    //   complete: () => {
    //     this.removing = false;
    //   },
    // });
  }

  close() {
    // this.visible = false;
    // this.targetDocument = null;
    // this.existingRelation = null;
    // this.form.reset();
  }
}
