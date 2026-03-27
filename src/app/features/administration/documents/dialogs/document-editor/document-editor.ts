import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

import { FileSizePipe } from '../../../../../shared';
import { DocumentResponse } from '../../interfaces';
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
  ],
  templateUrl: './document-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentEditor implements OnInit {
  private formBuilder = inject(FormBuilder);
  private diagloRef = inject(DynamicDialogRef);

  private documentApi = inject(DocumentAdminApi);

  readonly CURRENT_DATE = new Date();
  readonly CURRENT_YEAR = this.CURRENT_DATE.getFullYear();

  readonly data: DocumentResponse | undefined = inject(DynamicDialogConfig).data;

  form: FormGroup = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    summary: ['', Validators.required],
    year: [this.CURRENT_YEAR.toString(), Validators.required],
    correlativeNumber: [null, [Validators.required, Validators.min(1)]],
    typeId: ['', Validators.required],
    validUntil: [''],
    promulgationDate: [null, Validators.required],
    publicationDate: [this.CURRENT_DATE, Validators.required],
  });

  types = this.documentApi.documentTypes;

  file: File | null = null;

  readonly relationTypes = [
    { label: 'Modifica', value: 'MODIFIES' },
    { label: 'Abroga', value: 'ABROGATES' },
    { label: 'Deroga', value: 'DEROGATES' },
    { label: 'Rectifica', value: 'RECTIFIES' },
    { label: 'Regula', value: 'REGULATES' },
    { label: 'Referencia', value: 'REFERENCES' },
  ];

  ngOnInit(): void {
    this.loadFormData();
  }

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
    saveObservable.subscribe((resp) => {
      this.diagloRef.close(resp);
    });
  }

  private loadFormData() {
    if (!this.data) return;
    const { year, publicationDate, promulgationDate, validUntil, ...props } = this.data;
    this.form.patchValue({
      ...props,
      promulgationDate: new Date(promulgationDate),
      publicationDate: new Date(publicationDate),
      validUntil: new Date(validUntil),
    });
  }
}
