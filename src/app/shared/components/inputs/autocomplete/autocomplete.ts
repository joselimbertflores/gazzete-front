import { ChangeDetectionStrategy, Component, input, OnInit, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'autocomplete',
  imports: [AutoCompleteModule, ReactiveFormsModule],
  template: `
    <div class="card flex justify-center">
      <p-autocomplete [formControl]="control" [suggestions]="items()" (onSelect)="select($event)" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Autocomplete implements OnInit {
  items = input.required<any[]>();

  onSearch = output<string>();
  onSelect = output<any>();

  control = new FormControl<string>('', { nonNullable: true });

  ngOnInit(): void {
    this.control.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => {
        console.log(value);
        this.onSearch.emit(value);
      });
  }

  select(option: any) {
    this.onSelect.emit(option);
  }
}
