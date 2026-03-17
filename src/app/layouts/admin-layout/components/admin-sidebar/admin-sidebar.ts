import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

import { AuthDataSource } from '../../../../core/auth/auth-data-source';
import { UserRole } from '../../../../core/auth/auth.types';

interface SidebarItem {
  label: string;
  icon: string;
  expanded?: boolean;
  routerLink?: string;
  role?: UserRole;
  items?: SidebarItem[];
}
@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterModule, PanelMenuModule, CommonModule],
  template: `
    <div class="h-full flex flex-col bg-surface-0">
      <div class="flex items-center gap-3 h-14 sm:px-4">
        <!-- <app-icon /> -->
        <div class="flex flex-col leading-tight">
          <span class="font-semibold text-surface-900"> Intranet </span>
          <span class="text-xs text-surface-500"> Administracion </span>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto py-2 sm:px-2">
        <p-panelMenu [model]="filteredMenu()" class="w-full" [multiple]="true">
          <ng-template #item let-item>
            <a
              pRipple
              [routerLink]="item.routerLink"
              [routerLinkActiveOptions]="{ exact: false }"
              routerLinkActive="bg-primary-100 !text-primary-700 rounded-lg"
              class="flex items-center gap-x-3 px-2 py-2 text-surface-700 hover:bg-surface-100 hover:rounded-lg transition-colors mb-1"
            >
              @if (item.icon) {
                <i [class]="item.icon"></i>
              }

              <span [ngClass]="{ 'font-medium': item.items }">
                {{ item.label }}
              </span>

              @if (item.items) {
                <i
                  class="pi pi-chevron-down ml-auto transition-transform duration-200"
                  [ngClass]="{ 'rotate-180': item.expanded }"
                  style="font-size: 12px;"
                ></i>
              }
            </a>
          </ng-template>
        </p-panelMenu>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSidebar {
  private authDataSource = inject(AuthDataSource);

  // Si el padre tiene items → se ignora su resource.
  // Si no tiene items, entonces sí se usa resource.

  // Esto evita inconsistencias como:
  // - El padre permitido pero todos los hijos prohibidos.
  // - O el padre bloqueando hijos que sí deberían mostrarse.

  readonly menu: SidebarItem[] = [
    {
      label: 'Documentos',
      icon: 'pi pi-folder',
      expanded: true,
      items: [
        {
          label: 'Tipos de documentos',
          icon: 'pi pi-list',
          routerLink: 'document-types',
          role: UserRole.USER,
        },

        {
          label: 'Documentos',
          icon: 'pi pi-file',
          routerLink: 'documents',
          role: UserRole.USER,
        },
      ],
    },

    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      routerLink: 'users',
    },
  ];

  filteredMenu = computed<MenuItem[]>(() => this.filterMenu(this.menu));

  private filterMenu(items: SidebarItem[]): MenuItem[] {
    return items
      .map(({ role, items, ...props }) => {
        if (items) {
          const children = this.filterMenu(items);
          return children.length ? { ...props, items: children } : null;
        }
        if (!role) return props;

        return this.authDataSource.user()?.roles.some((userRole) => userRole === role)
          ? props
          : null;
      })
      .filter((item) => item !== null);
  }
}
