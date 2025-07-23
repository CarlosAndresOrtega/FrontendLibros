import { Routes } from '@angular/router';
import { BooksContainer } from './books/container';

export default [
    { path: '', redirectTo: 'books', pathMatch: 'full' },
    { path: 'books', data: { breadcrumb: 'Books' }, component: BooksContainer },
] as Routes;
