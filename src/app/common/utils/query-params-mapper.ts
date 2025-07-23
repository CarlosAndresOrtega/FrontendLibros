import { HttpParams } from '@angular/common/http';

/**
 * Map a record of query parameters to HttpParams, handling special cases like sort arrays.
 */
export function mapQueryParams(paramsObj?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    if (!paramsObj) {
        return httpParams;
    }
    Object.keys(paramsObj).forEach((key) => {
        const value = paramsObj[key];
        if (value === null) {
            return;
        }
        if (key === 'sort') {
            const sortValue = Array.isArray(value) ? value.join(',') : value;
            httpParams = httpParams.set(key, sortValue);
        } else {
            httpParams = httpParams.set(key, value);
        }
    });
    return httpParams;
}
