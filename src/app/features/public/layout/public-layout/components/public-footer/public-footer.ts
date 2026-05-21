import { ChangeDetectionStrategy, Component } from '@angular/core';

interface FooterInfoItem {
  readonly label: string;
  readonly description: string;
  readonly icon: string;
}

interface ContactItem {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
}

@Component({
  selector: 'public-footer',
  standalone: true,
  template: `
    <footer class="border-t border-primary-900 bg-primary-950 text-surface-0">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <section aria-labelledby="footer-brand" class="lg:pr-10">
            <div class="flex items-center gap-4">
              <img
                src="/images/gaceta/gaceta-logo-mark.webp"
                alt="Marca de la Gaceta Municipal"
                class="h-14 w-14 shrink-0 rounded-2xl object-cover"
                width="56"
                height="56"
              />

              <div class="min-w-0">
                <h2
                  id="footer-brand"
                  class="text-lg font-semibold tracking-tight text-surface-0"
                >
                  Gaceta Municipal
                </h2>
                <p class="mt-0.5 text-sm font-medium text-surface-300">
                  Gobierno Autónomo Municipal de Sacaba
                </p>
              </div>
            </div>

            <p class="mt-5 max-w-md text-sm leading-6 text-surface-300">
              Portal público de consulta de documentos normativos municipales.
            </p>
          </section>

          <section aria-labelledby="footer-public-consultation">
            <h3 id="footer-public-consultation" class="text-sm font-semibold text-surface-0">
              Consulta pública
            </h3>
            <ul class="mt-5 space-y-4">
              @for (item of publicConsultationItems; track item.label) {
                <li class="flex gap-3">
                  <i [class]="item.icon" class="mt-1 text-sm text-primary-300" aria-hidden="true"></i>
                  <span>
                    <span class="block text-sm font-semibold text-surface-100">{{ item.label }}</span>
                    <span class="mt-0.5 block text-sm leading-6 text-surface-300">
                      {{ item.description }}
                    </span>
                  </span>
                </li>
              }
            </ul>
          </section>

          <section aria-labelledby="footer-contact">
            <h3 id="footer-contact" class="text-sm font-semibold text-surface-0">Contacto</h3>
            <ul class="mt-5 space-y-4">
              @for (item of contactItems; track item.label) {
                <li class="flex gap-3">
                  <i [class]="item.icon" class="mt-1 text-sm text-primary-300" aria-hidden="true"></i>
                  <span>
                    <span class="block text-sm font-semibold text-surface-100">{{ item.label }}</span>
                    <span class="mt-0.5 block text-sm leading-6 text-surface-300">
                      {{ item.value }}
                    </span>
                  </span>
                </li>
              }
            </ul>
          </section>
        </div>

        <div
          class="mt-10 flex flex-col gap-2 border-t border-primary-900 pt-5 text-xs leading-5 text-surface-300 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>© {{ currentYear }} Gobierno Autónomo Municipal de Sacaba. Todos los derechos reservados.</p>
          <p>Gaceta Municipal de Sacaba</p>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFooter {
  readonly currentYear = new Date().getFullYear();

  readonly publicConsultationItems: FooterInfoItem[] = [
    {
      label: 'Normativas municipales',
      description: 'Consulta de disposiciones y normativa municipal publicada.',
      icon: 'pi pi-book',
    },
    {
      label: 'Documentos oficiales publicados',
      description: 'Registro público de documentos normativos disponibles.',
      icon: 'pi pi-file',
    },
    {
      label: 'Archivo normativo por gestión',
      description: 'Información organizada para consulta histórica por año.',
      icon: 'pi pi-calendar',
    },
  ];

  readonly contactItems: ContactItem[] = [
    {
      label: 'Dirección',
      value: 'Plaza 6 de Agosto, Sacaba',
      icon: 'pi pi-map-marker',
    },
    {
      label: 'Atención',
      value: 'Lunes a viernes de 08:00 a 16:00',
      icon: 'pi pi-clock',
    },
    {
      label: 'Correo',
      value: 'gaceta.municipal@sacaba.gob.bo',
      icon: 'pi pi-envelope',
    },
  ];
}
