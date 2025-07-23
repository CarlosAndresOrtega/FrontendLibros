import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { of, switchMap } from 'rxjs';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);

    // Check the authentication status
    return inject(AuthService)
        .check()
        .pipe(
            switchMap((authenticated) => {
                // If the user is not authenticated...
                if (!authenticated) {
                    // Redirect to the sign-in page with a redirectUrl param
                    const redirectURL = state.url === '/sign-out' ? '' : `redirectURL=${state.url}`;
                    const urlTree = router.parseUrl(`sign-in?${redirectURL}`);

                    return of(urlTree);
                }

                // Allow the access
                return of(true);
            }),
        );
};

// ---------------------- REPLACE ABOVE CODE WITH THIS AFTER DEFINING ROLES AND PERMISSIONS ---------------------------------
// ------------------------------- UPDATE LOGIC ACCORDINGLY FOR ROLES AND PERMISSIONS ---------------------------------------

// export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
//     const router: Router = inject(Router);
//     const authService: AuthService = inject(AuthService);

//     const token = route.queryParams['tkn'];
//     if (token) {
//       authService.accessToken = token;
//       const baseUrl = state.url.split('?')[0];
//       if (baseUrl === '/') {
//           return router.parseUrl('/dashboard');
//       }
//       return true;
//     }

//     // Check the authentication status
//     return authService.check().pipe(
//       map((authenticated) => {
//         if (!authenticated) {
//           const redirectURL = state.url === '/sign-out' ? '' : `redirectURL=${state.url}`;
//           return router.parseUrl(`sign-in?${redirectURL}`);
//         }

//         const requiredRoles = route.data.roles as string[];
//         if (requiredRoles) {
//           const userHasRequiredRoles = requiredRoles.every((role) => authService.hasRole('AIVA_admin'));
//           if (!userHasRequiredRoles) {
//             return router.parseUrl('/dashboard');
//           }
//         }

//         const requiredPermissions = route.data['permissions'] as string[];
//         if (requiredPermissions) {
//           const userHasRequiredPermissions = requiredPermissions.every((permission) => authService.hasPermission(permission));
//           if (!userHasRequiredPermissions) {
//             return router.parseUrl('/dashboard');
//           }
//         }

//         return true;
//       }),
//     );
//   };
