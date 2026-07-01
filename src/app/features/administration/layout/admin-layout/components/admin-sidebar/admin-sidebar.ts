import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RippleModule } from 'primeng/ripple';

import { AuthDataSource } from '../../../../../../core/auth/auth-data-source';
import { UserRole } from '../../../../../../core/auth/auth.types';

interface SidebarItem {
  label: string;
  icon: string;
  routerLink: string;
  roles?: UserRole[];
  badge?: string;
}
@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterModule, RippleModule],
  host: {
    class: 'block h-full',
  },
  template: `
    <div class="flex h-full flex-col bg-surface-0">
      <a
        routerLink="/admin"
        class="flex min-h-16 items-center gap-3 border-b border-surface-100 px-4 outline-none transition-colors hover:bg-surface-50 focus-visible:ring-2 focus-visible:ring-primary-300"
      >
        <!-- App icon -->
        <div class="min-w-0 leading-tight">
          <span class="block truncate text-sm font-semibold text-surface-950">Gaceta</span>
          <span class="block truncate text-xs text-surface-500">Panel administrativo</span>
        </div>
      </a>

      <nav class="flex-1 overflow-y-auto p-3" aria-label="Menu administrativo">
        <div class="space-y-1">
          @for (item of visibleMenu(); track item.routerLink) {
            <a
              pRipple
              [routerLink]="item.routerLink"
              routerLinkActive="bg-primary-50 text-primary-700 border-primary-200"
              class="flex min-h-10 items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 hover:text-surface-950"
            >
              <i [class]="item.icon + ' text-base'"></i>
              <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
              @if (item.badge) {
                <span
                  class="rounded-full bg-surface-100 px-2 py-0.5 text-[11px] font-semibold text-surface-500"
                >
                  {{ item.badge }}
                </span>
              }
            </a>
          }
        </div>
      </nav>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSidebar {
  private authDataSource = inject(AuthDataSource);

  readonly userRoles = computed(() => this.authDataSource.user()?.roles ?? []);

  readonly menu: SidebarItem[] = [
    {
      label: 'Publicaciones',
      icon: 'pi pi-file',
      routerLink: '/admin/documents',
      roles: [UserRole.USER],
    },
    {
      label: 'Tipos de documentos',
      icon: 'pi pi-list',
      routerLink: '/admin/document-types',
      roles: [UserRole.ADMIN],
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      routerLink: '/admin/users',
      roles: [UserRole.ADMIN],
    },
  ];

  readonly visibleMenu = computed(() =>
    this.menu.filter((item) => item.roles?.some((role) => this.userRoles().includes(role)) ?? true),
  );
}
