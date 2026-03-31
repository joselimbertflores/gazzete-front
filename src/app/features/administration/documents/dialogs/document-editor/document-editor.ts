import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

import { FileSizePipe } from '../../../../../shared';
import { DocumentResponse } from '../../interfaces';
import { FormUtils } from '../../../../../helpers';
import { DocumentAdminApi } from '../../services';

function isBefore(targetControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const target = control.parent?.get(targetControlName);

    if (!control.value || !target?.value) return null;

    const current = new Date(control.value).getTime();
    const targetDate = new Date(target.value).getTime();

    return current > targetDate ? { isBefore: true } : null;
  };
}

function isAfter(targetControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const target = control.parent?.get(targetControlName);

    if (!control.value || !target?.value) return null;

    const current = new Date(control.value).getTime();
    const targetDate = new Date(target.value).getTime();

    return current < targetDate ? { isAfter: true } : null;
  };
}
@Component({
  selector: 'app-document-editor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    FloatLabelModule,
    InputNumberModule,
    DatePickerModule,
    FileUploadModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    MessageModule,
    FileSizePipe,
  ],
  templateUrl: './document-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentEditor implements OnInit {
  private formBuilder = inject(FormBuilder);
  private diagloRef = inject(DynamicDialogRef);

  private documentApi = inject(DocumentAdminApi);
  readonly data: DocumentResponse | undefined = inject(DynamicDialogConfig).data;

  readonly currentDate = new Date();

  file: File | null = null;
  form: FormGroup = this.formBuilder.group({
    summary: ['', Validators.required],
    typeId: ['', Validators.required],
    correlativeNumber: [null, [Validators.required, Validators.min(1)]],
    year: [this.currentDate.getFullYear().toString(), Validators.required],
    promulgationDate: [null, [Validators.required, isBefore('publicationDate')]],
    publicationDate: [this.currentDate, Validators.required],
    validUntil: [null, isAfter('publicationDate')],
  });

  types = this.documentApi.documentTypes;

  readonly formUtils = FormUtils;
  readonly customFormErrorMessages = {
    isBefore: 'Debe ser antes de publicación.',
    isAfter: 'Debe ser después de publicación.',
  };

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
    if (this.form.invalid || (!this.file && !this.data)) {
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
      validUntil: validUntil ? new Date(validUntil) : null,
    });
  }
}
