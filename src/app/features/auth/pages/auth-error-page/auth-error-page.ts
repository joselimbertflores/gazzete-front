import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { map } from 'rxjs';

import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-auth-error-page',
  imports: [ButtonModule],
  template: `
    <section class="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <div class="w-full max-w-md">
        <div class="bg-surface-0 rounded-2xl shadow-lg p-8 text-center border border-surface-200">
          <div class="flex justify-center mb-6">
            <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <i class="pi pi-lock text-red-500" style="font-size: 1.5rem;"></i>
            </div>
          </div>
          <h1 class="text-2xl font-semibold text-surface-900 mb-2">{{ message().title }}</h1>

          <p class="text-surface-600 mb-4">{{ message().description }}</p>

          @if (clientName()) {
            <p class="text-sm text-surface-500 mb-6">
              Sistema: <span class="font-medium text-surface-700">{{ clientName() }}</span>
            </p>
          }

          <div class="flex flex-col gap-3">
            <a
              pButton
              size="small"
              label="Volver al inicio"
              icon="pi pi-home"
              class="w-full p-button-primary"
              [href]="identityHubAppsUrl"
            ></a>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthErrorPage {
  private route = inject(ActivatedRoute);

  errorParams = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => ({
        error: params.get('error'),
        client_name: params.get('client_name'),
      })),
    ),
  );

  message = computed(() => {
    switch (this.errorParams()?.error) {
      case 'access_denied':
        return {
          title: 'Acceso No Autorizado',
          description: 'Su cuenta actual no tiene permisos asignados para ingresar a este sistema.',
        };

      default:
        return {
          title: 'Ha ocurrido un error',
          description: 'No puede acceder a este sistema por el momento.`',
        };
    }
  });
  clientName = computed(() => this.errorParams()?.client_name);

  readonly identityHubAppsUrl = `${environment.identityHubUrl}/home/apps`;
}
