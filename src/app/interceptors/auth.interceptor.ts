import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, switchMap, Observable, throwError } from 'rxjs';
import { AuthService } from '../pages/auth/auth.service';

/**
 * Interceptor
 *
 * @param req
 * @param next
 */
export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const authReq = authService.accessToken
        ? req.clone({
              headers: req.headers.set('Authorization', `Bearer ${authService.accessToken}`).set('x-session-id', authService.sesssionId),
          })
        : req;

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !req.url.endsWith('/auth/refresh')) {
                return handle401Error(req, next, authService, router, error);
            }
            return throwError(() => new Error(error.message));
        }),
    );
};

/**
 * Handle 401 Error
 *
 * @param req
 * @param next
 * @param authService
 * @param router
 * @returns {Observable<HttpEvent<unknown>>}
 */
function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService, router: Router, error: HttpErrorResponse): Observable<HttpEvent<unknown>> {
    return authService.refreshTokens().pipe(
        switchMap((token: string) => {
            if (!token) {
                authService.signOut();
                return throwError(() => new Error('Token refresh failed'));
            }

            const clonedReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`).set('x-session-id', authService.sesssionId),
            });
            return next(clonedReq);
        }),
        catchError((err) => {
            console.error(error);
            authService.signOut();
            return throwError(() => error);
        }),
    );
}
