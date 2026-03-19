import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'public-footer',
  imports: [],
  template: `
    <footer class="border-t border-surface-200 bg-surface-0">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-900">Gaceta Municipal</p>
            <p class="mt-1 text-sm text-slate-600">
              Publicación oficial del Gobierno Autónomo Municipal de Sacaba
            </p>
          </div>

          <nav class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600 md:justify-end">
            <a
              href="https://..."
              target="_blank"
              rel="noopener noreferrer"
              class="transition hover:text-slate-900"
            >
              Sitio institucional
            </a>
            <a
              href="https://facebook.com/..."
              target="_blank"
              rel="noopener noreferrer"
              class="transition hover:text-slate-900"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com/..."
              target="_blank"
              rel="noopener noreferrer"
              class="transition hover:text-slate-900"
            >
              Instagram
            </a>
          </nav>
        </div>

        <div class="mt-6 border-t border-surface-200 pt-4">
          <p class="text-xs leading-5 text-surface-500">© {{ currentYear }} Gobierno electronico.</p>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFooter {
  currentYear = new Date().getFullYear();
}
