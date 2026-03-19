import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-landing-page',
  imports: [InputTextModule, ButtonModule],
  templateUrl: './landing-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LandingPage {
  readonly searchTerm = signal('');

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  onSearch(event: Event): void {
    event.preventDefault();

    const query = this.searchTerm().trim();
    if (!query) return;

    // luego aquí puedes navegar a /documents?q=...
    console.log(query);
  }
}
