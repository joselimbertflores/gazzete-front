import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-landing-error-state',
  standalone: true,
  imports: [],
  template: `
    <section class="flex min-h-[42vh] items-center" aria-live="polite">
      <div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div
          class="mx-auto flex max-w-2xl flex-col items-start gap-5 p-6 text-center sm:items-center sm:p-8"
        >
          <div class="flex flex-col items-center gap-4">
            <i class="pi pi-info-circle" style="font-size: 2rem;"></i>
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
