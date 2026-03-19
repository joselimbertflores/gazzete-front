import { ChangeDetectionStrategy, Component, input, OnInit, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'autocomplete',
  imports: [AutoCompleteModule, ReactiveFormsModule],
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
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Autocomplete implements OnInit {
  items = input.required<any[]>();
  placeholder = input<string>('Buscar elemento');
  optionLabel = input<string>('label');
  optionValue = input<string>('value');

  onSearch = output<string>();
  onSelect = output<any>();

  control = new FormControl<string>('', { nonNullable: true });

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value: string | null) => {
        this.onSearch.emit(value ?? '');
      });
  }

  ngOnInit(): void {}

  search(event: AutoCompleteCompleteEvent) {
    this.searchSubject.next(event.query);
  }

  select(option: any) {
    this.onSelect.emit(option);
  }
}
