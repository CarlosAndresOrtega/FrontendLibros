import { LayoutService } from '@/layout/service/layout.service';
import { CommonModule } from '@angular/common';
import { Component, ContentChild, inject, input, Input, OnInit, output, Signal, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DataViewModule } from 'primeng/dataview';
import { QueryParamsService } from '@/common/services/query-params.service';
import { MenuModule } from 'primeng/menu';
import { MenuItem, SortEvent } from 'primeng/api';

@Component({
    selector: 'books-list',
    imports: [CommonModule, ButtonModule, TableModule, InputIconModule, IconFieldModule, FormsModule, TagModule, TooltipModule, DataViewModule, MenuModule],
    standalone: true,
    template: `
        <ng-container *ngIf="!layoutService.isMobile()">
            <p-table
                #dt
                [value]="books()"
                [rows]="books().length"
                [columns]="cols"
                [tableStyle]="{ 'min-width': '75rem' }"
                [rowHover]="true"
                [size]="'large'"
                [resetPageOnSort]="false"
                sortMode="multiple"
                (onSort)="onSortHandler($event)"
                [selection]="selectedRows()"
                (selectionChange)="onSelectionChange($event)"
            >
                <ng-template #header>
                    <tr>
                        @if (showCheckbox) {
                            <th>
                                <p-tableHeaderCheckbox />
                            </th>
                        }

                        @for (col of cols; track $index) {
                            <th class="whitespace-nowrap" pSortableColumn="{{ col.field }}">
                                {{ col.header }}
                                <p-sortIcon field="{{ col.field }}" />
                            </th>
                        }
                        <th *ngIf="hasContextualMenu()" class="bg-surface-0 dark:bg-surface-900 sticky right-0"></th>
                    </tr>
                </ng-template>
                <ng-template #body let-rowData let-columns="columns">
                    <tr>
                        @if (showCheckbox) {
                            <td>
                                <p-tableCheckbox [value]="rowData" />
                            </td>
                        }
                        @for (col of columns; track $index) {
                            @if (!col.customComponent) {
                                <td class="truncate max-w-[20ch]" pTooltip="{{ rowData[col.field] }}" (click)="openItem.emit(rowData)" tooltipPosition="bottom">{{ rowData[col.field] }}</td>
                            }
                            @if (col.customComponent === 'tag') {
                                <td>
                                    <p-tag rounded="true" [value]="rowData[col.field]" styleClass="!py-2 !px-4 !rounded-full !font-medium"></p-tag>
                                </td>
                            }
                            @if (col.customComponent === 'img') {
                                <td>
                                    <div class="w-12 h-12">
                                        <img Class="h-full w-full object-contain" [src]="rowData[col.field]" alt="" />
                                    </div>
                                </td>
                            }
                            @if (col.customComponent === 'clickable') {
                                <td class="truncate max-w-[20ch] cursor-pointer" pTooltip="{{ rowData[col.field] }}" (click)="openItem.emit(rowData[col.field])" tooltipPosition="bottom">{{ rowData[col.field] }}</td>
                            }
                        }
                        <td *ngIf="hasContextualMenu()" class="bg-surface-0 dark:bg-surface-900 sticky right-0 hover:bg-[#f1f5f9] dark:hover:bg-[#27272a]">
                            <div class="flex justify-center">
                                <button pButton type="button" icon="pi pi-ellipsis-h" class="p-button-rounded p-button-text p-button-plain cursor-pointer" (click)="onMenuToggle($event, rowData)"></button>
                            </div>
                            <ng-container *ngIf="menuTemplate">
                                <ng-container *ngTemplateOutlet="menuTemplate; context: { $implicit: rowData }"></ng-container>
                            </ng-container>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </ng-container>

        <ng-container *ngIf="layoutService.isMobile()">
            <p-dataview #dv [value]="books()" [rows]="books().length">
                <ng-template #list let-items>
                    <div class="grid grid-cols-12 gap-4 grid-nogutter">
                        <div class="col-span-12" *ngFor="let item of items; let first = first">
                            <ng-container *ngTemplateOutlet="customItemTemplate; context: { $implicit: item, first: first }"></ng-container>
                        </div>
                    </div>
                </ng-template>
            </p-dataview>
        </ng-container>
    `,
})
export class bookList {
    @ContentChild('listItem') customItemTemplate!: TemplateRef<any>;
    @ContentChild('menuTemplate') menuTemplate!: TemplateRef<any>;
    isSorted: boolean = false;

    layoutService = inject(LayoutService);

    @Input() showCheckbox = false;
    @Input() cols!: any;

    books = input<any>([]);
    pagination = input({ currentPage: 1, pageSize: 10, totalItems: 0 });
    hasContextualMenu = input(false);
    onSort = output();
    lastSort = signal<string[]>([]);
    menuClick = output<{ event: Event; item: any }>();

    openItem = output();
    /**
     * Signal output for selected items
     */
    selectedItems = output<any[]>();
    /**
     * Signal holding current selected rows
     */
    selectedRows = signal<any[]>([]);

    // TODO: add removable sorting
    onSortHandler(event: any) {
        const sort = event.multisortmeta.map((elem: any) => {
            return `${elem.field}:${elem.order === 1 ? 'ASC' : 'DESC'}`;
        });

        if (JSON.stringify(sort) !== JSON.stringify(this.lastSort())) {
            this.lastSort.set(sort);
            this.onSort.emit(sort);
        }
    }
    /**
     * Handler for selection changes in the table.
     * Emits selected rows to parent component.
     */
    onSelectionChange(selection: any[]) {
        this.selectedRows.set(selection);
        this.selectedItems.emit(selection);
    }

    /**
     * Handles the menu toggle event
     */
    onMenuToggle(event: Event, item: any) {
        event.stopPropagation();
        this.menuClick.emit({ event, item });
    }
}
