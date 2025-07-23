import { Injectable, inject } from '@angular/core';
import { DrawerService } from './drawer.service';
import { 
    ClientDrawerConfig, 
    ClientData, 
    SalesDrawerConfig, 
    SalesData, 
    CollectionDrawerConfig, 
    CollectionData,
    ReceiptDrawerConfig,
    ReceiptData,
    ArticleDrawerConfig,
    ArticleData,
    StockDrawerConfig
} from '../interfaces/drawer-configs';

@Injectable({ providedIn: 'root' })
export class DrawerFactory {
    private drawerService = inject(DrawerService);
    
    // Book drawer methods
    openBookDrawer(config: Partial<any>): void {
        this.drawerService.open<any>({
            title: 'Libro',
            ...config
        });
    }
    
    openBookView(book: any): void {
        this.openBookDrawer({
            key: 'book-drawer',
            title: 'Detalle Libre',
            data: book,
            metadata: { 
                Id: book.id, 
                mode: 'view' 
            }
        });
    }
    openDrawerScraping(config: Partial<any>): void {
        this.drawerService.open<any>({
            title: 'Nuevo Scraping',
            ...config
        });
    }

    openNewScrape(): void {
        this.openBookDrawer({
            key: 'drawer-scrape',
            title: 'Nuevo Scraping',
            metadata: { 
                mode: 'edit' 
            }
        });
    }
    
} 