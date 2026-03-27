import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { Autocomplete, AutocompleteOption } from '../../../../../shared';
import { DocumentResponse } from '../../interfaces';
import { DocumentAdminApi } from '../../services';

@Component({
  selector: 'app-document-state-switcher',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    FloatLabelModule,
    TextareaModule,
    ButtonModule,
    Autocomplete,
  ],
  template: `
    <form [formGroup]="form" action="">
      <div class="flex flex-col gap-y-4">
        <autocomplete
          [initivalValue]="inicialValue()"
          [items]="items()"
          (onSearch)="searchDocuments($event)"
        />

        <p-select
          [options]="relationTYpes"
          placeholder="Tipo de relación"
          class="w-full"
          appendTo="body"
          formControlName="relationType"
        />

        <p-floatlabel variant="on">
          <textarea
            pTextarea
            id="summaryTxt"
            rows="4"
            [fluid]="true"
            formControlName="description"
          ></textarea>
          <label for="summaryTxt">Resumen</label>
        </p-floatlabel>
      </div>
      <div class="p-dialog-footer">
        <p-button label="Cancelar" severity="secondary" (onClick)="close()" />
        <p-button type="submit" label="Guardar" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentStateSwitcher implements OnInit {
  private documentApi = inject(DocumentAdminApi);
  private formBuilder = inject(FormBuilder);
  private diagloRef = inject(DynamicDialogRef);

  readonly data: DocumentResponse = inject(DynamicDialogConfig).data;

  form: FormGroup = this.formBuilder.nonNullable.group({
    sourceDocumentId: ['', Validators.required],
    relationType: ['', Validators.required],
    description: [''],
  });

  inicialValue = signal<AutocompleteOption | null>(null);

  items = signal<AutocompleteOption[]>([]);

  relationTYpes = [
    { label: 'MODIFICA', value: 'MODIFIES' },
    { label: 'ABROGA', value: 'ABROGATES' },
    { label: 'DEROGA', value: 'DEROGATES' },
  ];

  ngOnInit(): void {
    this.loadRelations();
  }

  searchDocuments(term: string) {
    this.documentApi.searchRelationCandidates(term).subscribe((resp) => {
      this.items.set(resp);
    });
  }

  close() {
    this.diagloRef.close();
  }

  private loadRelations() {
    this.documentApi.getDocumentRelations(this.data.id).subscribe((resp) => {
      this.form.patchValue({
        relationType: resp.type,
        description: resp.description,
      });
      this.inicialValue.set({
        label: `${resp.source.code} - ${resp.source.title}`,
        value: resp.source.id,
      });
    });
  }

  // searchDocuments(term: string) {
  //   if (!term) {
  //     this.documentsOptions.set([]);
  //     return;
  //   }
  //   this.documentApi.searchRelationCandidates(term).subscribe((resp) => {
  //     this.documentsOptions.set(
  //       resp.map((doc) => ({ label: `${doc.code} - ${doc.title}`, value: doc.id })),
  //     );
  //   });
  // }

  // selectDocumentRelation(doc: AutocompleteOption, index: number) {
  //   const itemControl = this.relations.at(index);
  //   itemControl.patchValue({ targetDocumentId: doc.value });
  // }
}
