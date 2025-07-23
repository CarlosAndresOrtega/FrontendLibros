import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthUtils } from './auth.utils';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _verifyResponse = new BehaviorSubject<any>(null);

    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);

    private _router = inject(Router);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }
    set sesssionId(sesssionId: string) {
        localStorage.setItem('sesssionId', sesssionId);
    }
    set refreshToken(token: string) {
        localStorage.setItem('refreshToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }
    get sesssionId(): string {
        return localStorage.getItem('sesssionId') ?? '';
    }
    get refreshToken(): string {
        return localStorage.getItem('refreshToken') ?? '';
    }
    get verifyResponse$(): Observable<any> {
        return this._verifyResponse.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

   

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient
        .post(`${environment.baseUrl}/auth/login`, credentials) 
        .pipe(
            switchMap((response: any) => {
                this.accessToken = response.access_token; 
                this.refreshToken = response.refresh_token ?? null;
                this.sesssionId = uuidv4();

                localStorage.setItem('accessToken', this.accessToken);

                this._authenticated = true;

                // 🚀 Redirige al módulo deseado
                this._router.navigate(['/books']);

                return of(response);
            }),
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient
            .post('api/auth/sign-in-with-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() =>
                    // Return false
                    of(false),
                ),
                switchMap((response: any) => {
                    // Replace the access token with the new one if it's available on
                    // the response object.
                    //
                    // This is an added optional step for better security. Once you sign
                    // in using the token, you should generate a new one on the server
                    // side and attach it to the response object. Then the following
                    // piece of code can replace the token with the refreshed one.
                    if (response.accessToken) {
                        this.accessToken = response.accessToken;
                    }

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    // this._userService.user = this.mockUser;

                    // Return true
                    return of(true);
                }),
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user-roles');
        localStorage.removeItem('user-permissions');
        localStorage.removeItem('sessionId');
        // Set the authenticated flag to false
        this._authenticated = false;

        this._router.navigate(['/auth/login']);
        // Return the observable
        return of(true);
    }

    refreshTokens(): Observable<any> {
        const refreshToken = this.refreshToken;
        if (!refreshToken) {
            this.signOut();
            return throwError(() => new Error('No refresh token'));
        }

        return this._httpClient.post(`${environment.authenticationApiUrl}/refresh`, { token: refreshToken }).pipe(
            switchMap((response: any) => {
                this.accessToken = response?.accessToken;
                this.refreshToken = response?.refreshToken;
                return of(response.accessToken);
            }),
            catchError((error) => {
                this.signOut();
                return throwError(() => new Error('Error refreshing token'));
            }),
        );
    }

}
