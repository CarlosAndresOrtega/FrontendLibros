/* eslint-disable @typescript-eslint/naming-convention */
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { authInterceptor } from '@/interceptors/auth.interceptor';
import { definePreset } from '@primeng/themes';

const myPreset = definePreset(Aura, {
    semantic: {
        button: {
            borderRadius: '1.5rem',
            roundedBorderRadius: '1.5rem',
        },
    },
});

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            appRoutes,
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled',
            }),
            withEnabledBlockingInitialNavigation(),
        ),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
        provideAnimationsAsync(),
        // TODO: research global configurations
        providePrimeNG({
            theme: { preset: myPreset, options: { darkModeSelector: '.app-dark' } },
        }),
    ],
};
