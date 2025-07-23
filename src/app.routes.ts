import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                // data: { breadcrumb: 'Pages' },
                loadChildren: () => import('./app/pages/pages.routes'),
            },
        ],
    },
    { path: 'auth', loadChildren: () => import('@/pages/auth/auth.routes') },

    { path: '**', redirectTo: '/notfound' },
];
