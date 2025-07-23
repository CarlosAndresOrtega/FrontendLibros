import { BaseDrawerConfig } from '../services/drawer.service';

// Client-related interfaces
export interface ClientData {
    id?: number;
    nombres: string;
    apellidos: string;
    documento: string;
    fechaNacimiento?: Date;
    nivelConfianzaId?: number;
    capacidadPago?: number;
    tel1?: string;
    tel2?: string;
    tel3?: string;
    mail?: string;
    clienteRubroComercioId?: number;
    comercioNombre?: string;
    horarioComercial?: string;
    domicilio1?: string;
    domicilio1Obs?: string;
    clienteLocalidad1Id?: number;
    clienteBarrioId?: number;
    domicilio2?: string;
    clienteLocalidad2Id?: number;
    latitud?: number;
    longitud?: number;
    sameAddressFlag?: boolean;
    paymentEffectiveness?: string;
    paymentEffectivenessHistory?: string;
    availableCreditLimit?: string;
    planProgress?: string;
    clientSeniority?: string;
}

export interface ClientDrawerConfig extends BaseDrawerConfig<ClientData> {
    metadata?: {
        clientId?: number;
        mode?: 'create' | 'edit' | 'view';
    };
}

// Sales-related interfaces
export interface SalesData {
    id?: number;
    clientId: number;
    saleTypeId: number;
    agreedDeliveryDate?: Date;
    deliveryAddress?: string;
    paymentMethodId: number;
    paymentStartDate?: Date;
    quotasCount?: number;
    quotaAmount?: number;
    observations?: string;
    product?: string;
}

export interface SalesDrawerConfig extends BaseDrawerConfig<SalesData> {
    metadata?: {
        clientId?: number;
        saleId?: number;
        mode?: 'create' | 'edit' | 'view';
    };
}

// Collections-related interfaces
export interface CollectionData {
    id?: number;
    collectionId?: number;
    amount: number;
    clientId: number;
    saleNumber?: string;
    amountToCollect?: number;
    reason: number;
    comments?: string;
    guaranteeRequested?: boolean;
    plan?: string;
    installmentAmount?: number;
    debt?: number;
    paidInstallments?: string;
    pendingInstallments?: string;
    amountPayments?: string;
    delay?: string;
    arrears?: string;
    paymentEffectiveness?: string;
    collectionOrder?: number;
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
}

export interface CollectionDrawerConfig extends BaseDrawerConfig<CollectionData> {
    metadata?: {
        clientId?: number;
        collectionId?: number;
        type?: 'planificada' | 'realizada';
    };
}

// Receipt-related interfaces
export interface ReceiptData {
    id?: number;
    amount: string;
    clientId: string;
    saleNumber: string;
    reason: string;
    comments: string;
    guaranteeRequested: string;
    plan: string;
    installmentAmount: string;
    debt: string;
    paidInstallments: string;
    pendingInstallments: string;
    delay: string;
    arrears: string;
    paymentEffectiveness: string;
}

export interface ReceiptDrawerConfig extends BaseDrawerConfig<ReceiptData> {
    metadata?: {
        clientId?: number;
        receiptId?: number;
        type?: 'planificada' | 'realizada';
    };
}

// Article-related interfaces
export interface ArticleData {
    id?: number;
    name: string;
    extendedDescription?: string;
    supplier?: string;
    brand: string;
    model: string;
    category: string;
    subcategory?: string;
    cost: string;
    initialStock?: string;
    warehouses?: number[];
    currentCost?: string;
    internalCost: string;
    internalMarkup: string;
    internalCostDollars?: string;
    costInDollars?: boolean;
    promotionalPlan?: boolean;
    planMarkup?: string;
    planDays?: string;
}

export interface ArticleDrawerConfig extends BaseDrawerConfig<ArticleData> {
    metadata?: {
        articleId?: number;
        mode?: 'create' | 'edit' | 'view';
    };
}
export interface StockDrawerConfig extends BaseDrawerConfig{
    metadata?: {
        articleId?: number;
    };
} 