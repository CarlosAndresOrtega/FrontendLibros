import { CommonModule } from '@angular/common';
import { Component, ContentChild, effect, inject, Input, input, OnInit, output, signal, TemplateRef, ViewChild, EffectRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DrawerModule } from 'primeng/drawer';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
// import { CustomersService } from './customers.service';
import { catchError, map, Observable, of } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { LayoutService } from '@/layout/service/layout.service';
import { ConfirmationModalService } from '@/common/services/confirmation-modal.service';
import { DrawerService } from '@/common/services/drawer.service';
import { BaseDrawerComponent } from '@/common/components/base-drawer.component';
import { ClientData } from '@/common/interfaces/drawer-configs';
import { BooksService } from '../books.service';

@Component({
    selector: 'drawer-book',
    imports: [
        CommonModule,
        TabsModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
        FileUploadModule,
        ToastModule,
        TimelineModule,
        DrawerModule,
        ButtonModule,
        SelectModule,
        DatePickerModule,
        GoogleMapsModule,
    ],
    standalone: true,
    template: `
        <p-drawer [visible]="isDrawerVisible()" position="right" [header]="getDrawerState().title()" [modal]="true" styleClass="!w-full md:!w-80 lg:!w-[30rem]" (onHide)="onClose()">
            <ng-template #content>
                <p-tabs [value]="tabValue">
                    <p-tablist>
                        <p-tab (click)="tabValue = 0" [value]="0">General</p-tab>
                    </p-tablist>
                    <p-tabpanels>
                        <p-tabpanel [value]="0">
                            <form class="flex flex-col gap-4" *ngIf="formGroup" [formGroup]="formGroup">
                                <!-- Título -->
                                <div class="flex flex-col gap-2">
                                    <label for="title">Título</label>
                                    <input pInputText id="title" formControlName="title" type="text" />
                                </div>

                                <!-- Precio -->
                                <div class="flex flex-col gap-2">
                                    <label for="price">Precio</label>
                                    <input pInputText id="price" formControlName="price" type="text"/>
                                </div>

                                <!-- Rating -->
                                <div class="flex flex-col gap-2">
                                    <label for="rating">Rating</label>
                                    <input pInputText id="rating" formControlName="rating" type="number" />
                                </div>

                                <!-- Stock -->
                                <div class="flex flex-col gap-2">
                                    <label for="stock">Stock</label>
                                    <input pInputText id="stock" formControlName="stock" type="number" />
                                </div>

                                <!-- Categoría -->
                                <div class="flex flex-col gap-2">
                                    <label for="category">Categoría</label>
                                    <input pInputText id="category" formControlName="category" type="text" />
                                </div>

                                <!-- Descripción -->
                                <div class="flex flex-col gap-2">
                                    <label for="description">Descripción</label>
                                    <p class="p-3 border rounded bg-surface-50 dark:bg-surface-800 text-sm" style="white-space: pre-line;">
                                        {{ formGroup.get('description')?.value }}
                                    </p>
                                </div>
                            </form>
                        </p-tabpanel>
                    </p-tabpanels>
                </p-tabs>
            </ng-template>
            <ng-template #footer>
                <div class="flex gap-4">

                    <ng-container *ngIf="getDrawerState().title().includes('Detalle'); else defaultFooter">
                        <ng-container *ngIf="actionsTemplate">
                            <ng-container *ngTemplateOutlet="actionsTemplate"></ng-container>
                        </ng-container>
                    </ng-container>

                    <ng-template #defaultFooter>
                        <p-button label="Descartar" [rounded]="true" (click)="onClose()" severity="secondary" />
                    </ng-template>
                </div>
            </ng-template>
        </p-drawer>
    `,
})
export class DrawerBook extends BaseDrawerComponent<ClientData> {
    @ViewChild('hiddenFileUpload') hiddenFileUpload!: FileUpload;
    @ViewChild('map') googleMap!: GoogleMap;
    @ContentChild('actionsTemplate') actionsTemplate?: TemplateRef<any>;

    drawerService = inject(DrawerService);
    messageService = inject(MessageService);
    booksService = inject(BooksService);
    layoutService = inject(LayoutService);
    confirmationModalService = inject(ConfirmationModalService);
    fb = inject(FormBuilder);

    // Form groups
    formGroup!: FormGroup;
    readonlyMode = false;

    // Component state
    tabValue: number = 0;
    clientImages = signal<any>([]);
    allInteractions$: Observable<any> = of([]);
    selectedImageId = signal<number | undefined>(undefined);
    isDrawerVisible = signal(false);

    key = input<string | undefined>(undefined);

    constructor() {
        super();
        this.destroyEffect = effect(() => {
            if (!this.isInitialized()) {
                return;
            }
            const state = this.drawerService.getState<any>(this.key());
            const data = state.data();
            if (state.visible() && data) {
                this.onDataReceived(data);
            }
            this.updateDrawerVisibility(state.visible());
        });
    }

    // Implementation of abstract methods from BaseDrawerComponent
    protected override initializeForm(): void {
        this.setForms();
    }

    protected override onDataReceived(data: any): void {
        this.getData();
    }

    protected override validateForm(): boolean {
        return this.formGroup?.valid ?? false;
    }

    protected override getFormData(): any {
        return {
            ...this.formGroup.value,
        };
    }


    getData() {
        const bookId = this.getMetadataValue('Id');
        if (!bookId) {
            return;
        }

        this.booksService.getBookById(bookId).subscribe({
            next: (data: any) => {

                // ✅ Hacemos el patch con los datos recibidos
                this.formGroup.patchValue({
                    title: data.title,
                    price: `£${data.price}`,
                    rating: data.rating,
                    stock: data.stock,
                    category: data.category,
                    description: data.description,
                });

                // ✅ Deshabilitamos el formulario para solo lectura
                this.formGroup.disable();
            },
            error: (err) => {
                console.error('Error fetching book details:', err);
            },
        });
    }

    setForms() {
        this.formGroup = this.fb.group({
            title: [''],
            price: [''],
            rating: [0],
            stock: [0],
            category: [''],
            description: [''],
        });
    }
}
