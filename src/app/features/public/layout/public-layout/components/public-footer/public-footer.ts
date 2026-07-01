import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InstitutionalLogo } from '../institutional-logo/institutional-logo';

interface ContactItem {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
  readonly href?: string;
  readonly detail?: string;
}

interface OfficialChannel {
  readonly label: string;
  readonly href: string;
  readonly icon: string;
}

@Component({
  selector: 'public-footer',
  standalone: true,
  imports: [InstitutionalLogo],
  template: `
    <footer class="border-t border-white/10 bg-primary-950 text-surface-0">
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="grid gap-9 md:grid-cols-2 lg:grid-cols-3">
          <section aria-labelledby="footer-brand" class="md:col-span-2 lg:col-span-1 lg:pr-8">
            <div class="flex items-center gap-4">
              <institutional-logo />

              <div class="min-w-0">
                <h2 id="footer-brand" class="text-lg font-semibold tracking-tight text-surface-0">
                  Gaceta Municipal
                </h2>
                <p class="mt-0.5 text-sm font-medium text-surface-300">
                  Gobierno Autónomo Municipal de Sacaba
                </p>
              </div>
            </div>

            <p class="mt-5 max-w-md text-sm leading-6 text-surface-300">
              Portal público de consulta de normativas municipales.
            </p>
          </section>

          <section aria-labelledby="footer-contact">
            <h3 id="footer-contact" class="text-sm font-semibold text-surface-0">
              Contacto institucional
            </h3>
            <address class="not-italic">
              <ul class="mt-5 space-y-4">
                @for (item of contactItems; track item.label) {
                  <li class="flex gap-3">
                    <i
                      [class]="item.icon"
                      class="mt-1 text-sm text-primary-300"
                      aria-hidden="true"
                    ></i>
                    <span>
                      <span class="block text-sm font-semibold text-surface-100">{{
                        item.label
                      }}</span>
                      @if (item.href) {
                        <a
                          [href]="item.href"
                          class="mt-0.5 block text-sm leading-6 text-surface-300 transition-colors hover:text-primary-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-300"
                        >
                          {{ item.value }}
                        </a>
                      } @else {
                        <span class="mt-0.5 block text-sm leading-6 text-surface-300">
                          {{ item.value }}
                        </span>
                      }
                      @if (item.detail) {
                        <span class="mt-0.5 block text-xs leading-5 text-surface-400">
                          {{ item.detail }}
                        </span>
                      }
                    </span>
                  </li>
                }
              </ul>
            </address>
          </section>

          <section aria-labelledby="footer-official-channels">
            <h3 id="footer-official-channels" class="text-sm font-semibold text-surface-0">
              Canales oficiales
            </h3>
            <ul class="mt-5 space-y-3">
              @for (channel of officialChannels; track channel.href) {
                <li>
                  <a
                    [href]="channel.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-3 text-sm text-surface-300 transition-colors hover:text-primary-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-300"
                    [attr.aria-label]="'Abrir ' + channel.label + ' en una nueva pestaña'"
                  >
                    <i
                      [class]="channel.icon"
                      class="text-sm text-primary-300"
                      aria-hidden="true"
                    ></i>
                    <span>{{ channel.label }}</span>
                    <i class="pi pi-external-link text-xs text-surface-400" aria-hidden="true"></i>
                  </a>
                </li>
              }
            </ul>
          </section>
        </div>

        <div
          class="mt-9 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs leading-5 text-surface-300 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>
            © {{ currentYear }} Gobierno Autónomo Municipal de Sacaba. Todos los derechos
            reservados.
          </p>
          <p>Gaceta Municipal de Sacaba</p>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFooter {
  readonly currentYear = new Date().getFullYear();

  readonly contactItems: ContactItem[] = [
    {
      label: 'Dirección',
      value: 'Plaza 6 de Agosto, Sacaba, Bolivia',
      icon: 'pi pi-map-marker',
      detail: 'GAM-SACABA, CONSISTORIAL S-002, BOLIVIA',
    },
    {
      label: 'Línea directa',
      value: '+(591) 4-4701677',
      icon: 'pi pi-phone',
      href: 'tel:+59144701677',
    },
    {
      label: 'Correo institucional',
      value: 'info@sacaba.gob.bo',
      icon: 'pi pi-envelope',
      href: 'mailto:info@sacaba.gob.bo',
    },
    {
      label: 'Sugerencias',
      value: 'gobiernoelectronico@sacaba.gob.bo',
      icon: 'pi pi-envelope',
      href: 'mailto:gobiernoelectronico@sacaba.gob.bo',
    },
  ];

  readonly officialChannels: OfficialChannel[] = [
    {
      label: 'Sitio web institucional',
      href: 'https://sacaba.gob.bo/',
      icon: 'pi pi-globe',
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/gob.municipal.sacaba',
      icon: 'pi pi-facebook',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/gamsacaba',
      icon: 'pi pi-instagram',
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@gamsacaba',
      icon: 'pi pi-tiktok',
    },
  ];
}
