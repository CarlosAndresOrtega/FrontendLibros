import { mapQueryParams } from '@/common/utils/query-params-mapper';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Book, BooksResponse } from './interface/book.model';

@Injectable({
    providedIn: 'root',
})
export class BooksService {
    private _http = inject(HttpClient);
    constructor() {}

    /**
     * Retrieve clients with optional query parameters.
     */
    getAll(queryparams?: Record<string, any>): Observable<BooksResponse> {
        const httpParams = mapQueryParams(queryparams);
        return this._http.get<BooksResponse>(`${environment.baseUrl}/books`, { params: httpParams });
    }

    getBookById(Id: any) {
        return this._http.get(`${environment.baseUrl}/books/${Id}`);
    }

    getFilters() {
        return this._http.get(`${environment.baseUrl}/books/filters`);
    }

    scraping(page: number): Observable<any> {
    return this._http.get(`${environment.baseUrl}/books/scrape-books`, {
        params: {
            page: page.toString()
        },
    });
}

    update(clientId: any, data: any) {
        return this._http.put(`${environment.baseUrl}/clients/${clientId}`, data);
    }

    deleteBook(Id: number | undefined) {
        return this._http.delete(`${environment.baseUrl}/books/${Id}`);
    }

    getAllInteractions(clientId: any) {
        return this._http.get(`${environment.baseUrl}/clients/${clientId}/interactions`);
    }
}
