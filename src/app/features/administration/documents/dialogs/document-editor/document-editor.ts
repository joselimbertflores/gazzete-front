import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { StepperModule } from 'primeng/stepper';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

import { Autocomplete, FileSizePipe } from '../../../../../shared';
import { DocumentAdminApi } from '../../services';

@Component({
  selector: 'app-document-editor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    StepperModule,
    FloatLabelModule,
    InputNumberModule,
    DatePickerModule,
    FileUploadModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    FileSizePipe,
    Autocomplete,
  ],
  templateUrl: './document-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentEditor {
  private formBuilder = inject(FormBuilder);
  private diagloRef = inject(DynamicDialogRef);

  private documentApi = inject(DocumentAdminApi);

  readonly CURRENT_DATE = new Date();

  readonly data: any | undefined = inject(DynamicDialogConfig).data;

  form: FormGroup = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    summary: ['', Validators.required],
    correlativeNumber: ['', Validators.required],
    typeId: ['', Validators.required],
    validUntil: [''],
    promulgationDate: [null, Validators.required],
    publicationDate: [this.CURRENT_DATE, Validators.required],
    relations: this.formBuilder.array([]),
  });

  types = this.documentApi.types;

  file: File | null = null;
  documentsOptions = signal<any[]>([]);

  readonly relationTypes = [
    { label: 'Modifica', value: 'MODIFIES' },
    { label: 'Abroga', value: 'ABROGATES' },
    { label: 'Deroga', value: 'DEROGATES' },
    { label: 'Rectifica', value: 'RECTIFIES' },
    { label: 'Regula', value: 'REGULATES' },
    { label: 'Referencia', value: 'REFERENCES' },
  ];

  close() {
    this.diagloRef.close();
  }

  selectFile(event: FileSelectEvent) {
    const [file] = event.files;
    this.file = file;
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const saveObservable = this.data
      ? this.documentApi.update(this.data.id, this.form.value, this.file)
      : this.documentApi.create(this.form.value, this.file!);
    saveObservable.subscribe(() => {
      this.diagloRef.close();
    });
  }

  addRelation() {
    this.relations.push(this.createRelationGroup());
  }

  createRelationGroup(): FormGroup {
    return this.formBuilder.group({
      type: ['', Validators.required],
      targetDocumentId: ['', Validators.required],
    });
  }

  removeRelation(index: number) {
    this.relations.removeAt(index);
  }

  searchDocuments(term: string) {
    if (!term) {
      this.documentsOptions.set([]);
      return;
    }
    this.documentApi.searchDocumentForRelation(term).subscribe((resp) => {
      this.documentsOptions.set(resp.map((doc) => ({ label: `${doc.code} - ${doc.title}`, value: doc.id })));
    });
  }

  get relations(): FormArray {
    return this.form.get('relations') as FormArray;
  }
}
