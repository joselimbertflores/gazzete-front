import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-landing-error-state',
  standalone: true,
  imports: [],
  template: `
    <section
      class="public-motion-safe flex min-h-[40vh] items-center bg-linear-to-b from-surface-0 to-primary-50/35 motion-safe:animate-enter motion-safe:fade-in-0 motion-safe:slide-in-from-b-6 motion-safe:animate-duration-500 motion-safe:animate-ease-out motion-safe:animate-fill-both"
      aria-live="polite"
    >
      <div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div
          class="mx-auto flex max-w-2xl flex-col items-start gap-5 rounded-lg border border-primary-100 bg-surface-0 p-6 text-center shadow-sm shadow-primary-950/5 transition-all duration-300 ease-out hover:border-primary-200 hover:shadow-md hover:shadow-primary-950/10 sm:items-center sm:p-8"
        >
          <div class="flex flex-col items-center gap-4">
            <i
              class="pi pi-info-circle text-surface-400"
              style="font-size: 2rem;"
              aria-hidden="true"
            ></i>
            <div>
              <h2 class="text-xl font-semibold text-surface-950 sm:text-2xl">
                Información no disponible
              </h2>
              <p class="mt-2 max-w-md text-sm leading-6 text-surface-600">
                No se pudo cargar la información pública de la Gaceta Municipal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingErrorState {}
