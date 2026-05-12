import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-home-page',
  template: `
    <section class="flex min-h-full items-center justify-center px-6">
      <div class="w-full max-w-2xl text-center">
        <p class="text-sm font-medium text-primary-600">Sistema Gaceta Municipal</p>

        <h1 class="mt-3 text-2xl font-semibold text-surface-900">
          Bienvenido al panel del sistema
        </h1>

        <p class="mx-auto mt-4 max-w-xl text-sm leading-6 text-surface-600">
          Desde este espacio puedes acceder a las funcionalidades habilitadas para tu perfil.
          Utiliza el menú lateral para navegar entre los módulos disponibles.
        </p>
      </div>
    </section>
  `,
})
export default class AdminHomePage {}
