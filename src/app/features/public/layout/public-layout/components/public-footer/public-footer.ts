import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'public-footer',
  imports: [RouterModule],
  template: `
    <footer class="mt-12 border-t border-surface-200 bg-surface-0">
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="grid gap-8 md:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <section aria-labelledby="footer-brand" class="md:pr-8 lg:pr-12">
            <h2
              id="footer-brand"
              class="text-xs font-semibold uppercase tracking-[0.14em] text-surface-600"
            >
              Gaceta Municipal
            </h2>
            <p class="mt-3 text-sm leading-6 text-surface-700">
              Portal oficial para consulta pública de ordenanzas, decretos, resoluciones y normativa
              municipal.
            </p>
          </section>

          <nav aria-label="Enlaces internos">
            <h3 class="text-sm font-semibold text-surface-900">Navegación</h3>
            <ul class="mt-3 space-y-2 text-sm text-surface-700">
              <li>
                <a routerLink="/" class="transition hover:text-primary-700 focus-visible:text-primary-700">
                  Inicio
                </a>
              </li>
              <li>
                <a
                  routerLink="/documents"
                  class="transition hover:text-primary-700 focus-visible:text-primary-700"
                >
                  Documentos
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Canales oficiales">
            <h3 class="text-sm font-semibold text-surface-900">Enlaces Institucionales</h3>
            <ul class="mt-3 space-y-2 text-sm text-surface-700">
              <li>
                <a
                  href="https://..."
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 transition hover:text-primary-700 focus-visible:text-primary-700"
                >
                  <i class="pi pi-globe text-xs" aria-hidden="true"></i>
                  Sitio institucional
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/..."
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 transition hover:text-primary-700 focus-visible:text-primary-700"
                >
                  <i class="pi pi-facebook text-xs" aria-hidden="true"></i>
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/..."
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 transition hover:text-primary-700 focus-visible:text-primary-700"
                >
                  <i class="pi pi-instagram text-xs" aria-hidden="true"></i>
                  Instagram
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div
          class="mt-8 flex flex-col gap-2 border-t border-surface-200 pt-4 text-xs leading-5 text-surface-500 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>© {{ currentYear }} Gobierno Autónomo Municipal de Sacaba.</p>
          <p>Plataforma pública de consulta normativa.</p>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFooter {
  currentYear = new Date().getFullYear();
}
