import { FormGroup, FormArray, AbstractControl } from '@angular/forms';

type customMessages = Record<string, string>;
export class FormUtils {
  static getControl(
    form: FormGroup | FormArray,
    path: string
  ): AbstractControl | null {
    return form.get(path);
  }

  static isInvalid(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  static isValidField(form: FormGroup | FormArray, path: string): boolean {
    const control = this.getControl(form, path);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  static getErrorMessageByPath(
    form: FormGroup | FormArray,
    path: string,
    messages?: customMessages
  ) {
    const control = this.getControl(form, path);
    if (!control || !control.errors) return null;

    const errors = control.errors;

    for (const key of Object.keys(errors)) {
      if (messages && messages[key]) {
        return messages[key];
      }
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

        case 'maxlength':
          return `Máximo de ${errors['maxlength'].requiredLength} caracteres`;

        case 'pattern':
          return 'Formato inválido';

        default:
          return 'Campo inválido';
      }
    }
    return null;
  }

  static getErrorMessage(
    control: AbstractControl | null,
    messages?: customMessages
  ) {
    if (!control || !control.errors || !control.touched) return null;

    const errors = control.errors;

    for (const key of Object.keys(errors)) {
      if (messages && messages[key]) {
        return messages[key];
      }

      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;
        case 'maxlength':
          return `Máximo de ${errors['maxlength'].requiredLength} caracteres`;
        case 'pattern':
          return 'Formato inválido';
        default:
          return 'Campo inválido';
      }
    }
    return null;
  }
}
