import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

import { DocumentTypeAdminApi } from '../../services';
import { DocumentTypeResponse } from '../../interfaces';
import { FormUtils } from '../../../../../helpers';

@Component({
  selector: 'app-document-type-editor',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FloatLabelModule,
    CheckboxModule,
    InputTextModule,
    MessageModule,
    SelectModule,
  ],
  templateUrl: './document-type-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTypeEditor {
  private diagloRef = inject(DynamicDialogRef);
  private documentTypeApi = inject(DocumentTypeAdminApi);

  readonly data?: DocumentTypeResponse = inject(DynamicDialogConfig).data;

  form: FormGroup = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    description: ['', Validators.maxLength(120)],
    numberingMode: ['', Validators.required],
    isActive: [true, Validators.required],
  });

  readonly formUtils = FormUtils;
  readonly numberingModes = [
    { value: 'YEARLY', label: 'ANUAL' },
    { value: 'GLOBAL', label: 'GLOBAL' },
  ];

  ngOnInit() {
    this.loadForm();
  }

  save() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const subscription = this.data
      ? this.documentTypeApi.update(this.data.id, this.form.value)
      : this.documentTypeApi.create(this.form.value);

    subscription.subscribe(() => {
      this.diagloRef.close();
    });
  }

  close() {
    this.diagloRef.close();
  }

  private loadForm() {
    if (!this.data) return;
    this.form.patchValue(this.data);
  }
}
