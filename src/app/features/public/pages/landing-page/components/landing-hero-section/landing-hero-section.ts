import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'landing-hero-section',
  imports: [FormsModule, ButtonModule, InputGroupModule, FloatLabelModule, InputTextModule],
  template: `
    <section
      class="border-b border-surface-200 bg-linear-to-b from-primary-200/80 via-primary-50/65 to-surface-0"
    >
      <div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div class="mx-auto max-w-4xl text-center">
          <h1
            class="text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl lg:text-5xl"
          >
            Consulta Pública de la Gaceta Municipal
          </h1>

          <p class="mt-4 text-base leading-7 text-surface-600 sm:text-lg">
            Busque ordenanzas, decretos, resoluciones y otras publicaciones oficiales de forma
            rápida y clara.
          </p>
        </div>

        <div
          class="mx-auto mt-8 max-w-3xl rounded-2xl border border-surface-200 bg-surface-0 p-3 shadow-sm sm:p-4"
        >
          <p-inputgroup>
            <p-floatLabel variant="on">
              <input
                pInputText
                id="search-input"
                autocomplete="off"
                [(ngModel)]="searchTerm"
                (keyup.enter)="search()"
              />
              <label for="search-input">Buscar por número o resumen</label>
            </p-floatLabel>
            <p-button label="Buscar" icon="pi pi-search" (onClick)="search()" />
          </p-inputgroup>

          <p class="mt-3 text-center text-sm text-surface-500">
            Use términos clave para encontrar normativa municipal vigente o histórica.
          </p>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingHeroSection {
  private router = inject(Router);

  readonly searchTerm = signal('');

  search(): void {
    if (!this.searchTerm().trim()) return;
    this.router.navigate(['/normativas'], { queryParams: { term: this.searchTerm() } });
  }
}
