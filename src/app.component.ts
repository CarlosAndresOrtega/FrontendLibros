import { ConfirmationModalComponent } from '@/common/components/confirmation-modal';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ConfirmationModalComponent],
    template: `<router-outlet></router-outlet>
        <confirmation-modal></confirmation-modal> `,
})
export class AppComponent {}
