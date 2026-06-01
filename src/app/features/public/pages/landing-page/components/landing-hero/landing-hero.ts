import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'landing-hero',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputGroupModule, InputTextModule],
  template: `
    <section
      class="relative isolate overflow-hidden border-b border-surface-200 bg-surface-950"
      aria-labelledby="landing-title"
    >
      <div class="absolute inset-0 -z-20">
        <img
          src="/images/gaceta/gaceta-hero-banner-1280.webp"
          srcset="
            /images/gaceta/gaceta-hero-banner-768.webp   768w,
            /images/gaceta/gaceta-hero-banner-1280.webp 1280w,
            /images/gaceta/gaceta-hero-banner-1672.webp 1672w
          "
          sizes="100vw"
          width="1672"
          height="713"
          alt=""
          aria-hidden="true"
          fetchpriority="high"
          decoding="async"
          class="h-full w-full object-cover object-[center_40%] opacity-[0.72] saturate-90 sm:object-[center_38%] sm:opacity-[0.7]"
        />
      </div>
      <div
        class="absolute inset-0 -z-10 bg-primary-950/25 sm:bg-primary-950/30"
        aria-hidden="true"
      ></div>
      <div
        class="absolute inset-0 -z-10 bg-linear-to-b from-surface-950/10 via-primary-950/0 to-surface-950/62 sm:from-surface-950/18 sm:via-primary-950/5 sm:to-surface-950/68"
        aria-hidden="true"
      ></div>
      <div
        class="absolute inset-0 -z-10 bg-linear-to-r from-surface-950/35 via-surface-950/5 to-surface-950/32 sm:from-surface-950/48 sm:via-surface-950/10 sm:to-surface-950/42"
        aria-hidden="true"
      ></div>

      <div
        class="mx-auto flex min-h-105 w-full max-w-7xl items-center px-4 py-9 sm:min-h-125 sm:px-6 sm:py-12 lg:min-h-135 lg:px-8"
      >
        <div class="mx-auto w-full max-w-4xl text-center motion-safe:animate-fadein">
          <h1
            id="landing-title"
            class="text-3xl font-semibold tracking-tight text-surface-0 drop-shadow-sm sm:text-5xl lg:text-6xl"
          >
            Gaceta Municipal de Sacaba
          </h1>

          <p
            class="mx-auto mt-4 max-w-2xl text-sm leading-6 text-surface-100 sm:mt-5 sm:text-lg sm:leading-7"
          >
            Busque y consulte normativas municipales publicadas por el Gobierno Autónomo Municipal
            de Sacaba.
          </p>

          <form
            class="mx-auto mt-8 w-full max-w-3xl"
            role="search"
            aria-label="Buscar normativas municipales"
            (ngSubmit)="onSearch(searchInput.value)"
          >
            <p-inputgroup>
              <input
                #searchInput
                pInputText
                name="landing-search"
                autocomplete="off"
                aria-label="Buscar normativas por código o descripción"
                placeholder="Buscar por código o descripción…"
              />
              <p-button type="submit" icon="pi pi-search" label="Buscar" />
            </p-inputgroup>
          </form>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingHero {
  search = output<string>();

  onSearch(term: string) {
    const trimmedTerm = term.trim();

    if (!trimmedTerm) return;

    this.search.emit(trimmedTerm);
  }
}
