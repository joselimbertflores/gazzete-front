import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

  readonly data: any = inject(DynamicDialogConfig).data;

  form: FormGroup = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    summary: ['', Validators.required],
    number: ['', Validators.required],
    typeId: ['', Validators.required],
    year: ['', Validators.required],
    validUntil: [''],
    promulgationDate: [null, Validators.required],
    publicationDate: [this.CURRENT_DATE, Validators.required],
    relations: this.formBuilder.array([]),
  });

  types = this.documentApi.types;

  file: File | null = null;

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

  save() {}

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

  get relations(): FormArray {
    return this.form.get('relations') as FormArray;
  }
}
