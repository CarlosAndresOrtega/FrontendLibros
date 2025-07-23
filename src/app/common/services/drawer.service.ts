import { Injectable, signal, WritableSignal } from '@angular/core';

export interface BaseDrawerConfig<T = any> {
    key?: string;
    title: string;
    data?: T;
    onClose?: () => void;
    onSave?: (data: T) => void;
    metadata?: Record<string, any>; // For flexible additional properties
}

export interface DrawerState<T = any> {
    visible: WritableSignal<boolean>;
    title: WritableSignal<string>;
    data: WritableSignal<T | undefined>;
    metadata: WritableSignal<Record<string, any>>;
    onClose: () => void;
    onSave: (data: T) => void;
}

@Injectable({ providedIn: 'root' })
export class DrawerService {
    private defaultDrawer: DrawerState = this.createState();
    // mapas de drawers adicionales
    private drawers = new Map<string, DrawerState>();

    private createState<T = any>(): DrawerState<T> {
        return {
            visible: signal(false),
            title: signal(''),
            data: signal<T | undefined>(undefined),
            metadata: signal({}),
            onClose: () => {},
            onSave: () => {},
        };
    }

    private getDrawer<T = any>(key?: string): DrawerState<T> {
        if (!key) {
            return this.defaultDrawer as DrawerState<T>;
        }
        if (!this.drawers.has(key)) {
            this.drawers.set(key, this.createState());
        }
        return this.drawers.get(key)! as DrawerState<T>;
    }

    // Generic open method
    open<T = any>(config: BaseDrawerConfig<T>): void {
        const state = this.getDrawer<T>(config.key);
        state.title.set(config.title);
        state.data.set(config.data);
        state.metadata.set(config.metadata ?? {});
        state.onClose = config.onClose ?? (() => {});
        state.onSave = config.onSave ?? (() => {});
        state.visible.set(true);
    }

    close(key?: string): void {
        const state = this.getDrawer(key);
        state.visible.set(false);
        setTimeout(() => {
            state.onClose();
            this.resetState(state);
        }, 300);
    }

    save<T = any>(key?: string): void {
        const state = this.getDrawer<T>(key);
        const data = state.data();
        if (data !== undefined) {
            state.onSave(data);
        }
    }

    updateTitle(title: string, key?: string): void {
        this.getDrawer(key).title.set(title);
    }

    updateData<T = any>(data: T, key?: string): void {
        this.getDrawer<T>(key).data.set(data);
    }

    updateMetadata(metadata: Record<string, any>, key?: string): void {
        this.getDrawer(key).metadata.set(metadata);
    }

    getState<T = any>(key?: string): DrawerState<T> {
        return this.getDrawer<T>(key);
    }

    private resetState(state: DrawerState): void {
        state.title.set('');
        state.data.set(undefined);
        state.metadata.set({});
        state.onClose = () => {};
        state.onSave = () => {};
    }

    // accesos directos para el drawer por defecto
    get visible() {
        return this.defaultDrawer.visible;
    }
    get title() {
        return this.defaultDrawer.title;
    }
    get data() {
        return this.defaultDrawer.data;
    }
    get metadata() {
        return this.defaultDrawer.metadata;
    }
}
