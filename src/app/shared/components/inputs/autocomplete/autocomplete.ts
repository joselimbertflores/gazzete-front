import { ChangeDetectionStrategy, Component, input, OnInit, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteSelectEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';

export interface AutocompleteOption {
  label: string;
  value: any;
}

@Component({
  selector: 'autocomplete',
  imports: [AutoCompleteModule, ReactiveFormsModule, CommonModule],
  template: `
    <p-autocomplete
      [formControl]="control"
      [suggestions]="items()"
      (completeMethod)="search($event)"
      (onSelect)="select($event)"
      [forceSelection]="true"
      [placeholder]="placeholder()"
      [fluid]="true"
      [optionLabel]="optionLabel()"
      [optionValue]="optionValue()"
      appendTo="body"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Autocomplete<T> implements OnInit {
  initivalValue = input<any>();
  items = input.required<AutocompleteOption[]>();
  placeholder = input<string>('Buscar elemento');
  optionLabel = input<string>();
  optionValue = input<string>();

  onSearch = output<string>();
  onSelect = output<any>();

  control = new FormControl<AutocompleteOption | null>(null);

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value: string | null) => {
        this.onSearch.emit(value ?? '');
      });
  }

  ngOnInit(): void {
    if (this.initivalValue()) {
      this.control.setValue(this.initivalValue() ?? null, { emitEvent: false });
    }
  }

  search(event: AutoCompleteCompleteEvent) {
    this.searchSubject.next(event.query);
  }

  select(option: AutoCompleteSelectEvent) {
    this.onSelect.emit(option.value);
  }
}
