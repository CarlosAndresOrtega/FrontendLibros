import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { PageHeader } from '../../common/components/header';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
// import { booksService } from './books.service';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { LayoutService } from '@/layout/service/layout.service';
import { ListboxModule } from 'primeng/listbox';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TimelineModule } from 'primeng/timeline';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { QueryParamsService } from '@/common/services/query-params.service';
import { FilterGroup } from '../../common/components/filter-group';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { Column } from '@/common/utils/column.interface';
import { ConfirmationModalService } from '@/common/services/confirmation-modal.service';
import { DrawerService } from '@/common/services/drawer.service';
import { DrawerFactory } from '@/common/services/drawer-factory.service';
import { BooksService } from './books.service';
import { map } from 'rxjs';
import { Book, BooksResponse } from './interface/book.model';
import { DrawerBook } from './drawer/drawer-form';
import { bookList } from '@/common/components/list';
import { Dropdown, DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'books-container',
    standalone: true,
    providers: [MessageService],
    template: ` <div class="grid grid-cols-12 gap-4 h-screen overflow-hidden">
        <div class="col-span-12 h-full">
            <div class="card max-md:rounded-b-none max-md:mb-0">
                <page-header [title]="'Libros'">
                    <ng-template #actionsTemplate>
                        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                            <p-dropdown [options]="pageOptions" [(ngModel)]="selectedPage" placeholder="Página Scraping" optionLabel="label" class="w-full sm:w-48"> </p-dropdown>
                            <p-button label="Scraping Manual" rounded="true" styleClass="p-button-primary !text-white w-full sm:w-auto" (onClick)="openScraping()"> </p-button>
                        </div>
                    </ng-template>

                    <ng-template #filtersTemplate>
                        <filter-group style="width: 100%" [filters]="filters()" [queryParams]="qpService.queryParams()" (selectedFilters)="onFilterSelect($event)" (clearFilters)="onClearFilters()"></filter-group>
                    </ng-template>
                </page-header>
            </div>
            <div class="card h-[calc(100vh-12rem)] flex flex-col">
                <p-toast />
                <div class="flex-1 overflow-auto">
                    <books-list [books]="books()" [cols]="cols" [hasContextualMenu]="true" (onSort)="onSort($event)" (menuClick)="handleMenuClick($event)">
                        <ng-template #listItem let-item let-first="first">
                            <div class="flex flex-col p-6 gap-4" [ngClass]="{ 'border-t border-surface-200 dark:border-surface-700': !first }">
                                <div class="flex justify-between items-center flex-1 gap-6">
                                    <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                        <div class="flex flex-col gap-1 max-w-[80%] break-words">
                                            <span class="font-medium text-secondary text-lg">{{ item.title }}</span>
                                            <div class="text-lg font-medium text-surface-900 dark:text-surface-0 mt-2">£{{ item.price }}</div>
                                        </div>
                                    </div>
                                    <div class="flex items-end justify-end gap-1">
                                        <div class="text-lg font-medium text-surface-900 dark:text-surface-0 mt-2 text-right max-w-[80%] break-words">
                                            {{ item.category }}
                                        </div>
                                        <button type="button" class="text-surface-500 dark:text-surface-300" (click)="openBook(item)">
                                            <i class="pi pi-chevron-right"></i>
                                        </button>
                                        <!-- [severity]="item.estadoCliente | statusPipe" -->
                                    </div>
                                </div>
                            </div>
                        </ng-template>

                        <ng-template #menuTemplate>
                            <p-menu #menu [popup]="true" appendTo="body"></p-menu>
                        </ng-template>
                    </books-list>
                </div>

                <div class="sticky bottom-0 bg-white dark:bg-surface-900">
                    <p-paginator (onPageChange)="onPageChange($event)" [first]="first" [rows]="pagination().pageSize" [totalRecords]="pagination().totalItems" [rowsPerPageOptions]="[10, 20, 30]" />
                </div>

                <!-- Drawer Form Component -->
                <drawer-book [key]="'book-drawer'">
                    <ng-template #actionsTemplate>
                        <!-- <p-button label="Eliminar" severity="danger" [rounded]="true" class="flex-1" /> -->
                        <div class="w-full flex justify-end gap-5">
                            <p-button label="Eliminar" [rounded]="true" (click)="confirmDeletebook(bookSelected())" severity="danger" />
                        </div>
                    </ng-template>
                </drawer-book>
            </div>
        </div>
    </div>`,
    imports: [
        bookList,
        CommonModule,
        ButtonModule,
        TableModule,
        InputIconModule,
        IconFieldModule,
        FormsModule,
        ToolbarModule,
        InputTextModule,
        DrawerModule,
        ReactiveFormsModule,
        ListboxModule,
        TagModule,
        DataViewModule,
        DialogModule,
        TabsModule,
        CheckboxModule,
        FileUploadModule,
        ToastModule,
        InputGroupModule,
        InputGroupAddonModule,
        TimelineModule,
        DrawerBook,
        PaginatorModule,
        FilterGroup,
        PageHeader,
        MenuModule,
        DropdownModule,
    ],
})
export class BooksContainer implements OnInit {
    searchInputStyles = {
        root: {
            borderRadius: '24px',
        },
    };

    @ViewChild('dt') dt!: Table;
    @ViewChild('menu') menu!: Menu;

    layoutService = inject(LayoutService);
    booksService = inject(BooksService);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    qpService = inject(QueryParamsService);
    messageService = inject(MessageService);
    confirmationModalService = inject(ConfirmationModalService);
    drawerService = inject(DrawerService);
    drawerFactory = inject(DrawerFactory);

    books = signal<Book[]>([]);
    bookSelected = signal<Book>({} as Book);

    pagination = signal({ currentPage: 1, pageSize: 10, totalItems: 10 });
    filters = signal([]);

    first: number = 0;

    cols: Column[] = [
        { field: 'id', header: 'ID' },
        { field: 'title', header: 'Titulo' },
        { field: 'price', header: 'Precio' },
        { field: 'rating', header: 'Rating' },
        { field: 'stock', header: 'Stock' },
        { field: 'category', header: 'Categoria' },
    ];

    selectedProducts: any[] = [];
    bookToDelete = signal<any>(undefined);
    deletebookDialog = false;
    deleteSelectedbooksDialog = false;

    pageOptions = Array.from({ length: 50 }, (_, i) => ({
        label: `Página ${i + 1}`,
        value: i + 1,
    }));

    selectedPage = 1;

    constructor() {}

    ngOnInit() {
        this.qpService.clearParams();
        this.getFilters();
        this.getData();
    }

    async getData() {
        if (this.qpService.isEmpty()) {
            await this.qpService.updateParams({ page: 1, size: 10 });
            this.first = 1;
        }

        this.booksService
            .getAll(this.qpService.queryParams())
            .pipe(
                map((data: BooksResponse) => {
                    const books = data.items.map((item: Book) => ({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        rating: item.rating,
                        stock: item.stock,
                        category: item.category,
                    }));
                    return { items: books, pagination: data.pagination };
                }),
            )
            .subscribe(
                (data) => {
                    this.books.set(data.items);
                    this.pagination.set(data.pagination);
                },
                (error) => console.error(error),
            );
    }

    getFilters() {
        this.booksService.getFilters().subscribe({
            next: (data: any) => {
                const preparedFilters = this.qpService.prepareFilters(data.filters);
                this.filters.set(preparedFilters);
            },
            error: (error) => console.error(error),
        });
    }

    openScraping() {
        this.booksService.scraping(this.selectedPage).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Obtención exitosa',
                    detail: 'Se obtuvo correctamente los libros',
                });
                this.getData();
                this.getFilters();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ocurrió un error al obtener los libros',
                });
                console.error('Error scraping books:', error);
            },
        });
    }

    openBook(item: any) {
        this.bookSelected.set(item);
        this.drawerFactory.openBookView(item);
    }

    confirmDeletebook(book: any) {
        this.bookToDelete.set(book);
        this.confirmationModalService
            .confirm({
                header: 'Borrar Libro',
                message: '¿Estás seguro de querer eliminar este libro?',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Si',
                rejectLabel: 'No',
                severity: 'error',
            })
            .then((confirmed) => {
                if (confirmed) {
                    this.deleteSingleBook();
                }
            });
    }

    deleteSingleBook() {
        if (!this.bookToDelete()) return;

        this.booksService.deleteBook(this.bookToDelete().id).subscribe({
            next: () => {
                this.drawerService.close('book-drawer');

                this.messageService.add({
                    severity: 'success',
                    summary: 'Eliminado',
                    detail: 'Libro eliminado con éxito',
                });
                this.getData();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ocurrió un error al eliminar el libro',
                });
                console.error('Error deleting book:', error);
            },
        });
    }

    async onPageChange(event: PaginatorState) {
        this.first = event.first!;
        await this.qpService.updateParams({ page: event.page! + 1, size: event.rows });
        this.getData();
    }

    async onSort(sort: any) {
        await this.qpService.updateParams({ sort });
        this.getData();
    }

    async onFilterSelect(filter: any) {
        if (filter.queryParam === 'dateRange') {
            if (!filter.selectedItem) {
                await this.qpService.removeParams(['dateFrom', 'dateTo']);
            } else {
                await this.qpService.updateParams({
                    dateFrom: filter.selectedItem.dateFrom,
                    dateTo: filter.selectedItem.dateTo,
                });
            }
        } else if (filter.queryParam === 'price') {
            if (!filter.selectedItem) {
                await this.qpService.removeParams(['priceMin', 'priceMax']);
            } else {
                const [min, max] = filter.selectedItem;
                await this.qpService.updateParams({
                    priceMin: min,
                    priceMax: max,
                });
            }
        } else {
            if (!filter.selectedItem) {
                await this.qpService.removeParams([filter.queryParam]);
            } else {
                await this.qpService.updateParams({
                    [filter.queryParam]: filter.selectedItem.name,
                });
            }
        }
        await this.qpService.updateParams({ page: 1 });
        this.getData();
    }

    async onClearFilters() {
        const standardFilterParams = this.filters().flatMap((filter: any) => {
            if (filter.values) {
                return [filter.queryParam];
            } else {
                return [`${filter.queryParam}Min`, `${filter.queryParam}Max`];
            }
        });
        const allFilterParams = [...standardFilterParams];
        await this.qpService.removeParams(allFilterParams);
        await this.qpService.updateParams({ page: 1 });
        this.getData();
    }

    handleMenuClick(event: { event: Event; item: any }) {
        const menuItems = [
            {
                label: 'Detalle Libro',
                icon: 'pi pi-eye',
                command: () => this.openBook(event.item),
            },
            {
                label: 'Eliminar Libro',
                icon: 'pi pi-trash',
                command: () => this.confirmDeletebook(event.item),
            },
        ];
        this.menu.model = menuItems;
        this.menu.toggle(event.event);
    }
}
