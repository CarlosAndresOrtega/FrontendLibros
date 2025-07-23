// confirmation-modal.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmationModalService } from '../services/confirmation-modal.service';

@Component({
    selector: 'confirmation-modal',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonModule],
    template: `
        <p-dialog [(visible)]="visible" [header]="options.header || 'Confirmation'" [modal]="true" [style]="{ width: '450px' }" [closable]="true" [dismissableMask]="true" (onHide)="onDialogHide()">
            <div class="flex items-center gap-4">
                <i *ngIf="options.icon" class="{{ options.icon }} !text-3xl"></i>
                <span>{{ options.message }}</span>
            </div>
            <ng-template pTemplate="footer">
                <p-button [label]="options.rejectLabel || 'No'" icon="pi pi-times" styleClass="p-button-text" [severity]="options.severity === 'error' ? 'danger' : 'secondary'" (onClick)="onReject()"> </p-button>
                <p-button [label]="options.acceptLabel || 'Yes'" icon="pi pi-check" styleClass="p-button-text" [severity]="options.severity || 'primary'" (onClick)="onAccept()"> </p-button>
            </ng-template>
        </p-dialog>
    `,
})
export class ConfirmationModalComponent implements OnInit {
    private confirmationModalService = inject(ConfirmationModalService);

    visible = false;
    options: any = {
        message: '',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes',
        rejectLabel: 'No',
        severity: 'primary',
    };

    private acceptCallback: () => void = () => {};
    private rejectCallback: () => void = () => {};

    ngOnInit() {
        this.confirmationModalService.getConfirmationObservable().subscribe((confirmation) => {
            this.options = { ...this.options, ...confirmation.options };
            this.acceptCallback = confirmation.accept;
            this.rejectCallback = confirmation.reject;
            this.visible = true;
        });
    }

    onAccept() {
        this.visible = false;
        this.acceptCallback();
    }

    onReject() {
        this.visible = false;
        this.rejectCallback();
    }

    onDialogHide() {
        console.log('entra', this.visible);
        // If the dialog is hidden without explicitly calling accept/reject,
        // we treat it as rejection
        if (this.visible) {
            this.visible = false;
            this.rejectCallback();
        }
    }
}
