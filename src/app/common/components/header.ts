import { Component, ContentChild, TemplateRef, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { input, signal, output } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';
import { AppTopbar } from '@/layout/components/app.topbar';

@Component({
    selector: 'page-header',
    standalone: true,
    imports: [ToolbarModule, ButtonModule, InputTextModule, DropdownModule, CommonModule, FormsModule, IconFieldModule, InputIconModule, AppTopbar],
    template: `
        <div class="flex flex-col w-full">
            <div class="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                <div class="flex items-center">
                    <div class="!m-0" app-topbar></div>
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white">{{ title() }}</h1>
                </div>
                <div>
                    <ng-container *ngIf="actionsTemplate">
                        <ng-container *ngTemplateOutlet="actionsTemplate"></ng-container>
                    </ng-container>
                </div>
            </div>

            <div class="flex flex-wrap gap-2">
                <div class="flex gap-2 w-full items-center" [ngClass]="isMobile ? 'flex-wrap' : 'flex-nowrap'">
                    <div class="flex items-center">
                        <ng-container *ngIf="searchTemplate">
                            <ng-container *ngTemplateOutlet="searchTemplate"></ng-container>
                        </ng-container>
                    </div>

                    <!-- Mobile filter toggle button -->
                    <div class="md:hidden ml-auto">
                        <p-button icon="pi pi-sliders-h" styleClass="p-button-rounded" [severity]="'secondary'" (onClick)="showFilters = !showFilters"></p-button>
                    </div>

                    <!-- Filters container with toggle for mobile -->
                    <div class="flex flex-wrap gap-2 items-center w-full" [ngClass]="{ hidden: isMobile && !showFilters, flex: !isMobile || showFilters }">
                        <ng-container *ngIf="filtersTemplate">
                            <ng-container *ngTemplateOutlet="filtersTemplate"></ng-container>
                        </ng-container>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class PageHeader {
    // Input signal for title
    title = input<string>('Page Title');
    inline = input<boolean>(false);

    // Services
    layoutService = inject(LayoutService);

    // Mobile responsiveness
    showFilters: boolean = false;

    // Output for clearing filters
    clearFilters = output();

    // Content projection for actions (buttons), search, and filters
    @ContentChild('actionsTemplate') actionsTemplate?: TemplateRef<any>;
    @ContentChild('searchTemplate') searchTemplate?: TemplateRef<any>;
    @ContentChild('filtersTemplate') filtersTemplate?: TemplateRef<any>;

    get isMobile(): boolean {
        return this.layoutService.isMobile();
    }
}
