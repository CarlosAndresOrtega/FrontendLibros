import { Injectable, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class QueryParamsService {
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    // Signal to store current query params
    private _queryParams = signal<Record<string, any>>({});

    // Expose readonly version of the signal
    queryParams = this._queryParams.asReadonly();

    constructor() {
        // Initialize by subscribing to route query params
        this.route.queryParams
            .pipe(
                filter((params) => Object.keys(params).length > 0),
                map((params) => {
                    // Convert string params to appropriate types when possible
                    const processedParams: Record<string, any> = {};
                    for (const key in params) {
                        const value = params[key];

                        // Try to parse numbers
                        if (!isNaN(Number(value)) && value !== '') {
                            processedParams[key] = Number(value);
                        }
                        // Parse booleans
                        else if (value === 'true' || value === 'false') {
                            processedParams[key] = value === 'true';
                        }
                        // Handle arrays stored as comma-separated strings
                        else if (typeof value === 'string' && value.includes(',')) {
                            processedParams[key] = value.split(',').map((item) => item.trim());
                        }
                        // Keep as is
                        else {
                            processedParams[key] = value;
                        }
                    }
                    return processedParams;
                }),
            )
            .subscribe((params) => {
                this._queryParams.set(params);
            });
    }

    /**
     * Updates query parameters
     * @param params - Object containing parameters to set
     * @param options - Router navigation options
     */
    updateParams(
        params: Record<string, any>,
        options: {
            replaceUrl?: boolean;
            merge?: boolean;
        } = { merge: true },
    ): void {
        const currentParams = options.merge ? { ...this._queryParams() } : {};

        // Merge or replace with new params
        const updatedParams = { ...currentParams, ...params };

        // Remove null or undefined params
        Object.keys(updatedParams).forEach((key) => {
            if (updatedParams[key] === null || updatedParams[key] === undefined) {
                delete updatedParams[key];
            }

            // Convert arrays to comma-separated strings
            if (Array.isArray(updatedParams[key])) {
                updatedParams[key] = updatedParams[key].join(',');
            }
        });
        // Navigate with new params
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: updatedParams,
            replaceUrl: options.replaceUrl ?? false,
            queryParamsHandling: null, // Remove to replace all params
        });
    }

    /**
     * Clears all query parameters
     */
    clearParams(): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true,
        });

        this._queryParams.set({});
    }

    /**
     * Gets a specific parameter value
     * @param key - Parameter key
     * @param defaultValue - Default value if parameter doesn't exist
     */
    getParam<T>(key: string, defaultValue?: T): T {
        const params = this._queryParams();
        return key in params ? params[key] : (defaultValue as T);
    }

    /**
     * Removes specific parameters
     * @param keys - Array of parameter keys to remove
     */
    removeParams(keys: string[]): void {
        const currentParams = { ...this._queryParams() };

        keys.forEach((key) => {
            delete currentParams[key];
        });

        this.updateParams(currentParams, { merge: false });
    }

    /**
     * Checks if the current query parameters object is empty
     * @returns true if there are no query parameters, false otherwise
     */
    isEmpty(): boolean {
        return Object.keys(this._queryParams()).length === 0;
    }

    prepareFilters(filtersData: any[]): any {
        const queryParams = this.queryParams();

        return filtersData.map((filter) => {
            if (queryParams[filter.queryParam] !== undefined) {
                filter.values.forEach((value: any) => {
                    if (value.id.toString() === queryParams[filter.queryParam].toString()) {
                        value.selected = true;
                    }
                });
            }
            return filter;
        });
    }
}
