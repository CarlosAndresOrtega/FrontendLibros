// confirmation.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ConfirmationOptions {
    header?: string;
    message: string;
    icon?: string;
    acceptLabel?: string;
    rejectLabel?: string;
    severity?: 'info' | 'warn' | 'error' | 'success';
}

@Injectable({
    providedIn: 'root',
})
export class ConfirmationModalService {
    private confirmationSubject = new Subject<{
        options: ConfirmationOptions;
        accept: () => void;
        reject: () => void;
    }>();

    confirm(options: ConfirmationOptions): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.confirmationSubject.next({
                options,
                accept: () => resolve(true),
                reject: () => resolve(false),
            });
        });
    }

    getConfirmationObservable(): Observable<{
        options: ConfirmationOptions;
        accept: () => void;
        reject: () => void;
    }> {
        return this.confirmationSubject.asObservable();
    }
}
