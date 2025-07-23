import { DrawerService, DrawerState } from '../services/drawer.service';
import { MessageService } from 'primeng/api';
import { InputSignal, OnInit, OnDestroy, signal, EffectRef, Component } from '@angular/core';

@Component({
    template: '',
    standalone: true
})
export abstract class BaseDrawerComponent<T = any> implements OnInit, OnDestroy {
    protected isInitialized = signal(false);
    protected destroyEffect?: EffectRef;

    ngOnInit(): void {
        this.initializeForm();
        this.isInitialized.set(true);
        // Do NOT call effect() here!
    }

    ngOnDestroy(): void {
        if (this.destroyEffect) {
            this.destroyEffect.destroy();
        }
    }

    // Common lifecycle methods
    protected onClose(): void {
        this.resetForm();
        this.drawerService.close(this.key());
    }
    
    protected onSave(): void {
        if (this.validateForm()) {
            const data = this.getFormData();
            this.drawerService.getState<T>(this.key()).onSave(data);
        }
    }
    
    protected resetForm(): void {
        // Override in concrete classes if needed
    }
    
    protected getDrawerState(): DrawerState<T> {
        return this.drawerService.getState<T>(this.key());
    }
    
    protected getMetadata(): Record<string, any> {
        return this.drawerService.getState<T>(this.key()).metadata();
    }
    
    protected getMetadataValue<K extends keyof Record<string, any>>(key: K): Record<string, any>[K] {
        return this.getMetadata()[key];
    }
    
    protected updateDrawerVisibility(visible: boolean): void {
        this.isDrawerVisible.set(visible);
    }
    
    protected handleDataReceived(data: T | undefined): void {
        if (data) {
            this.onDataReceived(data);
        }
    }
    
    // Abstract methods to be implemented by concrete classes
    protected abstract initializeForm(): void;
    protected abstract onDataReceived(data: T): void;
    protected abstract validateForm(): boolean;
    protected abstract getFormData(): T;
    
    // Properties that concrete classes must provide
    protected abstract drawerService: DrawerService;
    protected abstract messageService: MessageService;
    protected abstract key: InputSignal<string | undefined>;
    protected abstract isDrawerVisible: { set: (value: boolean) => void };
} 