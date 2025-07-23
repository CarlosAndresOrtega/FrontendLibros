import { Routes } from '@angular/router';
import { AccessDenied } from './accessdenied';
import { Error } from './error';
import { Login } from './login';

export default [
    { path: 'error', component: Error },
    { path: 'access', component: AccessDenied },
    { path: 'login', component: Login },
    { path: '**', redirectTo: '/notfound' },
] as Routes;
