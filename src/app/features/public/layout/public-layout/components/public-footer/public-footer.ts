import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface FooterLink {
  readonly label: string;
  readonly href: string;
  readonly fragment?: string;
  readonly icon?: string;
}

interface ContactItem {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
}

@Component({
  selector: 'public-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer id="ayuda" class="border-t border-surface-200 bg-surface-950 text-surface-0">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid gap-9 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.15fr)]">
          <section aria-labelledby="footer-brand" class="md:pr-8 lg:pr-12">
            <h2
              id="footer-brand"
              class="text-base font-semibold tracking-tight text-surface-0"
            >
              Gaceta Municipal de Sacaba
            </h2>
            <p class="mt-3 text-sm leading-6 text-surface-300">
              Portal público para consultar documentos oficiales, normativa municipal y publicaciones
              institucionales del Gobierno Autónomo Municipal de Sacaba.
            </p>
          </section>

          <nav aria-label="Enlaces internos">
            <h3 class="text-sm font-semibold text-surface-0">Enlaces útiles</h3>
            <ul class="mt-4 space-y-2.5 text-sm text-surface-300">
              @for (link of usefulLinks; track link.label) {
                <li>
                  <a
                    [routerLink]="link.href"
                    [fragment]="link.fragment"
                    class="transition hover:text-primary-300 focus-visible:text-primary-300"
                  >
                    {{ link.label }}
                  </a>
                </li>
              }
            </ul>
          </nav>

          <nav aria-label="Canales oficiales">
            <h3 class="text-sm font-semibold text-surface-0">Información institucional</h3>
            <ul class="mt-4 space-y-2.5 text-sm text-surface-300">
              @for (link of institutionalLinks; track link.label) {
                <li>
                  <a
                    [href]="link.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 transition hover:text-primary-300 focus-visible:text-primary-300"
                  >
                    @if (link.icon) {
                      <i [class]="link.icon" class="text-xs" aria-hidden="true"></i>
                    }
                    {{ link.label }}
                  </a>
                </li>
              }
            </ul>
          </nav>

          <section aria-labelledby="footer-contact">
            <h3 id="footer-contact" class="text-sm font-semibold text-surface-0">Contacto</h3>
            <ul class="mt-4 space-y-3 text-sm text-surface-300">
              @for (item of contactItems; track item.label) {
                <li class="flex gap-3">
                  <i [class]="item.icon" class="mt-1 text-xs text-primary-300" aria-hidden="true"></i>
                  <span>
                    <span class="block font-medium text-surface-100">{{ item.label }}</span>
                    <span class="block leading-6">{{ item.value }}</span>
                  </span>
                </li>
              }
            </ul>
          </section>
        </div>

        <div
          class="mt-10 flex flex-col gap-2 border-t border-surface-700 pt-5 text-xs leading-5 text-surface-400 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>© {{ currentYear }} Gobierno Autónomo Municipal de Sacaba.</p>
          <p>Sistema de consulta pública de la Gaceta Municipal.</p>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFooter {
  readonly currentYear = new Date().getFullYear();

  readonly usefulLinks: FooterLink[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Documentos', href: '/documents' },
    { label: 'Normativas por tipo', href: '/', fragment: 'normativas' },
    { label: 'Administración', href: '/admin' },
  ];

  readonly institutionalLinks: FooterLink[] = [
    {
      label: 'Sitio institucional',
      href: 'https://www.sacaba.gob.bo',
      icon: 'pi pi-globe',
    },
    {
      label: 'Concejo Municipal',
      href: 'https://www.sacaba.gob.bo/concejo-municipal',
      icon: 'pi pi-building',
    },
    {
      label: 'Transparencia municipal',
      href: 'https://www.sacaba.gob.bo/transparencia',
      icon: 'pi pi-folder-open',
    },
  ];

  readonly contactItems: ContactItem[] = [
    {
      label: 'Dirección',
      value: 'Plaza Principal 6 de Agosto, Sacaba, Cochabamba',
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
