import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';

import { UserResponse } from '../../interfaces';
import { UserApi } from '../../services';
import { MessageModule } from 'primeng/message';
import { FormUtils } from '../../../../../helpers';
import { USER_ROLE_OPTIONS } from '../../constants';

@Component({
  selector: 'app-user-editor',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, ListboxModule, MessageModule],
  templateUrl: './user-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditor {
  private userApi = inject(UserApi);
  private dialogRef = inject(DynamicDialogRef);

  readonly data: UserResponse = inject(DynamicDialogConfig).data;

  form: FormGroup = inject(FormBuilder).nonNullable.group({
    roles: [[], [Validators.required, Validators.minLength(1)]],
  });

  readonly roles = USER_ROLE_OPTIONS;

  readonly formUtils = FormUtils;

  ngOnInit() {
    this.loadForm();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { roles } = this.form.value;
    this.userApi.update(this.data.id, roles).subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  close() {
    this.dialogRef.close();
  }

  private loadForm() {
    this.form.patchValue({
      roles: this.data.roles,
    });
  }
}
