import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import {
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
  provideRouter,
} from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { definePreset, palette } from '@primeuix/themes';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import theme from '@primeuix/themes/aura';
import { es } from 'primelocale/es.json';

import { handleTransitionCreated } from './core/router/view-transition.config';
import { httpErrorInterceptor } from './core/http/http-error-interceptor';
import { authInterceptor } from './core/auth/auth-interceptor';
import { routes } from './app.routes';

registerLocaleData(localeEs);

const primaryColor = palette('{green}');
const GacetaPreset = definePreset(theme, {
  semantic: {
    primary: primaryColor,
  },
  extend: {
    accent: {
      50: '#fdfaf1',
      100: '#f8efcf',
      200: '#f0dc9c',
      300: '#e5c364',
      400: '#d4a33a',
      500: '#b98328',
      600: '#95631f',
      700: '#774b1c',
      800: '#633d1c',
      900: '#55341c',
      950: '#301a0c',
    },
    secondary: {
      50: '#effcfb',
      100: '#d5f6f2',
      200: '#afebe5',
      300: '#7bd9d1',
      400: '#45bfb6',
      500: '#299f97',
      600: '#207f7a',
      700: '#1d6663',
      800: '#1c5250',
      900: '#1b4543',
      950: '#0b2929',
    },
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
    provideHttpClient(withFetch(), withInterceptors([httpErrorInterceptor, authInterceptor])),
    provideClientHydration(),
    { provide: LOCALE_ID, useValue: 'es' },
    providePrimeNG({
      translation: es,
      theme: {
        preset: GacetaPreset,
        options: {
          darkModeSelector: false || 'none',
        },
      },
    }),
    MessageService,
  ],
};
