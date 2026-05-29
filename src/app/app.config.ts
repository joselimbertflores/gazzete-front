import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
  provideRouter,
} from '@angular/router';

import { definePreset, palette } from '@primeuix/themes';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import theme from '@primeuix/themes/aura';
import { es } from 'primelocale/es.json';

import { handleTransitionCreated } from './core/router/view-transition.config';
import { httpErrorInterceptor } from './core/http/http-error-interceptor';
import { authInterceptor } from './core/auth/auth-interceptor';
import { routes } from './app.routes';

const primaryColor = palette('{green}');
const AuraSky = definePreset(theme, {
  semantic: {
    primary: primaryColor,
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'disabled',
      }),
      withViewTransitions({ onViewTransitionCreated: handleTransitionCreated }),
    ),
    provideHttpClient(withInterceptors([httpErrorInterceptor, authInterceptor])),
    providePrimeNG({
      translation: es,
      theme: {
        preset: AuraSky,
        options: {
          darkModeSelector: false || 'none',
        },
      },
    }),
    MessageService,
  ],
};
