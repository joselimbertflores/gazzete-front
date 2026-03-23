import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { DocumentResponse, RelationCandidateResponseDto } from '../../interfaces';

interface AutocompleteOption {
  label: string;
  value: string;
}

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
    relations: this.formBuilder.array([]),
  });

  types = this.documentApi.types;

  file: File | null = null;
  documentsOptions = signal<AutocompleteOption[]>([]);

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
    this.documentApi.searchRelationCandidates(term).subscribe((resp) => {
      this.documentsOptions.set(
        resp.map((doc) => ({ label: `${doc.code} - ${doc.title}`, value: doc.id })),
      );
    });
  }

  selectDocumentRelation(doc: AutocompleteOption, index: number) {
    // const values = this.relations.value.fi;
    const itemControl = this.relations.at(index);
    itemControl.patchValue({ targetDocumentId: doc.value });
  }

  get relations(): FormArray<
    FormGroup<{ type: FormControl<string>; targetDocumentId: FormControl<string> }>
  > {
    return this.form.get('relations') as FormArray;
  }

  private loadFormData() {
    if (!this.data) return;
    const { outgoingRelations, year, ...props } = this.data;
    this.form.patchValue(props);
  }
}
