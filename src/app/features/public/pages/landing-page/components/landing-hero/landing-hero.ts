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
      class="relative isolate overflow-hidden border-b border-primary-900 bg-primary-950"
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
          class="h-full w-full object-cover object-[58%_40%] opacity-90 saturate-90 sm:object-[center_38%] sm:opacity-95"
        />
      </div>
      <div
        class="absolute inset-0 -z-10 bg-primary-950/20"
        aria-hidden="true"
      ></div>
      <div
        class="absolute inset-0 -z-10 bg-linear-to-b from-primary-950/5 via-primary-950/10 to-primary-950/62"
        aria-hidden="true"
      ></div>
      <div
        class="absolute inset-0 -z-10 bg-linear-to-r from-primary-950/45 via-primary-950/25 to-primary-950/45"
        aria-hidden="true"
      ></div>
      <div
        class="absolute inset-x-0 bottom-0 -z-10 h-24 bg-linear-to-t from-primary-950/35 to-transparent"
        aria-hidden="true"
      ></div>

      <div
        class="mx-auto flex min-h-115 w-full max-w-7xl items-center px-4 py-12 sm:min-h-125 sm:px-6 sm:py-16 lg:min-h-135 lg:px-8"
      >
        <div class="mx-auto w-full max-w-4xl text-center">
          <span
            class="mx-auto mb-6 block h-1 w-14 rounded-full bg-accent-400"
            aria-hidden="true"
          ></span>
          <h1
            id="landing-title"
            class="mx-auto max-w-4xl text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-balance text-surface-0 drop-shadow-sm sm:text-6xl lg:text-7xl"
          >
            Gaceta Municipal de Sacaba
          </h1>

          <p
            class="mx-auto mt-5 max-w-2xl text-base leading-7 text-surface-100 sm:mt-6 sm:text-lg sm:leading-8"
          >
            Busque y consulte normativas municipales publicadas por el Gobierno Autónomo Municipal
            de Sacaba.
          </p>

          <form
            class="mx-auto mt-8 w-full max-w-2xl rounded-lg border border-surface-0/20 bg-surface-0/10 p-1.5 shadow-lg shadow-primary-950/25 backdrop-blur-sm sm:mt-10"
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
                class="min-h-13 border-0 px-4 text-base shadow-none sm:min-h-14"
              />
              <p-button
                type="submit"
                label="Buscar"
                styleClass="min-h-13 px-5 font-semibold shadow-none sm:min-h-14 sm:px-7"
              />
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
